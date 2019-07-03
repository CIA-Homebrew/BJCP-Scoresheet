let mongoose = require("mongoose");
let passport = require("passport");
let Scoresheet = require("../models/Scoresheet");
let appConstnats = require("../helpers/appConstants");

let scoresheetController = {};

// General object tool
scoresheetController.generateObject = function(newObj, data) {

};

// Load Scoresheet List
scoresheetController.loadScoresheetList = function(req, res) {
	Scoresheet.find({ author : req.user._id}, function(err, userScoresheets) {
		res.render('loadScoresheetList', {
			user : req.user,
			scoresheets : userScoresheets,
			title : appConstnats.APP_NAME + " - List Scoresheet"
		});
	})
};

// Load Individual Scoresheet
scoresheetController.loadScoresheet = function(req, res) {
	console.log(req.params.scoresheetId)
	Scoresheet.findById(
		req.params.scoresheetId, function(err, scoresheet) {
			console.log(scoresheet)
			if (err) {
				console.log(err)
			} else {
				res.render('newScoresheet', {
					user: req.user,
					scoresheet : scoresheet,
					fingerprint: req.params.scoresheetId,
					title : appConstnats.APP_NAME + " - Load Scoresheet"
				})
			}	
		}
	)

	// res.render('loadScoresheet', {
	// 	scoresheet:req.params,
	// 	user: req.user,
	// 	title : appConstnats.APP_NAME + " - Load Scoresheet"
	// });
};

// New Scoresheet Render
scoresheetController.newScoresheet = function(req, res) {
	res.render('newScoresheet', {
		user: req.user,
		title : appConstnats.APP_NAME + " - New Scoresheet"
	});
};

// New Scoresheet Post
scoresheetController.doNewScoresheet = function(req, res) {
	// Here we check to see if the _id field already exists. If not, user has not populated anything
	if (!req.body.fingerprint) {
		req.flash('error', 'Please populate scoresheet before submitting')
		res.redirect('/scoresheet/new')
	}
	
	Scoresheet.findOneAndUpdate(
		{_id:req.body.fingerprint}, //We assume the _id exists (should get caught earlier if not)
		req.body,
		{upsert:true, new:true, runValidators: false, useFindAndModify: false},
		function(err, sheet) {
			if (err) {
				console.log(err)
			} else {
				req.flash('success', 'Scoresheet Submitted');
				res.redirect('/');
			}
		}
	)
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