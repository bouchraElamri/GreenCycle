const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },

    price: { 
      type: Number, 
      required: true, 
      min: 0 
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    description: { 
      type: String, 
      trim: true 
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    category: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Category", 
      required: true 
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true, 
    },

    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },

    // Comments list
    comments: [commentSchema],
    
    images: [
        {
            type: String
        }
    ],

  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
