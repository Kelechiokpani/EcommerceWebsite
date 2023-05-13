const Product = require("../models/ProductModel.js");
const ErrorHandler = require("../utils/ErrorHandler.js");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Features = require("../utils/Features");


// create product
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});


// get All Products
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 8;
  const productCount = await Product.countDocuments();
  const Feature = new Features(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

  const products = await Feature.query;
  res.status(200).json({
    success: true,
    products,
    productCount,
  });
});


// get Single Product
exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product with this Id does not exist", 404));
  }
  res.status(200).json({
    success: true,
    product,
    // productCount
  });
});

// Update Products By-ID
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product with this Id does not exist", 404));
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useUnified: false,
  });
  res.status(200).json({
    success: true,
    product,
  });
});


// Delete Products By-ID
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product with this Id does not exist", 404));
  }
  await product.remove();
  res.status(200).json({
    success: true,
    message: "Product deleted Successfully",
  });
});



// Create New Review or Update Review
exports.createProductReview = catchAsyncErrors(async (req, res, next) =>{
  const { rating, comment, productId} = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId)

  const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
  );

  if(isReviewed){
    product.reviews.forEach((rev) => {
      if(rev.user.toString() === req.user._id.toString())
        (rev.rating = rating) (rev.comment = comment)
    });
  }else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  })

  product.ratings = avg / product.reviews.length;

  await product.save({validateBeforeSave: false})

  res.status(200).json({
    success: true,
  })

})