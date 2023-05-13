const express = require("express");
const {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview
} = require("../controller/ProductController.js");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth")

const router = express.Router();


router.route("/products").get(isAuthenticatedUser, getAllProducts);

router.route("/product/:id").get(isAuthenticatedUser, getSingleProduct);

router.route("/product/review").post(isAuthenticatedUser, createProductReview);

router.route("/product/new").post(isAuthenticatedUser, authorizeRoles('admin'),  createProduct);

router.route("/product/update/:id").put(isAuthenticatedUser, authorizeRoles('admin'), updateProduct);

router.route("/product/delete/:id").delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProduct);


module.exports = router;
