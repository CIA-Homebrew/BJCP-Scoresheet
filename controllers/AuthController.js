let mongoose = require("mongoose");
let passport = require("passport");
let User = require("../models/User");

let _fields = ["username", "forename", "surname", "password"];

let userController = {};

// Restrict access to root page
userController.home = function(req, res) {
	res.render('index', { user : req.user });
};

// Go to registration page
userController.register = function(req, res) {
	res.render('register');
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
			//console.log('New User Created!', newUser);
			req.flash('success', 'Registration Successful');
			res.redirect('/');
		})
		.catch(function(err) {
			//console.error(err);
			// Sort out our error messages
			let _err = [];
			_fields.forEach(function(v) {
				if (err.errors && typeof err.errors[v] !== "undefined") {
					_err.push(err.errors[v].message);
				}
			});

			// The password error is unique catch it
			if (err.name === "MissingPasswordError") {
				_err.push(err.message);
			}

			// Push the errors to the flash handler
			req.flash('error', _err);

			return res.render('register', { fData: newUser });
		});
};

// Go to login page
userController.login = function(req, res) {
	res.render('login');
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
	if (!req.user) res.redirect("/");

	res.render('profile', { user : req.user });
};

// Post profile edit page
userController.saveProfile = function(req, res) {
	if (!req.user) res.redirect("/");

	// Password match
	let passwd = null;

	// If the user provided both "new" password and confirm password we are changing the password
	if (req.body.new_password.length > 0 && req.body.new_passwordC.length > 0 && req.body.new_password === req.body.new_passwordC) {
		passwd = req.body.new_password;
	}

	let newUser = new User({
		username : req.body.username,
		forename: req.body.forename,
		surname: req.body.surname,
		password: passwd,
		bjcp_id: req.body.bjcp_id,
		bjcp_rank: req.body.bjcp_rank,
		cicerone_rank: req.body.cicerone_rank,
		pro_brewer_brewery: req.body.pro_brewer_brewery,
		industry_description: req.body.industry_description,
		judging_years: req.body.judging_years
	});

	// We only update the data if the user provides the correct password.
	passport.authenticate('local', {
		failureRedirect: '/login'
	})(req, res, function() {
		// Login is good, set the user data and go back home
		res.redirect('/');
	});
};

module.exports = userController;