const { User } = require("../models");

exports.getLogin =(req, res) => {
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

