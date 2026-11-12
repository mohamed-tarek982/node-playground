const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/database");

// Sequelize model for the OrderItem entity (join table between Order and Product)
const OrderItem = sequelize.define("orderItem", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  // Snapshot of the product price at the time of ordering
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
});

module.exports = OrderItem;
