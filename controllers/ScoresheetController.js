let passport = require('../helpers/seq.passport');
let pdffiller = require('pdffiller');
let path = require('path');
let fs = require('fs');
let Scoresheet = require('../models').Scoresheet;
let appConstants = require('../helpers/appConstants');
let validator = require('validator');
const { Sequelize } = require('../models');
let debug = require('debug')('aha-scoresheet:scoresheetController');

let scoresheetController = {};

/**
 * Load Scoresheet List
 * @param req
 * @param res
 */
scoresheetController.loadScoresheetList = function(req, res) {
	Scoresheet.findAll({
		where: {
			userId : req.user.id
		},
	})
		.then(userScoresheets => {
			res.render('loadScoresheetList', {
				user : req.user,
				scoresheets : userScoresheets.map(scoresheet => scoresheet.get({plain:true})),
				title : appConstants.APP_NAME + " - List Scoresheet"
			});
		})
		.catch(err => {
			debug(err);
		});
};

/**
 * Initialize Scoresheet - either new or existing
 * @param req
 * @param res
 */
scoresheetController.initScoresheet = function(req, res) {
	// If we are provided with a scoresheet ID then load it
	if (req.body.scoresheetId) {
		Scoresheet.findAll({
			where: {
				id: req.body.scoresheetId
			},
		})
			.then(scoresheets => {
				if (!scoresheets.length) throw new Error('No scoresheet found for given ID!')
				res.render('scoresheet', {
					user: req.user,
					scoresheet : scoresheets[0].get({plain:true}),
					fingerprint: req.body.scoresheetId,
					title : appConstants.APP_NAME + " - Load Scoresheet"
				})
			})
			.catch(err => {
				debug(err);
			});
	// If we do NOT have a scoresheet ID just give the user a clean sheet to start new
	} else {
		let date = new Date(Date.now());
		res.render('scoresheet', {
			user: req.user,
			sess_date: date.getFullYear() + '-' + ('0' + (date.getMonth()+1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2),
			title : appConstants.APP_NAME + " - New Scoresheet"
		});
	}
};

/**
 * Do Scoresheet Data Post
 * @param req
 * @param res
 */
scoresheetController.doScoresheetDataChange = function(req, res) {
	// Make sure we don't allow a regular submit we ONLY take our AJAX calls
	if (req.body._ajax !== "true") {
		// Just send them back to the edit page
		return res.redirect('/scoresheet/edit');
	}

	// strip the ajax property
	delete req.body._ajax;

	let ss;

	// If the ID is empty or invalid then generate a new object with a new ID
	if (req.body.id === "" || !validator.isUUID(req.body.id, 4)) {
		ss = Scoresheet.build();
	// If we have an ID build a new object using that existing ID
	} else {
		ss = Scoresheet.build({
			id: req.body.id
		});
	}

	/**
	 * There may be a cleaner way of doing this but just for sanity only map the known keys
	 */
	Object.keys(Scoresheet.rawAttributes).map((key, index) => {
		ss[key] = req.body[key];
	});

	// Associate this scoresheet to the user
	ss.userId = req.user.id;

	// Upsert the record
	Scoresheet.upsert(
		ss.dataValues,
		{
			where: {id: ss.dataValues.id},
			validate: false
		}
	)
		.then((retData) => {
			// associate the sheet to the user
			//sheet.setUser(req.user.id);

			// Returned Data
			let sheet = retData[0];
			let created = retData[1];

			//req.flash('success', 'Scoresheet Submitted');
			//res.redirect('/scoresheet/load');
			return res.send({update: true, id: sheet.id});
		})
		.catch(err => {
			debug(err);
			// Bad upsert send the error back to the AJAX caller
			return res.send({update: false, id: null, error: err});
		});
};

/**
 * Check if Scoresheet exists Post - This is an AJAX call
 * @param req
 * @param res
 * @returns boolean
 */
scoresheetController.doCheckScoresheet = function(req, res) {
	// Store the submitted data
	let scoresheetBody = req.body;

	// If the ID is empty or invalid then we have nothing to show
	if (scoresheetBody.id === "" || validator.isUUID(scoresheetBody.id, 4)) {
		return res.send(false);
	}

	// See if we have a sheet for this id to pull the data for
	Scoresheet.count({
		where: {
			id: scoresheetBody.id
		}
	})
		.then((count) => {
			return res.send(count >= 1);
		})
		.catch(err => {
			debug(err);
			return res.send(false);
		});
};

/**
 * Check if the data sent is valid in the required manners
 * @param req
 * @param res
 * @return boolean true if the validation passed ; false if it failed
 * TODO: Matt this was ported as is but the validation seems odd, could we not just validate based on a count query?
 */
scoresheetController.doValidateScoresheet = function(req, res) {
	// Store the submitted data
	let scoresheetBody = req.body;

	// Check if the entry number is used already or available
	Scoresheet.findOne({
		where: {
			entry_number: scoresheetBody.entry_number		// findOne by entry_number
		}
	})
		.then(sheet => {
			if (!sheet) {
				return res.send({entry_number: true});
			} else {
				if (sheet.length <= 0) {
					return res.send({entry_number: true});
				}

				// If we have a fingerprint sent and it matches the entry number we allow a duplicate
				if (scoresheetBody.id === sheet.id && scoresheetBody.entry_number === sheet.entry_number) {
					return res.send({entry_number: true});
				}
			}
		})
		.catch(err => {
			debug(err);
			return res.send({entry_number: false});
		});
};

scoresheetController.generatePDF = function(req, res) {
	let scoresheetId = req.params.scoresheetID;
	let sourcePDF = path.join(__dirname,'../public/modified-scoresheet-2019.pdf');
	let destinationPDF = path.join(__dirname,'../public/'+ req.url.split('/')[-1] +'.pdf')

	fs.copyFile(sourcePDF, destinationPDF, (err) => {
		if (err) throw err;
		console.log('source.txt was copied to destination.txt');
		res.sendFile(destinationPDF);
	});

	

	res.on('finish', function() {
		fs.unlinkSync(destinationPDF);
	});
};

module.exports = scoresheetController;