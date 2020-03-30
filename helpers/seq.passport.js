//we import passport packages required for authentication
let passport = require("passport");
let CustomStrategy = require("passport-custom").Strategy;
//
//We will need the models folder to check passport agains
let db = require("../models");
//
// Telling passport we want to use a Local Strategy. In other words,
//we want login with a username/email and password
passport.use('passport-sequelize', new CustomStrategy(
	function(req, done) {
		// When a user tries to sign in this code runs
		db.User.findOne({
			where: {
				email: req.body.email
			}
		}).then(function(dbUser) {
			// If there's no user with the given email
			if (!dbUser) {
				return done(null, false);
			}
			// If there is a user with the given email, but the password the user gives us is incorrect
			else if (!dbUser.validatePassword(req.body.password)) {
				return done(null, false);
			}

			// If none of the above, return the user
			return done(null, dbUser);
		});
	}
));

// In order to help keep authentication state across HTTP requests,
// Sequelize needs to serialize and deserialize the user
// Just consider this part boilerplate needed to make it all work
passport.serializeUser(function(user, cb) {
	cb(null, user);
});
//
passport.deserializeUser(function(obj, cb) {
	cb(null, obj);
});
//
// Exporting our configured passport
module.exports = passport;