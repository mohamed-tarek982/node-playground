const Product = require("../models/product");

exports.getProducts = async (req, res) => {
  res.render("shop/products", {
    pageTitle: "Products",
    products: await Product.fetchAll(),
  });
};

exports.getProductDetails = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).render("404", { pageTitle: "Product Not Found" });
  }
  res.render("shop/product-details", {
    pageTitle: product.title,
    product,
  });
};
