const mongoose = require("mongoose");
const sellerModel = require("./seller.model");
const Product = require("./product.model");

const orderSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        seller : {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Seller",
          required: true,
        },
        name: String,        
        price: Number,      
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],

    deliveryAddress: {
      street: String,
      city: String,
      zip: String,
      country: String,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["confirmed", "delivered"],
      default: "confirmed",
    },
  },
  { timestamps: true }
);

orderSchema.pre("save", async function () {
  if (!this.isNew) {
    return;
  }

  for (const item of this.items || []) {
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: item.product, quantity: { $gte: item.quantity } },
      { $inc: { quantity: -item.quantity } },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      const err = new Error("Insufficient stock for one or more products");
      err.statusCode = 400;
      throw err;
    }
  }
});

module.exports = mongoose.model("Order", orderSchema);
