const { getDb } = require("../utils/database");

const collection = () => getDb().collection("orders");

class Order {
  // items: [{ productId, title, price, quantity }] - a snapshot taken at order time
  static async create(userId, items) {
    const doc = { userId, items, createdAt: new Date() };
    await collection().insertOne(doc); // insertOne sets doc._id
    return doc;
  }

  static async findByUser(userId) {
    const orders = await collection().find({ userId }).toArray();
    return orders;
  }
}

module.exports = Order;
