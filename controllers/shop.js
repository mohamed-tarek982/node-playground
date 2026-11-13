const { Product } = require("../models");

exports.getProducts = async (req, res) => {
  res.render("shop/products", {
    pageTitle: "Products",
    products: await Product.findAll(),
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

exports.getCart = async (req, res) => {
  const products = await req.user.getCart();
  const total = products.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0,
  );
  res.render("shop/cart", { pageTitle: "Cart", products, total });
};

exports.postCart = async (req, res) => {
  // Adds the product with quantity 1, or increases its quantity if already in the cart
  await req.user.addToCart(req.body.productId);
  res.redirect("/shop/cart");
};

exports.postCartDeleteItem = async (req, res) => {
  await req.user.removeFromCart(req.body.productId);
  res.redirect("/shop/cart");
};

exports.postOrder = async (req, res) => {
  // Copies the cart items into a new order, then empties the cart
  const order = await req.user.createOrder();
  res.redirect(order ? "/shop/orders" : "/shop/cart");
};

exports.getOrders = async (req, res) => {
  const orders = await req.user.getOrders();
  res.render("shop/orders", { pageTitle: "Orders", orders });
};
