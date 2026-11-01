const express = require("express");

const router = express.Router();

// GET /admin/add-product
router.get("/add-product", (req, res) => {
  res.send(`
    <form action="/admin/product-details" method="POST">
      <input type="text" name="productName" />
      <button type="submit">Submit</button>
    </form>
  `);
});

// POST /admin/product-details
router.post("/product-details", (req, res) => {
  console.log(req.body);
  res.send(`<h1>Product title: ${req.body.productName}</h1>`);
});

module.exports = router;
