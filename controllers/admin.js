const { Product } = require("../models");

exports.getAddProduct = (req, res) => {
  res.render("admin/add-product", { pageTitle: "Add Product" });
};

exports.postAddProduct = async (req, res) => {
  const { productName, price, imageUrl, description } = req.body;

  await Product.create(
    { title: productName, price, imageUrl, description },
    req.user._id,
  );
  res.redirect("/shop/products");
};

const notFound = (res) =>
  res.status(404).render("404", { pageTitle: "Product Not Found" });

exports.getEditProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return notFound(res);
  res.render("admin/add-product", { pageTitle: "Edit Product", product });
};

exports.postEditProduct = async (req, res) => {
  const { productName, price, imageUrl, description } = req.body;
  const updated = await Product.update(req.params.id, {
    title: productName,
    price,
    imageUrl,
    description,
  });
  if (!updated) return notFound(res);
  res.redirect("/shop/products");
};

exports.postDeleteProduct = async (req, res) => {
  const deleted = await Product.delete(req.params.id);
  if (!deleted) return notFound(res);
  res.redirect("/shop/products");
};
