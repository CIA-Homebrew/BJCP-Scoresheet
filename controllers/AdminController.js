let mongoose = require("mongoose");
let passport = require("passport");
let User = require("../models/User");
let Scoresheet = require("../models/Scoresheet");

let adminController = {};

adminController.controlPanel = function(req, res) {
	let scoresheets;
	Scoresheet.paginate({}, {
		entry_number : "ascending",
		page: 1,
		limit: 20
	}, function(err, result) {
		// result.docs
		// result.total
		// result.limit - 10
		// result.page - 3
		// result.pages
		if (err) {
			scoresheets.error = err;
		} else {
			scoresheets = result;
		}

		res.render("admin", { user : req.user, sheets : scoresheets });
	});
};

module.exports = adminController;