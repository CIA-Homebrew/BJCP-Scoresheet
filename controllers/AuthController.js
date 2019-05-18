let mongoose = require("mongoose");
let passport = require("passport");
let User = require("../models/User");

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
	User.register(new User({ username : req.body.username, name: req.body.name }), req.body.password, function(err, user) {
		if (err) {
			return res.render('register', { user : user });
		}

		passport.authenticate('local')(req, res, function () {
			req.flash('success', 'Registration Successful')
			res.redirect('/');
		});
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
		req.flash('success', 'Login Successful')
		res.redirect('/');
	});
};

// logout
userController.logout = function(req, res) {
	req.logout();
	req.flash('success', 'Successfully Logged Out');
	res.redirect('/');
};

module.exports = userController;