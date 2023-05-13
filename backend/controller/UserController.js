const User = require("../models/UserModel");
const ErrorHandler = require("../utils/ErrorHandler.js");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken")
const sendMail = require("../utils/sendMail.js");
const crypto = require ("crypto")




// Register User
exports.createUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "https://test.com",
      url: "https://test.com",
    },
  });
  sendToken(user, 200, res)
});


// login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("please enter email & password", 400));
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("User is not found with this email & password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("User is not found with this email & password", 401))
  }

  sendToken(user, 201, res)
  // const token = user.getJwtToken();
  // res.status(201).json({
  //   success: true,
  //   token,
  // });

})

// logout User
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  })

  res.status(200).json({
    success: true,
    message: "Log out Successful"
  })

})



// Forgot User password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })

  if (!user) {
    return next(new ErrorHandler("user not found with this email", 404))
  }

  // Get ResetPassword Token
  const resetToken = user.getResetToken()
  await user.save({
    validateBeforeSave: false
  });

  
  const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`
    const message  = `your password reset token is :- \n\n${resetPasswordUrl} `

  try {
        await sendMail({
          email: user.email,
          subject: `Ecommerce Store Password Recovery`,
          message,
        })
    res.status(200).json({
      success: true,
      message:`Email sent to ${user.email} successfully`
    })
  }catch (error){
    user.resetPasswordToken = undefined;
    user.resetPasswordTime = undefined;

          await user.save({
            validateBeforeSave: false
          });
          return next (new ErrorHandler(error.message,500))
  }
})


//Reset User Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

//  create Token hash
  const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

  const user = await  User.findOne({
    resetPasswordToken,
    resetPasswordTime: {$gt:Date.now()},
  })

  if(!user){
    return next(new ErrorHandler("Reset Password Url Is Invalid or has Expired", 400))
  }

  if(req.body.password !== req.body.confirmPassword){
    return next(new ErrorHandler("Password is not the same with Confirm Password", 400))
  }

  user.password = req.body.password;

  user.resetPasswordToken =undefined;
  user.resetPasswordTime = undefined;

  await user.save()

  sendToken(user,200,res)
})


// Get User Details
exports.userDetails = catchAsyncErrors(async (req, res, next)=>{
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success:true,
    user
  })
})



// Update User Password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password")

  console.log(user)
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if(!isPasswordMatched){
    return next(
        new  ErrorHandler("old password is Incorrect",  400)
    );
  }
  if(req.body.newPassword !== req.body.confirmPassword){
    return next(
        new ErrorHandler("Password is not the same with Confirm Password")
    )
  }
  user.password = req.body.newPassword;
  await user.save();
  
  sendToken(user,200,res)

})


//Update User Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next)=>{
  const newUserData ={
    name: req.body.name,
    email: req.body.email,
  };
//  we add cloudinary letter then we are giving condition for the avatar
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators:true,
    useFindAndModify:false,
  })

  res.status(200).json({
    success: true,
    user
  })

})


//Admin Get all Users
exports.getAllUsers = catchAsyncErrors(async (req, res, next)=>{
  const users = await User.find();
  res.status(200).json({
    success:true,
    users
  })
})


//Admin Get Single User details
exports.getSingleUsers = catchAsyncErrors(async (req, res, next)=>{

  const user = await User.findById(req.params.id);
  if(!user){
    return next(new ErrorHandler("User is not Found with this Id", 400))
  }

  res.status(200).json({
    success:true,
    user,
  })
})


//Admin Update User Role
exports.updateUserRole = catchAsyncErrors(async (req, res, next)=>{
  const newUserData ={
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

//  we add cloudinary letter then we are giving condition for the avatar
  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators:true,
    useFindAndModify:false,
  })

  res.status(200).json({
    success: true,
    user
  })

})

//Admin Delete User
exports.deleteUser = catchAsyncErrors(async (req, res, next)=>{
  const user = await User.findById(req.params.id)
//  we remove cloudinary letter then we are giving condition for the avatar
  if (!user) {
    return next(new ErrorHandler("User is not found with this id", 400));
  }
  await user.remove();

  res.status(200).json({
    success: true,
    message: "user deleted from database Successfully"
  })

})


