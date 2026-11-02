const Product = require("../models/product");

exports.postAddProduct = (req, res) => {
  const product = new Product(req.body.productName);
  product.save();
  res.redirect("/shop/products");
};

exports.getProducts = (req, res) => {
  res.render("products", {
    pageTitle: "Products",
    products: Product.fetchAll(),
  });  
};

