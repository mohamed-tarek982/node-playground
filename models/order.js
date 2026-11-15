const mongoose = require("mongoose");

// items: a snapshot of the cart products taken at order time
const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        _id: false,
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        title: String,
        price: Number,
        quantity: Number,
      },
    ],
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

module.exports = mongoose.model("Order", orderSchema);
