const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
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

    description: { 
      type: String, 
      trim: true 
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    category: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Category", 
      required: true 
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Seller", 
      required: true, 
    },

    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },

    isAvailable: { 
      type: Boolean, 
      default: true 
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

productSchema.pre("save", function () {
  if (this.quantity === 0) {
    this.isAvailable = false;
  }
});

productSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate();

  // Check direct quantity set: update.quantity or update.$set.quantity
  const qtyDirect =
    update.quantity !== undefined
      ? update.quantity
      : update.$set && update.$set.quantity !== undefined
      ? update.$set.quantity
      : undefined;

  if (qtyDirect !== undefined) {
    if (update.$set) update.$set.isAvailable = qtyDirect === 0 ? false : true;
    else update.isAvailable = qtyDirect === 0 ? false : true;
    return;
  }

  // Handle $inc updates (e.g., decrementing quantity when creating an order)
  const incQty = update.$inc && update.$inc.quantity !== undefined ? update.$inc.quantity : undefined;
  if (incQty !== undefined) {
    const doc = await this.model.findOne(this.getQuery()).select("quantity");
    const currentQty = doc ? doc.quantity || 0 : 0;
    const newQty = currentQty + incQty;
    if (update.$set) update.$set.isAvailable = newQty === 0 ? false : true;
    else update.isAvailable = newQty === 0 ? false : true;
  }
});


module.exports = mongoose.model("Product", productSchema);
