let appConstants = require("../helpers/appConstants");
let authMiddleware = {};

authMiddleware.isAuthenticated = function (req, res, next) {
	if (req.user) {
		return next();
	}

	// If the user isn't logged in send them home
	req.flash('danger', 'Please Login');
	return res.redirect('/');
};

authMiddleware.isAdmin = function (req, res, next) {
	if (req.user) {
		// Anyone with a non-null user_level is an admin, however there are levels above that as well
		if (req.user.user_level) {
			return next()
		}
		// Not an admin send them home
		req.flash('danger', 'Access denied!');
		return res.redirect('/');
	}

	// If the user isn't logged in send them home
	req.flash('danger', 'Please Login');
	return res.redirect('/');
};

module.exports = authMiddleware;