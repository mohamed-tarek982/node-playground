const { sequelize } = require("../utils/database");
const User = require("./user");
const Product = require("./product");

// Associations
Product.belongsTo(User, { onDelete: "CASCADE" });
User.hasMany(Product);

module.exports = { sequelize, User, Product };
