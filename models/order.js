const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/database");

// Sequelize model for the Order entity (a user can have many orders)
const Order = sequelize.define("order", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
});

module.exports = Order;
