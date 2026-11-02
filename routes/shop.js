const express = require("express");
const router = express.Router();

const productsController = require("../controllers/products");

// Seprate logic for handling the /products route in a controller
router.get("/products", productsController.getProducts);

module.exports = router;
