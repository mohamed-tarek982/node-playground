const express = require("express");

const productsController = require("../controllers/products");

const router = express.Router();

// GET /admin/add-product
router.get("/add-product", (req, res) => {
  res.render("add-product", { pageTitle: "Add Product" });
});

// POST /admin/product-details
router.post("/add-product", productsController.postAddProduct);

module.exports = router;
