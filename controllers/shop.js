const Product = require("../models/product");

exports.getProducts = (req, res) => {
  res.render("shop/products", {
    pageTitle: "Products",
    products: Product.fetchAll(),
  });
};
