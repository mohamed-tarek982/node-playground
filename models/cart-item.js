const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/database");

// Sequelize model for the CartItem entity (join table between Cart and Product)
const CartItem = sequelize.define("cartItem", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      isInt: { msg: "Quantity must be an integer." },
      min: { args: [1], msg: "Quantity must be at least 1." },
    },
  },
});

module.exports = CartItem;
