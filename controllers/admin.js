const Product = require("../models/product");

exports.getAddProduct = (req, res) => {
  res.render("admin/add-product", { pageTitle: "Add Product" });
};

exports.postAddProduct = (req, res) => {
  const { productName, price, imageUrl, description } = req.body;
  const product = new Product(productName, price, imageUrl, description);
  product.save();
  res.redirect("/shop/products");
};
