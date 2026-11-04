const express = require("express");
const router = express.Router();

const shopController = require("../controllers/shop");

// Seprate logic for handling the /products route in a controller
router.get("/products", shopController.getProducts);

router.get("/product-details/:id", shopController.getProductDetails);

module.exports = router;
