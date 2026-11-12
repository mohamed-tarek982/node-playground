const express = require("express");
const path = require("path");

const app = express();

// Set the view engine
app.set("view engine", "pug");

// Set the views directory
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

const { User, sequelize } = require("./models");

// attach the current user to every request (must come before the routes)
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch(next);
});

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use("/admin", adminRoutes);
app.use("/shop", shopRoutes);

app.get("/", (req, res) => {
  res.redirect("/shop/products");
});

app.use((req, res, next) => {
  res.status(404).render("404", { pageTitle: "Page Not Found" });
});

// error handler: catches errors thrown in routes (including async ones)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Something went wrong. Please try again later.");
});

const { createDatabase } = require("./utils/database");

createDatabase()
  .then(() => sequelize.sync()) // set force: true to drop and recreate tables on every server restart
  .then(() => User.findOne({ where: { email: "test@test.com" } }))
  .then((user) => {
    if (!user) {
      return User.create({
        id: 1,
        name: "Tarek",
        email: "test@test.com",
      });
    }

    return user;
  })
  .then((user) => {
    user.createCart(); // create a cart for the user if it doesn't exist
  })
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  });
