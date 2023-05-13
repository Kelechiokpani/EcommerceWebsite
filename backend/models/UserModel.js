const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto")

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: [3, "Name should be atLeast 3 character "],
    maxlength: [15, "Name can not be more than 15 characters"],
  },

  email: {
    type: String,
    required: [true, "Please enter your email address"],
    validate: [validator.isEmail, "please enter a valid email "],
    unique: true,
  },

  password: {
    type: String,
    required: [true, "Please enter your password!"],
    minlength: [6, "password should be greater than 8 character"],
    select: false,
  },

  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },

  role: {
    type: String,
    default: "user",
  },

  resetPasswordToken: String,
  resetPasswordTime: Date,

});

// Hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")){
    next()
  }
  this.password = await bcrypt.hash(this.password, 10)
})


// jwt token getJwtToken
userSchema.methods.getJwtToken = function() {
  // return jwt.sign({ id: this.public_id }, process.env.JWT_SECRET_KEY, {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES
  });
};

// comparing hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// forgot password
userSchema.methods.getResetToken = function () {
  // Generating token
  const resetToken = crypto.randomBytes(20).toString("hex")
  // hashing and adding resetPassword
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
  this.resetPasswordTime = Date.now() + 15 * 60 * 1000;
  return resetToken;
}

module.exports = mongoose.model("User", userSchema);
