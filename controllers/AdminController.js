let passport = require("../helpers/seq.passport");
let User = require("../models").User;
let Scoresheet = require("../models").Scoresheet;
let appConstants = require("../helpers/appConstants");
let debug = require('debug')('aha-scoresheet:adminController');

let adminController = {};

adminController.controlPanel = function(req, res) {
	/** Find all the scoresheets in the system **/
	Scoresheet.find().exec()
	/** Start the scoresheet promise chain **/
		.then(function(sheet) {
			let result = [];
			/** Find all the users in the system and return the promise chain**/
			return User.find().exec()
				.then(function(user){
					return [sheet, user];
				});
		})
		/** Promise chain success function **/
		.then(function(result) {
			res.render("admin", {
				user : req.user,
				title : appConstants.APP_NAME + " - Admin Home",
				sheets : result[0],
				judges : result[1]
			});
		})
		/** Promise chain error function **/
		.then(undefined, function(err){
			res.render("admin", {
				user : req.user,
				title : appConstants.APP_NAME + " - Admin Home"
			});
		});
};

module.exports = adminController;