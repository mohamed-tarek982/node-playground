const { getDb } = require("../utils/database");
const { toObjectId } = require("./helpers");

const collection = () => getDb().collection("products");

class Product {
  static async create(data, userId) {
    await collection().insertOne({ ...data, userId, createdAt: new Date() });
  }

  static async findAll() {
    const products = await collection()
      .find()
      .sort({ createdAt: -1 })
      .toArray();
    return products;
  }

  static async findById(id) {
    const _id = toObjectId(id);
    if (!_id) return null;
    return collection().findOne({ _id });
  }

  static async findByIds(ids) {
    const products = await collection()
      .find({ _id: { $in: ids } })
      .toArray();
    return products;
  }

  static async update(id, data) {
    const _id = toObjectId(id);
    if (!_id) return false;
    const { matchedCount } = await collection().updateOne(
      { _id },
      { $set: { ...data, updatedAt: new Date() } },
    );
    return matchedCount > 0;
  }

  static async delete(id) {
    const _id = toObjectId(id);
    if (!_id) return false;
    // Delete the product from the products collection
    const { deletedCount } = await collection().deleteOne({ _id });
    // Remove the deleted product from all users' carts
    if (deletedCount) {
      await getDb()
        .collection("users")
        .updateMany({}, { $pull: { "cart.items": { productId: _id } } });
    }
    return deletedCount > 0;
  }
}

module.exports = { Product };
