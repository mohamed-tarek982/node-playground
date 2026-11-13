const express = require("express");
const path = require("path");

const app = express();

// Set the view engine
app.set("view engine", "pug");

// Set the views directory
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

const { User } = require("./models");

// The test user's id, set once the database is connected
let currentUserId;

// attach the current user to every request (must come before the routes)
app.use(async (req, res, next) => {
  try {
    req.user = await User.findById(currentUserId);
    next();
  } catch (err) {
    next(err);
  }
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

const { mongoConnect } = require("./utils/database");

mongoConnect()
  .then(() => User.findOrCreate({ name: "Tarek", email: "test@test.com" }))
  .then((user) => {
    currentUserId = user._id;
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
