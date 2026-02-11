const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema(
  {
    // link to User
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one seller profile per user
    },


    description: {
      type: String,
      trim: true,
    },

    profileUrl: String,
    bannerUrl: String,

    // contact information

    // address (same spirit as client addresses)
    address: {
      street: String,
      city: String,
      zip: String,
      country: String,
    },

    // business verification
    isVerified: {
      type: Boolean,
      default: false,
    },

    // seller statistics
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalSales: {
      type: Number,
      default: 0,
    },

    // payout / banking (simplified)
    bankAccount: {
      accountHolder: String,
      iban: String,
      bankName: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Seller", sellerSchema);
