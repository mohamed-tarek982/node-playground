const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/database");


// Sequelize model for the Product entity
const Product = sequelize.define(
  // model name
  "product",
  // model attributes
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: "Title is required." } },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: { msg: "Price must be a decimal number." },
        min: { args: [0], msg: "Price must be greater than or equal to 0." },
      },
    },
    imageUrl: {
      type: DataTypes.STRING(2048),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  // model options
  {
    //If you want the explicit table name avoid mnaual sequeilze pluralization
    tableName: "product",
    // this will automatically add createdAt and updatedAt columns to the table
    timestamps: true,
  },
);

module.exports = Product;


