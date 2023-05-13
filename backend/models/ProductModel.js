const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter the name of this product"],
    trim: true,
    maxLength: [15, "Product name can not exceed more than 15 characters"],
  },

  description: {
    type: String,
    required: [true, "Please add a description for this product"],
    maxLength: [4000, "Description can not exceed 4000 characters"],
  },

  price: {
    type: Number,
    required: [true, "Please enter a price for your product"],
    maxLength: [8, "Price can not exceed 8 characters"],
  },
  discountPrice: {
    type: String,
    maxLength: [4, "Discount price can not exceed more than 4 characters"],
  },

  color: {
    type: String,
  },

  size: {
    type: String,
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },

      url: {
        type: String,
        required: true,
      },
    },
  ],

  category: {
    type: String,
    required: [true, "Please add a category of your product"],
  },

  stock: {
    type: Number,
    required: [true, "Please add some stock for your products"],
    maxLength: [3, "stock can not exceed 3 characters"],
  },

  numOfPreviews: {
    type: Number,
    default: 0,
  },

  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        // required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
      },
      time: {
        type: Date,
        default: Date.now(),
      },
    },
  ],

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    // required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Product", productSchema);
