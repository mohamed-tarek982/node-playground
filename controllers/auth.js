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

const renderLogin = (
  res,
  { status = 200, errorMessage = null, email = "" } = {},
) =>
  res.status(status).render("auth/login", {
    pageTitle: "Login",
    errorMessage,
    oldInput: { email },
  });

exports.getLogin = (req, res) => {
  renderLogin(res);
};

const bcrypt = require("bcryptjs");

exports.postLogin = async (req, res, next) => {
  const email = (req.body.email || "").trim().toLowerCase();
  const { password = "" } = req.body;

  try {
    const user = await User.findOne({ email });
    // same message for unknown email and wrong password so we don't leak which accounts exist
    const passwordMatches =
      user && user.password && (await bcrypt.compare(password, user.password));

    if (!passwordMatches) {
      return renderLogin(res, {
        status: 422,
        errorMessage: "Invalid email or password.",
        email,
      });
    }

    // Logic performed when the user is authenticated
    req.session.isLoggedIn = true;
    req.session.currentUserId = user._id.toString();
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
