const { ValidationError } = require("sequelize");
const Product = require("../models/product");

exports.getAddProduct = (req, res) => {
  res.render("admin/add-product", { pageTitle: "Add Product" });
};

exports.postAddProduct = async (req, res) => {
  const { productName, price, imageUrl, description } = req.body;

  try {
    await Product.create({ title: productName, price, imageUrl, description });
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(422).send(err.errors.map((e) => e.message).join(" "));
    }
    throw err; // other errors are forwarded to the error handler by Express 5
  }

  res.redirect("/shop/products");
};
