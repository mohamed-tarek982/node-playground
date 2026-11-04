const Product = require("../models/product");

exports.getProducts = (req, res) => {
  res.render("shop/products", {
    pageTitle: "Products",
    products: Product.fetchAll(),
  });
};

exports.getProductDetails = (req, res) => {
  const product = Product.findById(req.params.id);
  if (!product) {
    return res.status(404).render("404", { pageTitle: "Product Not Found" });
  }
  res.render("shop/product-details", {
    pageTitle: product.title,
    product,
  });
};
