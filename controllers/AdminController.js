let passport = require("../helpers/seq.passport");
let User = require("../models").User;
let Scoresheet = require("../models").Scoresheet;
let appConstants = require("../helpers/appConstants");
let debug = require('debug')('aha-scoresheet:adminController');

let adminController = {};

adminController.controlPanel = function(req, res) {
	// All of our data we want from the DBs
	let getScoresheets = Scoresheet.findAll();
	let getUsers = User.findAll();

	Promise
		.all([
			// These are returned IN ORDER inside the chained "results" variable
			getScoresheets,
			getUsers
		])
		.then(results => {
			res.render("admin", {
				user : req.user,
				title : appConstants.APP_NAME + " - Admin Home",
				sheets : results[0],
				judges : results[1]
			});
		})
		.catch(err => {
			debug(err);

			res.render("admin", {
				user : req.user,
				title : appConstants.APP_NAME + " - Admin Home"
			});
		});
};

module.exports = adminController;