const { sequelize } = require("../utils/database");
const User = require("./user");
const Product = require("./product");
const Cart = require("./cart");
const CartItem = require("./cart-item");

// Associations
// Single to many relationship between User and Product
Product.belongsTo(User, { onDelete: "CASCADE" });
User.hasMany(Product);

// Many-to-many relationship between Cart and Product through CartItem
User.hasOne(Cart, { onDelete: "CASCADE" });
Cart.belongsTo(User);

// Many-to-many relationship between Cart and Product through CartItem
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

// Export the models and sequelize instance
module.exports = { sequelize, User, Product, Cart, CartItem };
