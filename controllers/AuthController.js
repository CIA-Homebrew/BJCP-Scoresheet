let mongoose = require("mongoose");
let passport = require("passport");
let User = require("../models/User");
let appConstnats = require("../helpers/appConstants");

let _fields = ["username", "forename", "surname", "password"];

let userController = {};

let hasError = false;

function errorProcessor(err, req) {
	// Sort out our custom error messages
	_fields.forEach(function(v) {
		if (err.errors && typeof err.errors[v] !== "undefined") {
			req.flash("error", err.errors[v].message);
			hasError = true;
		}
	});

	// Specific and default error catcher
	switch (err.name) {
		case "UserExistsError":
		case "MissingPasswordError":
		case "CustomError":
			req.flash("error", err.message);
			hasError = true;
			break;
		// Don't use a default it doubles for the custom error messages
		default:
			//_err.push(err.message);
			break;
	}
}

// Restrict access to root page
userController.home = function(req, res) {
	res.render('index', {
		user : req.user,
		title : appConstnats.APP_NAME + " - Home"
	});
};

// Go to registration page
userController.register = function(req, res) {
	res.render('register', {
		title : appConstnats.APP_NAME + " - Register"
	});
};

// Post registration
userController.doRegister = function(req, res) {
	// Password match
	let passwd = null;
	if (req.body.password.length > 0 && req.body.passwordC.length > 0 && req.body.password === req.body.passwordC) {
		passwd = req.body.password;
	}

	let newUser = new User({
		username : req.body.username,
		forename: req.body.forename,
		surname: req.body.surname,
		bjcp_id: req.body.bjcp_id,
		bjcp_rank: req.body.bjcp_rank,
		cicerone_rank: req.body.cicerone_rank,
		pro_brewer_brewery: req.body.pro_brewer_brewery,
		industry_description: req.body.industry_description,
		judging_years: req.body.judging_years
	});

	User.register(newUser, passwd)
		.then(function(newUser) {
			req.flash('success', 'Registration Successful');
			res.redirect('/');
		})
		.catch(function(err) {
			// Push the processed errors to the flash handler
			errorProcessor(err, req);

			return res.render('register', {
				fData: newUser,
				title : appConstnats.APP_NAME + " - Register"
			});
		});
};

// Go to login page
userController.login = function(req, res) {
	res.render('login', {
		title : appConstnats.APP_NAME + " - Login"
	});
};

// Post login
userController.doLogin = function(req, res) {
	passport.authenticate('local', {
		failureRedirect: '/login'
	})(req, res, function() {
		// Login is good, set the user data and go back home
		req.flash('success', 'Login Successful');
		res.redirect('/');
	});
};

// logout
userController.logout = function(req, res) {
	req.logout();
	res.redirect('/');
};

// Go to profile edit page
userController.editProfile = function(req, res) {
	res.render('profile', {
		user : req.user,
		title : appConstnats.APP_NAME + " - Edit Profile"
	});
};

// Post profile edit page
userController.saveProfile = function(req, res) {
	// Login is good, now just make sure we have a good user object to modify
	User.findById(req.user.id, function (err, user) {
		// Something went wrong...
		if (err || !user) {
			// Push the processed errors to the flash handler
			errorProcessor(err, req);
			// Render our profile page again to show errors
			return res.render('profile', {
				fData: user,
				title : appConstnats.APP_NAME + " - Edit Profile"
			});
		}

		// Make sure the provided existing username/email matches what we have in the DB if we have a new address populated
		if (req.body.new_username.trim() !== "") {
			if (req.body.username === user.username[0]) {
				user.username = req.body.new_username;
			} else {
				errorProcessor({name:"CustomError", message: 'Email address does not match existing.'}, req);
			}
		}

		user.forename = req.body.forename;
		user.surname = req.body.surname;
		user.bjcp_id = req.body.bjcp_id;
		user.bjcp_rank = req.body.bjcp_rank;
		user.cicerone_rank = req.body.cicerone_rank;
		user.pro_brewer_brewery = req.body.pro_brewer_brewery;
		user.industry_description = req.body.industry_description;
		user.judging_years = req.body.judging_years;

		if (hasError) {
			// Render our profile page again to show errors
			console.log("ping2");
			return res.render('profile', {
				user: user,
				title : appConstnats.APP_NAME + " - Edit Profile"
			});
		}

		// If the user provided both "new" password and confirm password we are changing the password
		if (req.body.new_password.length > 0 && req.body.new_passwordC.length > 0 && req.body.current_password.length > 0) {
			if (req.body.new_password === req.body.new_passwordC) {
				/**
				 * FIX THIS!
				user.changePassword(req.body.password, req.body.new_password, function(err) {
					if (err) {
						console.log("ping1");
						// Push the processed errors to the flash handler
						errorProcessor(err, req);
					}
				});
				 **/
			} else {
				errorProcessor({name:"CustomError", message: 'Passwords do not match.'}, req);
			}
		}

		// don't forget to save!
		user.save(function (err) {
			// Something went wrong...
			if (err) {
				// Push the processed errors to the flash handler
				errorProcessor(err, req);
				// Render our profile page again to show errors
				return res.render('profile', {
					user: user,
					title : appConstnats.APP_NAME + " - Edit Profile"
				});
			}
		});

		// Finally show the profile edit page again.
		console.log("end");
		req.flash("success", 'Profile edit successful!');
		res.redirect('/profile/edit');
	});
};

module.exports = userController;