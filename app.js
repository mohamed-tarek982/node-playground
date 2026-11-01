const express = require("express");
const path = require("path");

const bodyParser = require("body-parser");

const app = express();

// Set the view engine
app.set("view engine", "pug");

// Set the views directory
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: true }));

app.use("/admin", adminRoutes);
app.use("/shop", shopRoutes);

app.get("/", (req, res) => {
  res.redirect("/shop/products");
});

app.use((req, res, next) => {
  res.status(404).render("404", { pageTitle: "Page Not Found" });
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
