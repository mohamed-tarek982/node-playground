const { User } = require("../models");

const renderSignup = (
  res,
  { status = 200, errorMessage = null, email = "" } = {},
) =>
  res.status(status).render("auth/signup", {
    pageTitle: "Sign Up",
    errorMessage,
    oldInput: { email },
  });

exports.getSignup = (req, res) => {
  renderSignup(res);
};

const bcrypt = require("bcryptjs");

exports.postSignup = async (req, res, next) => {
  const email = (req.body.email || "").trim().toLowerCase();
  const { password = "" } = req.body;

  try {
    if (await User.exists({ email })) {
      return renderSignup(res, {
        status: 422,
        errorMessage: "An account with this email already exists.",
        email,
      });
    }
    // ensure the password is hashed before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({ email, password: hashedPassword, cart: { items: [] } });
    res.redirect("/auth/login");
  } catch (err) {
    next(err);
  }
};

exports.getLogin = (req, res) => {
  res.render("auth/login", { pageTitle: "Login" });
};

exports.postLogin = async (req, res, next) => {
  try {
    // dummy login: load the test user by its id (set in app.js on startup)
    const user = await User.findById(req.app.get("testUserId"));
    if (!user) return res.redirect("/auth/login");

    req.session.isLoggedIn = true;
    // store as a plain string: connect-mongodb-session bundles bson 6, mongoose 9 uses bson 7,
    // so a mongoose ObjectId can't be serialized by the session store
    req.session.currentUserId = user._id.toString();
    // make sure the session is written to MongoDB before redirecting
    req.session.save((err) => {
      if (err) return next(err);
      res.redirect("/");
    });
  } catch (err) {
    next(err);
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
};
