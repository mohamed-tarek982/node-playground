const express = require("express");
const path = require("path");

const router = express.Router();

router.get("/products", (req, res) => {
  res.render("products", { pageTitle: "Products" });
});

module.exports = router;
