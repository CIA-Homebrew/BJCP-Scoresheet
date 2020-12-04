let appConstants = require("../helpers/appConstants");
let authMiddleware = {};

authMiddleware.isAuthenticated = function (req, res, next) {
  if (!req.user) {
    // If the user isn't logged in send them home
    req.flash("danger", "Please Login");
    return res.redirect("/");
  } else if (!req.user.email_verified) {
    // If the user isn't verified send them home
    req.flash("danger", "Email verification required");
    return res.redirect("/");
  } else {
    return next();
  }
};

authMiddleware.isAdmin = function (req, res, next) {
  if (req.user) {
    if (!req.user.email_verified) {
      // If the user email isn't verified send them home
      req.flash("danger", "Email verification required");
      return res.redirect("/");
    }

    // Anyone with a non-null user_level is an admin, however there are levels above that as well
    if (req.user.user_level) {
      return next();
    }
    // Not an admin send them home
    req.flash("danger", "Access denied!");
    return res.redirect("/");
  }

  // If the user isn't logged in send them home
  req.flash("danger", "Please Login");
  return res.redirect("/");
};

module.exports = authMiddleware;
