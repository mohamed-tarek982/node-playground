const mongoose = require("mongoose");
const { Product } = require("./product");
const Order = require("./order");

// The cart is embedded in the user document: { cart: { items: [{ productId, quantity }] } }
const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  // bcrypt hash; optional because the seeded test user has no password
  password: { type: String },
  cart: {
    items: [
      {
        _id: false,
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
  },
});

userSchema.statics.findOrCreate = function ({ name, email }) {
  return this.findOneAndUpdate(
    { email },
    { $setOnInsert: { name, email, cart: { items: [] } } },
    { upsert: true, new: true },
  );
};

userSchema.methods.addToCart = async function (productId) {
  const product = await Product.findByIdSafe(productId);
  if (!product) return false;

  // Increase the quantity if the product exist in the cart, otherwise add with quantity 1
  const isItemExist = this.cart.items.find((i) =>
    i.productId.equals(product._id),
  );
  if (isItemExist) isItemExist.quantity += 1;
  else this.cart.items.push({ productId: product._id, quantity: 1 });
  await this.save();
  return true;
};

userSchema.methods.removeFromCart = async function (productId) {
  if (!mongoose.isValidObjectId(productId)) return;
  this.cart.items = this.cart.items.filter(
    (i) => !i.productId.equals(productId),
  );
  await this.save();
};

// Cart products flattened: product.quantity
userSchema.methods.getCart = async function () {
  await this.populate("cart.items.productId");

  return this.cart.items
    .filter((i) => i.productId) // skip products that no longer exist
    .map((i) => ({ ...i.productId.toObject(), quantity: i.quantity }));
};

userSchema.methods.createOrder = async function () {
  const products = await this.getCart();
  if (products.length === 0) return null;

  const order = await Order.create({
    userId: this._id,
    items: products.map((p) => ({
      productId: p._id,
      title: p.title,
      price: p.price,
      quantity: p.quantity,
    })),
  });
  // Clear the cart
  this.cart.items = [];
  await this.save();
  return order;
};

// Orders with flat products: order.products[].quantity / .price
userSchema.methods.getOrders = async function () {
  const orders = await Order.find({ userId: this._id }).lean();

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
};

module.exports = mongoose.model("User", userSchema);
