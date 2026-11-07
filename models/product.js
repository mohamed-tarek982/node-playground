const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/database");

// trims strings and turns empty values into null
const trimmed = (field) =>
  function (value) {
    const v = typeof value === "string" ? value.trim() : value;
    this.setDataValue(field, v === "" ? null : v);
  };

const Product = sequelize.define(
  "product",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      set: trimmed("title"),
      validate: { notEmpty: { msg: "Title is required." } },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: { msg: "Price must be a non-negative number." },
        min: { args: [0], msg: "Price must be a non-negative number." },
      },
    },
    imageUrl: {
      type: DataTypes.STRING(2048),
      set: trimmed("imageUrl"),
    },
    description: {
      type: DataTypes.TEXT,
      set: trimmed("description"),
    },
  },
  {
    tableName: "product",
    timestamps: true,
  },
);

module.exports = Product;
