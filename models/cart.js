const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/database");

// Sequelize model for the Cart entity (one cart per user)
const Cart = sequelize.define("cart", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
});

module.exports = Cart;
