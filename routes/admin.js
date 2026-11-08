const express = require("express");

const adminController = require("../controllers/admin");

const router = express.Router();

// GET /admin/add-product
router.get("/add-product", adminController.getAddProduct);

// POST /admin/product-details
router.post("/add-product", adminController.postAddProduct);

// GET/POST /admin/edit-product/:id
router.get("/edit-product/:id", adminController.getEditProduct);
router.post("/edit-product/:id", adminController.postEditProduct);

// POST /admin/delete-product/:id
router.post("/delete-product/:id", adminController.postDeleteProduct);

module.exports = router;
