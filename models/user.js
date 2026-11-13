const { getDb } = require("../utils/database");
const { toObjectId } = require("./helpers");
const { Product } = require("./product");
const Order = require("./order");

const collection = () => getDb().collection("users");

// The cart is embedded in the user document: { cart: { items: [{ productId, quantity }] } }
class User {
  constructor(doc) {
    Object.assign(this, doc);
    this.cart = this.cart || { items: [] };
  }

  static async findById(id) {
    const _id = toObjectId(id);
    if (!_id) return null;
    const doc = await collection().findOne({ _id });
    return doc && new User(doc);
  }

  static async findOrCreate({ name, email }) {
    const doc = await collection().findOneAndUpdate(
      { email },
      { $setOnInsert: { name, email, cart: { items: [] } } },
      { upsert: true, returnDocument: "after" },
    );
    return new User(doc);
  }

  async addToCart(productId) {
    const product = await Product.findById(productId);
    if (!product) return false;

    // Increase the quantity if the product is already in the cart...
    const { matchedCount } = await collection().updateOne(
      { _id: this._id, "cart.items.productId": product._id },
      { $inc: { "cart.items.$.quantity": 1 } },
    );
    // ...otherwise add it with quantity 1
    if (!matchedCount) {
      await collection().updateOne(
        { _id: this._id },
        { $push: { "cart.items": { productId: product._id, quantity: 1 } } },
      );
    }
    return true;
  }

  async removeFromCart(productId) {
    const _id = toObjectId(productId);
    if (!_id) return;
    await collection().updateOne(
      { _id: this._id },
      { $pull: { "cart.items": { productId: _id } } },
    );
  }

  // Cart products flattened: product.quantity
  async getCart() {
    const items = this.cart.items;
    if (items.length === 0) return [];
    // Pass to the product all the products id in the cart to get it.
    const products = await Product.findByIds(items.map((i) => i.productId));
    return products.map((product) => ({
      ...product,
      quantity: items.find((i) => i.productId.equals(product._id)).quantity,
    }));
  }

  async createOrder() {
    const products = await this.getCart();
    if (products.length === 0) return null;

    const order = await Order.create(
      this._id,
      products.map((p) => ({
        productId: p._id,
        title: p.title,
        price: p.price,
        quantity: p.quantity,
      })),
    );
    // Clear the cart for database and for user object
    await collection().updateOne(
      { _id: this._id },
      { $set: { "cart.items": [] } },
    );
    this.cart.items = [];
    return order;
  }

  // Orders with flat products: order.products[].quantity / .price
  async getOrders() {
    const orders = await Order.findByUser(this._id);
    return orders.map((order) => ({
      _id: order._id,
      createdAt: order.createdAt,
      products: order.items.map((item) => ({
        _id: item.productId,
        title: item.title,
        quantity: item.quantity,
        price: item.price,
      })),
      total: order.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }));
  }
}

module.exports = User;
