const express = require("express");
const path = require("path");
const session = require("express-session");
const mongoDBStore = require("connect-mongodb-session")(session);

const app = express();

const store = new mongoDBStore({
  uri: process.env.MONGODB_URI,
  databaseName: process.env.MONGODB_DB_NAME || "shop",
  collection: "sessions",
});

app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
    store,
  }),
);

// Set the view engine
app.set("view engine", "pug");

// Set the views directory
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

const { User } = require("./models");

// attach the logged-in user (from the session) to every request (must come before the routes)
app.use(async (req, res, next) => {
  const currentUserId = req.session.currentUserId;
  if (!currentUserId) return next();

  try {
    req.user = await User.findById(currentUserId);
    next();
  } catch (err) {
    next(err);
  }
});

// make auth state available to every view (used by the navbar)
app.use((req, res, next) => {
  res.locals.isAuthenticated = !!req.session.isLoggedIn;
  next();
});

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use("/admin", adminRoutes);
app.use("/shop", shopRoutes);
app.use("/auth", authRoutes);

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
    app.set("testUserId", user._id);
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
