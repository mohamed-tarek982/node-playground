const Product = require("../models/product");

exports.getAddProduct = (req, res) => {
  res.render("admin/add-product", { pageTitle: "Add Product" });
};

exports.postAddProduct = async (req, res) => {
  const { productName, price, imageUrl, description } = req.body;
  const product = new Product({ title: productName, price, imageUrl, description });

  const errors = product.validate();
  if (errors.length) {
    return res.status(422).send(errors.join(" "));
  }

  await product.save(); // errors are forwarded to the error handler by Express 5
  res.redirect("/shop/products");
};
