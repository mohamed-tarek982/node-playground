const { ValidationError } = require("sequelize");
const { Product } = require("../models");

exports.getAddProduct = (req, res) => {
  res.render("admin/add-product", { pageTitle: "Add Product" });
};

exports.postAddProduct = async (req, res) => {
  const { productName, price, imageUrl, description } = req.body;

  try {
    await req.user.createProduct({
      title: productName,
      price,
      imageUrl,
      description,
    });
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(422).send(err.errors.map((e) => e.message).join(" "));
    }
    throw err; // other errors are forwarded to the error handler by Express 5
  }

  res.redirect("/shop/products");
};

const notFound = (res) =>
  res.status(404).render("404", { pageTitle: "Product Not Found" });

exports.getEditProduct = async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return notFound(res);
  res.render("admin/add-product", { pageTitle: "Edit Product", product });
};

exports.postEditProduct = async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return notFound(res);

  const { productName, price, imageUrl, description } = req.body;
  try {
    await product.update({ title: productName, price, imageUrl, description });
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(422).send(err.errors.map((e) => e.message).join(" "));
    }
    throw err;
  }

  res.redirect(`/shop/products`);
};

exports.postDeleteProduct = async (req, res) => {
  const deleted = await Product.destroy({ where: { id: req.params.id } });
  if (!deleted) return notFound(res);
  res.redirect("/shop/products");
};
