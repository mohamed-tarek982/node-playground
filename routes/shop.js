const express = require("express");
const router = express.Router();

const shopController = require("../controllers/shop");

// Seprate logic for handling the /products route in a controller
router.get("/products", shopController.getProducts);

module.exports = router;
