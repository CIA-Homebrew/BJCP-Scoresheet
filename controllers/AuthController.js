const crypto = require("crypto");
const emailService = require("../services/email.service");

const passport = require("../helpers/seq.passport");
const User = require("../models").User;
const appConstants = require("../helpers/appConstants");
const errorConstants = require("../helpers/errorConstants");
const debug = require("debug")("aha-scoresheet:authController");
const Scoresheet = require("../models").Scoresheet;
const Flight = require("../models").Flight;

const _fields = ["username", "firstname", "lastname", "password"];

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
    res.status(500);
  }
}

// Restrict access to root page
userController.home = function (req, res) {
  if (!req.user || !req.user.id) {
    res.render("index", {
      user: req.user,
      title: appConstants.APP_NAME + " - Home",
    });
    return;
  }

  Flight.findAll({
    where: {
      UserId: req.user.id,
    },
  })
    .then((flights) => {
      const plainFlights = flights.map((flight) => flight.get({ plain: true }));

      const scoresheetPromises = plainFlights.map((flight) =>
        Scoresheet.findAll({
          where: {
            FlightId: flight.id,
          },
        }).then((scoresheets) => {
          return {
            ...flight,
            scoresheets: scoresheets.map((scoresheet) =>
              scoresheet.get({ plain: true })
            ),
          };
        })
      );

      Promise.all(scoresheetPromises).then((flightObject) => {
        res.render("index", {
          user: req.user,
          title: appConstants.APP_NAME + " - Home",
          flights: flightObject,
        });
      });
    })
    .catch((err) => {
      res.status(500);
      debug(err);
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
  const email = req.body.email.toLowerCase();
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

      const emailVerificationCode = crypto.randomBytes(16).toString("hex");

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
        allow_automated_email: req.body.allow_automated_email || false,
        email_verified: false,
        verification_id: emailVerificationCode,
      }).then(function (user) {
        req.login(user, (err) => {
          if (err) {
            errorProcessor(err, req);
          }

          emailService.sendUserVerificationEmail(
            user.email,
            emailVerificationCode
          );

          req.flash(
            "warning",
            "An email with a link to verify your account has been sent. If you cannot find it, please check your spam folder."
          );
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
  req.body.email = req.body.email.toLowerCase();

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
  const oldEmail = req.body.oldEmail.toLowerCase();
  const newEmail = req.body.newEmail.toLowerCase();
  const emailVerificationCode = crypto.randomBytes(16).toString("hex");

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
        {
          email: newEmail,
          email_verified: false,
          verification_id: emailVerificationCode,
        },
        {
          where: {
            id: user.id,
          },
        }
      );
    })
    .then((user) => {
      emailService.sendUserVerificationEmail(newEmail, emailVerificationCode);
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
      res.status(200).json(true);
    })
    .catch((err) => {
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
    returning: true,
    plain: true,
  })
    .then((user) => {
      if (user[1] !== 1) {
        req.login(user[1].get(), (err) => {
          if (err) {
            return Promise.reject(
              "Error re-establishing session. Please login again."
            );
          }
        });
      }

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
      res.status(200).json({
        user: user,
        updatedPassword: resetPassword,
      });
    })
    .catch((err) => {
      jsonErrorProcessor(err, res);
    });
};

userController.requestEmailValidation = function (req, res) {
  const userId = req.user.id;
  const userEmail = req.user.email;
  const emailVerificationCode = crypto.randomBytes(16).toString("hex");

  User.update(
    {
      verification_id: emailVerificationCode,
    },
    {
      where: {
        id: userId,
      },
    }
  ).then(() => {
    emailService.sendUserVerificationEmail(userEmail, emailVerificationCode);

    req.flash(
      "warning",
      "An email with a link to verify your account has been sent. If you cannot find it, please check your spam folder."
    );
    res.redirect("/");
  });
};

// Called when user clicks link in their email inbox to validate their account
userController.validateEmail = function (req, res) {
  const validationCode = req.query.key;
  const userId = req.user.id;

  if (!validationCode) {
    res.redirect("/");
    return;
  }

  User.update(
    {
      email_verified: true,
      verification_id: null,
    },
    {
      where: {
        id: userId,
        verification_id: validationCode,
      },
      returning: true,
      plain: true,
    }
  )
    .then((user) => {
      if (!user[1]) {
        Promise.reject("Could not validate email address. Please try again.");
      }

      if (user[1] !== 1) {
        req.login(user[1].get(), (err) => {
          if (err) {
            return Promise.reject(err);
          }
          return Promise.resolve(user[1].get());
        });
      } else {
        req.logout();
        return Promise.resolve(null);
      }
    })
    .then((user) => {
      req.flash(
        "success",
        `Email address ${user ? user.email : ""} successfully validated`
      );
      res.redirect("/");
    })
    .catch((err) => {
      errorProcessor(err, req);
      res.redirect("/");
    });
};

// Called when user clicks "forgot password" button
userController.userRequestPasswordResetForm = function (req, res) {
  if (req.user) {
    res.redirect("/");
    return;
  }

  res.render("forgot_password");
};

// Called when user submits password reset form (with their email)
userController.userRequestPasswordReset = function (req, res) {
  const NUM_MINUTES_EXPIRE = 60;
  const userEmail = req.body.email;
  const passwordResetCode = crypto.randomBytes(16).toString("hex");

  User.update(
    {
      password_reset_id: passwordResetCode,
    },
    {
      where: {
        email: userEmail,
      },
    }
  ).then(() => {
    emailService.sendPasswordResetEmail(userEmail, passwordResetCode);

    req.flash(
      "warning",
      `An email with a link to reset your password has been sent. The link expires in ${NUM_MINUTES_EXPIRE} minues. If you cannot find it, please check your spam folder.`
    );
    res.redirect("/");
  });

  // Set timeout to delete reset code after certain amount of time
  setTimeout(() => {
    User.update(
      {
        password_reset_id: null,
      },
      {
        where: {
          email: userEmail,
        },
      }
    );
  }, NUM_MINUTES_EXPIRE * 60 * 1000);
};

// Called when user clicks email in their email to confirm reset password
userController.userResetPasswordForm = function (req, res) {
  const passwordKey = req.query.key;

  if (!passwordKey) {
    res.redirect("/");
    return;
  }

  res.render("reset_password", {
    passwordResetKey: passwordKey,
  });
};

// Called when user submits password change form
userController.userResetPassword = async function (req, res) {
  const passwordRegex = new RegExp(appConstants.PASSWORD_REGEX);
  const passwordKey = req.body.passwordResetKey;
  const password1 = req.body.password1;
  const password2 = req.body.password2;

  // check that password match
  if (password1 !== password2) {
    req.flash("danger", "Passwords do not match");
    res.render("reset_password", {
      passwordResetKey: passwordKey,
    });
    return;
  }

  // validate new password meets minimum requirements
  if (!passwordRegex.test(password1)) {
    req.flash("danger", "Password does not meet minimum password criteria");
    res.render("reset_password", {
      passwordResetKey: passwordKey,
    });
    return;
  }

  const hashedResetPassword = await User.prototype.hashPassword(password1);

  User.update(
    {
      password: hashedResetPassword,
      password_reset_id: null,
    },
    {
      where: {
        password_reset_id: passwordKey,
      },
      returning: true,
      plain: true,
    }
  )
    .then((user) => {
      if (!user[1]) {
        return Promise.reject("Could not reset password. Please try again.");
      }

      // Log back in to re-establish session with new credentials
      if (user[1] !== 1) {
        req.login(user[1].get(), (err) => {
          if (err) {
            return Promise.reject(err);
          }

          return Promise.resolve(user);
        });
      } else {
        req.logout();
        return Promise.resolve(null);
      }
    })
    .then((user) => {
      req.flash("success", "Password changed successfully");
      res.redirect("/");
    })
    .catch((err) => {
      errorProcessor(err, req);
      res.redirect("/");
    });
};

userController.unsubscribeForm = function (req, res) {
  res.render("unsubscribe");
};

userController.unsubscribe = function (req, res) {
  const email = req.body.email.toLowerCase();
  const allowMail = req.body.allow_automated_email;

  User.update(
    { allow_automated_email: allowMail || false },
    {
      where: {
        email: email,
      },
    }
  ).then((user) => {
    req.flash("success", "Email communication preference set");
    res.redirect("/");
  });
};

module.exports = userController;
