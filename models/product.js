const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: String,
    description: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }, // adds createdAt / updatedAt
);

// Returns the product, or null if the id is invalid or not found (so callers can 404)
productSchema.statics.findByIdSafe = function (id) {
  if (!mongoose.isValidObjectId(id)) return null;
  return this.findById(id);
};

productSchema.statics.updateById = async function (id, data) {
  if (!mongoose.isValidObjectId(id)) return false;
  const { matchedCount } = await this.updateOne({ _id: id }, data, {
    runValidators: true,
  });
  return matchedCount > 0;
};

productSchema.statics.deleteById = async function (id) {
  if (!mongoose.isValidObjectId(id)) return false;
  const { deletedCount } = await this.deleteOne({ _id: id });
  // Remove the deleted product from all users' carts
  if (deletedCount) {
    await mongoose
      .model("User")
      .updateMany({}, { $pull: { "cart.items": { productId: id } } });
  }
  return deletedCount > 0;
};

const Product = mongoose.model("Product", productSchema);

module.exports = { Product };
