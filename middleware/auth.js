let appConstants = require("../helpers/appConstants");
let authMiddleware = {};

authMiddleware.isAuthenticated = function (req, res, next) {
	if (req.user)
		return next();

	// If the user isn't logged in send them home
	req.flash('danger', 'Please Login');
	return res.redirect('/');
};

authMiddleware.isAdmin = function (req, res, next) {
	if (req.user) {
		if (req.user.user_level > 0) {
			return next();
		}
		// None admin send them home
		req.flash('danger', 'Access denied!');
		return res.redirect('/');
	}

	// If the user isn't logged in send them home
	req.flash('danger', 'Please Login');
	return res.redirect('/');
};

module.exports = authMiddleware;