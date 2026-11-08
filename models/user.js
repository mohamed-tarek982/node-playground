const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/database");

// Sequelize model for the User entity
const User = sequelize.define("user", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: { msg: "Name is required." } },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: { msg: "Email must be a valid email address." } },
  },
});

module.exports = User;
