const express = require("express");
const router = express.Router();

const shopController = require("../controllers/shop");

// Seprate logic for handling the /products route in a controller
router.get("/products", shopController.getProducts);

router.get("/product-details/:id", shopController.getProductDetails);

router.get("/cart", shopController.getCart);
router.post("/cart", shopController.postCart);
router.post("/cart-delete-item", shopController.postCartDeleteItem);

module.exports = router;
