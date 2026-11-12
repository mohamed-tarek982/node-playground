const { Product, sequelize } = require("../models");

exports.getProducts = async (req, res) => {
  res.render("shop/products", {
    pageTitle: "Products",
    products: await Product.findAll(),
  });
};

exports.getProductDetails = async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) {
    return res.status(404).render("404", { pageTitle: "Product Not Found" });
  }
  res.render("shop/product-details", {
    pageTitle: product.title,
    product,
  });
};

exports.getCart = async (req, res) => {
  let cart = await req.user.getCart();
  if (!cart) cart = await req.user.createCart();
  const products = await cart.getProducts();
  const total = products.reduce(
    (sum, p) => sum + Number(p.price) * p.cartItem.quantity,
    0,
  );
  res.render("shop/cart", { pageTitle: "Cart", products, total });
};

exports.postCart = async (req, res) => {
  const productId = req.body.productId;

  // Get or create the user's cart
  let cart = await req.user.getCart();
  if (!cart) cart = await req.user.createCart();

  // If the product is already in the cart, increase its quantity
  // productInCart check first element of Array, if not found it will return undefined
  const [productInCart] = await cart.getProducts({ where: { id: productId } });
  if (productInCart) {
    // Sequeilze give us access to that product in betwen table with cartItem property
    // We use the cartItem here because it is the name of the junction table,
    productInCart.cartItem.quantity += 1;
    await productInCart.cartItem.save();
  } else {
    const product = await Product.findByPk(productId);
    // Add product to in between table with quantity 1
    await cart.addProduct(product, { through: { quantity: 1 } });
  }
  res.redirect("/shop/cart");
};

exports.postCartDeleteItem = async (req, res) => {
  const productId = req.body.productId;
  const cart = await req.user.getCart();
  if (cart) {
    const [product] = await cart.getProducts({ where: { id: productId } });
    // Remove the row from the in-between cartItem table. only
    if (product) await product.cartItem.destroy();
  }
  res.redirect("cart");
};

exports.postOrder = async (req, res) => {
  const cart = await req.user.getCart();
  const products = cart ? await cart.getProducts() : [];
  if (products.length === 0) return res.redirect("/shop/cart");

  // Create the order, copy cart items into it, then empty the cart - all or nothing
  await sequelize.transaction(async (transaction) => {
    const order = await req.user.createOrder({}, { transaction });
    for (const product of products) {
      await order.addProduct(product, {
        through: { quantity: product.cartItem.quantity, price: product.price },
        transaction,
      });
    }
    // Clear the cart (remove all rows from cartItem for this cart)
    await cart.setProducts(null, { transaction });
  });

  res.redirect("/shop/orders");
};

exports.getOrders = async (req, res) => {
  const orders = await req.user.getOrders({
    include: Product,
    order: [["createdAt", "DESC"]],
  });
  const ordersWithTotal = orders.map((order) => ({
    id: order.id,
    createdAt: order.createdAt,
    products: order.products,
    total: order.products.reduce(
      (sum, p) => sum + Number(p.orderItem.price) * p.orderItem.quantity,
      0,
    ),
  }));
  res.render("shop/orders", { pageTitle: "Orders", orders: ordersWithTotal });
};
