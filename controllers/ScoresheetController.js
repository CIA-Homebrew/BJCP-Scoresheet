let mongoose = require("mongoose");
let passport = require("passport");
let Scoresheet = require("../models/Scoresheet");

let scoresheetController = {};

// General object tool
scoresheetController.generateObject = function(newObj, data) {

};

// Load Scoresheet List
scoresheetController.loadScoresheetList = function(req, res) {
	res.render('loadScoresheetList', { user : req.user });
};

// Load Individual Scoresheet
scoresheetController.loadScoresheet = function(req, res) {
	res.render('loadScoresheet', {
		sendData:req.params,
		user: req.user
	});
};

// New Scoresheet Render
scoresheetController.newScoresheet = function(req, res) {

	res.render('newScoresheet', {user: req.user});
};

// New Scoresheet Post
scoresheetController.doNewScoresheet = function(req, res) {
	if (!req.user) {
		req.flash('danger', 'Please Login');
		return res.redirect('/');
	}

	console.log(req.body);
	res.render('submitScoresheet', {user: req.user});
};

// Change Scoresheet Post - This is an AJAX call
scoresheetController.doChangeScoresheet = function(req, res) {
	// Store the submitted data
	let data = req.body;

	// Store ID if it was submitted else generate a new one
	let sID = data.fingerprint === "" ? new mongoose.mongo.ObjectID() : mongoose.Types.ObjectId(data.fingerprint);

	// Delete the submitted ID from the base object
	delete data.fingerprint;

	// See if we have a sheet for this id to update else create a new doc and insert
	Scoresheet.findOneAndUpdate(
		{_id: sID},
		data,
		{upsert: true, new:true, runValidators: false, useFindAndModify: false},
		function(err, sheet) {
			if (err) {
				console.log(err);
			} else {
				// We have a sheet already send the ID back to the form so it's aware
				res.send({update: true, fingerprint: sheet._id});
			}
		}
	);
};

// Check if Scoresheet exists Post - This is an AJAX call
scoresheetController.doCheckScoresheet = function(req, res) {
	// Store the submitted data
	let data = req.body;

	// If the ID is empty then we have nothing to show
	if (data.fingerprint === "") {
		return res.send(false);
	}

	// Store ID if it was submitted else generate a new one
	let sID = mongoose.Types.ObjectId(data.fingerprint);

	// See if we have a sheet for this id to pull the data for
	Scoresheet.findOne(
		{_id: sID},
		function(err, sheet) {
			if (err) {
				return res.send(false);
			}

			return sheet;
		}
	);
};

module.exports = scoresheetController;