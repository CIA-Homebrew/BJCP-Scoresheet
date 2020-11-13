let passport = require("../helpers/seq.passport");
let User = require("../models").User;
let appConstants = require("../helpers/appConstants");
const errorConstants = require("../helpers/errorConstants");
let debug = require("debug")("aha-scoresheet:authController");
const Scoresheet = require("../models").Scoresheet;
const Flight = require("../models").Flight;

let _fields = ["username", "firstname", "lastname", "password"];

let userController = {};

let hasError = false;

function errorProcessor(err, req) {
  // Error trigger
  hasError = true;

  // Sort out our custom error messages
  _fields.forEach(function (v) {
    if (err.errors && typeof err.errors[v] !== "undefined") {
      req.flash("error", err.errors[v].message);
    }
  });

  // Specific and default error catcher
  switch (err.name) {
    case "UserExistsError":
    case "MissingPasswordError":
    case "CustomError":
      req.flash("error", err.message);
      break;
    case "IncorrectPasswordError":
      // Customize this message
      req.flash("error", "Password provided is not correct");
      break;
    // Don't use a default it doubles for the custom error messages
    default:
      req.flash("error", err.message);
      break;
  }
}

function jsonErrorProcessor(err, res) {
  if (errorConstants[err]) {
    res.status(400).json({
      errors: [
        {
          code: err,
          message: errorConstants[err],
        },
      ],
    });
  } else {
    debug(err);
    console.log(err);
    res.status(500);
  }
}

// Restrict access to root page
userController.home = function (req, res) {
  if (!req.user) {
    res.render("index", {
      user: req.user,
      title: appConstants.APP_NAME + " - Home",
    });
    return;
  }

  const scoresheetPromise = Scoresheet.findAll({
    where: {
      user_id: req.user.id,
    },
  });

  const flightPromise = Flight.findAll({
    where: {
      created_by: req.user.id,
    },
  });

  Promise.all([scoresheetPromise, flightPromise])
    .then(([scoresheets, flights]) => {
      const flightObject = {};

      flights.forEach((flight) => {
        flightObject[flight.id] = {
          ...flight.get({ plain: true }),
          scoresheets: scoresheets
            .filter((scoresheet) => scoresheet.flight_key === flight.id)
            .map((scoresheet) => scoresheet.get({ plain: true })),
        };
      });

      res.render("index", {
        user: req.user,
        title: appConstants.APP_NAME + " - Home",
        flights: flightObject,
      });
    })
    .catch((err) => {
      res.status(500);
      debug(err);
      console.log(err);
    });
};

// Go to registration page
userController.register = function (req, res) {
  res.render("register", {
    title: appConstants.APP_NAME + " - Register",
  });
};

// Post registration
userController.doRegister = function (req, res) {
  const emailRegex = new RegExp(appConstants.EMAIL_REGEX);
  const passwordRegex = new RegExp(appConstants.PASSWORD_REGEX);
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.passwordC;

  User.findOne({ where: { email: email } })
    .then((takenEmailUser) => {
      let enteredUserInfo = User.build({
        email: email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        bjcp_id: req.body.bjcp_id,
        bjcp_rank: req.body.bjcp_rank,
        cicerone_rank: req.body.cicerone_rank,
        pro_brewer_brewery: req.body.pro_brewer_brewery,
        industry_description: req.body.industry_description,
        judging_years: req.body.judging_years,
      });

      // Email available
      if (takenEmailUser) {
        return Promise.reject({
          name: "CustomError",
          message: "Email address already registered",
          enteredInfo: enteredUserInfo,
        });
      }
      // Email criteria
      if (!emailRegex.test(email)) {
        return Promise.reject({
          name: "CustomError",
          message: "Invalid email format",
          enteredInfo: enteredUserInfo,
        });
      }
      // Password criteria
      if (!password) {
        return Promise.reject({
          name: "CustomError",
          message: "Password cannot be empty",
          enteredInfo: enteredUserInfo,
        });
      }
      if (!passwordRegex.test(password)) {
        return Promise.reject({
          name: "CustomError",
          message: "Password does not meet security criteria",
          enteredInfo: enteredUserInfo,
        });
      }
      // Password match
      if (password !== confirmPassword) {
        return Promise.reject({
          name: "CustomError",
          message: "Passwords do not match",
          enteredInfo: enteredUserInfo,
        });
      }

      return User.create({
        email: email,
        password: password,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        bjcp_id: req.body.bjcp_id,
        bjcp_rank: req.body.bjcp_rank,
        cicerone_rank: req.body.cicerone_rank,
        pro_brewer_brewery: req.body.pro_brewer_brewery,
        industry_description: req.body.industry_description,
        judging_years: req.body.judging_years,
      }).then(function (user) {
        delete user.password;

        req.login(user, (err) => {
          if (err) {
            errorProcessor(err, req);
          }
          req.flash("success", "Registration Successful!");
          res.redirect("/");
        });
      });
    })
    .catch((err) => {
      // Push the processed errors to the flash handler
      errorProcessor(err, req);

      return res.render("register", {
        fData: err.enteredInfo,
        title: appConstants.APP_NAME + " - Register",
      });
    });
};

// Go to login page
userController.login = function (req, res) {
  res.render("login", {
    title: appConstants.APP_NAME + " - Login",
  });
};

// Post login
userController.doLogin = function (req, res) {
  passport.authenticate("passport-sequelize", {
    // Login is bad, try again!
    failureRedirect: "/login",
    failureFlash: "Incorrect user information.",
  })(req, res, function () {
    // Login is good, set the user data and go back home
    req.flash("success", "Login Successful");
    res.redirect("/");
  });
};

// logout
userController.logout = function (req, res) {
  req.logout();
  res.redirect("/");
};

// Go to profile edit page
userController.editProfile = function (req, res) {
  res.render("profile", {
    user: req.user,
    title: appConstants.APP_NAME + " - Edit Profile",
  });
};

userController.updateEmail = function (req, res) {
  const emailRegex = new RegExp(appConstants.EMAIL_REGEX);
  const oldEmail = req.body.oldEmail;
  const newEmail = req.body.newEmail;

  User.findByPk(req.user.id)
    .then((user) => {
      // validate new password meets minimum requirements
      if (!emailRegex.test(newEmail)) {
        return Promise.reject("EMAIL_FAIL_CRITERIA");
      }

      if (oldEmail !== user.email) {
        return Promise.reject("INVALID_EMAIL");
      }

      return User.update(
        { email: newEmail },
        {
          where: {
            id: user.id,
          },
        }
      );
    })
    .then((user) => {
      res.status(200).json(true);
    })
    .catch((err) => {
      jsonErrorProcessor(err, res);
    });
};

userController.updatePassword = function (req, res) {
  const passwordRegex = new RegExp(appConstants.PASSWORD_REGEX);
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  User.findByPk(req.user.id)
    .then((user) => {
      // validate new password meets minimum requirements
      if (!passwordRegex.test(newPassword)) {
        return Promise.reject("PASSWORD_FAIL_CRITERIA");
      }

      return user
        .validatePasswordAsync(oldPassword)
        .then((validated) => {
          if (!validated) {
            return Promise.reject("INVALID_PASSWORD");
          } else {
            return user;
          }
        })
        .then((user) => {
          user.hashPassword(newPassword).then((newHashedPassword) => {
            return User.update(
              { password: newHashedPassword },
              {
                where: {
                  id: user.id,
                },
              }
            );
          });
        });
    })
    .then((user) => {
      console.log("Password Change Successful");
      res.status(200).json(true);
    })
    .catch((err) => {
      console.log(err);
      jsonErrorProcessor(err, res);
    });
};

userController.saveProfile = function (req, res) {
  const updatedParams = req.body;
  if (!req.user.user_level) {
    delete req.body.id;
  }

  delete req.body.password;
  delete req.body.email;

  User.update(updatedParams, {
    where: {
      id: req.body.id || req.user.id,
    },
  })
    .then((user) => {
      console.log("Profile updated succesfully");
      res.status(200).json(true);
    })
    .catch((err) => {
      jsonErrorProcessor(err, res);
    });
};

userController.resetPassword = async function (req, res) {
  const resetUserId = req.body.resetUserId;
  const resetPassword = Math.random().toString(36).slice(2);
  const hashedResetPassword = await User.prototype.hashPassword(resetPassword);

  User.update(
    { password: hashedResetPassword },
    {
      where: {
        id: resetUserId,
      },
    }
  )
    .then((user) => {
      console.log(`Password reset: ${resetPassword}`);
      res.status(200).json({
        user: user,
        updatedPassword: resetPassword,
      });
    })
    .catch((err) => {
      jsonErrorProcessor(err, res);
    });
};

module.exports = userController;
