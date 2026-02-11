const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    profileUrl: String,
    addresses: [
      {
        street: String,
        city: String,
        zip: String,
        country: String,
      }
    ],
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Client", clientSchema);