let Scoresheet = require('../models').Scoresheet;
let appConstants = require('../helpers/appConstants');
let validator = require('validator');
const User = require('../models').User;
const Flight = require('../models').Flight;

let debug = require('debug')('aha-scoresheet:scoresheetController');
const pdfService = require('../services/pdf.service')

let scoresheetController = {};

/**
 * Load Scoresheet List
 * @param req
 * @param res
 */
scoresheetController.loadScoresheetList = function(req, res) {
	Scoresheet.findAll({
		where: {
			user_id : req.user.id
		},
	}).then(userScoresheets => {
		flights = {}
		userScoresheets.forEach(scoresheet => {
			flights[scoresheet.flight_key] = {}
		})

		return Flight.findAll({
			where: {
				id: Object.keys(flights)
			}
		}).then(userFlights => {
			return [userScoresheets, userFlights]
		})
	})
	.then(([userScoresheets, userFlights]) => {
		const flightObject = {}
		userFlights.forEach(flight => {
			flightObject[flight.id] = {
				...flight.get({plain:true}),
				scoresheets: userScoresheets.filter(scoresheet => scoresheet.flight_key === flight.id).map(scoresheet => scoresheet.get({plain:true}))
			}
		})

		res.render('loadScoresheetList', {
			user : req.user,
			scoresheets : userScoresheets.map(scoresheet => scoresheet.get({plain:true})),
			flights: flightObject,
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
	if (req.body.scoresheetId || req.query.scoresheetId) {
		const scoresheetId = req.body.scoresheetId ? req.body.scoresheetId :  req.query.scoresheetId

		Scoresheet.findAll({
			where: {
				id: scoresheetId
			},
		})
			.then(scoresheets => {
				if (!scoresheets.length) throw new Error('No scoresheet found for given ID!')
				res.render('scoresheet', {
					user: req.user,
					scoresheet : scoresheets[0].get({plain:true}),
					fingerprint: scoresheetId,
					title : appConstants.APP_NAME + " - Load Scoresheet"
				})
			})
			.catch(err => {
				debug(err);
			});
	
	} else if (req.query.flightId) {
		// If we have a flight ID, then create a scoresheet with flight ID prepopulated
		const flightId = req.query.flightId
		Flight.findOne({
			where: {
				id: flightId,
				created_by: req.user.id
			}
		}).then(flight => {
			Scoresheet.count({
				where: {
					flight_key: flight.id
				}
			}).then(numScoresheets => {
				if (flight) {
					let date = new Date(flight.date);
					res.render('scoresheet', {
						user: req.user,
						sess_date: date.getUTCFullYear() + '-' + ('0' + (date.getUTCMonth()+1)).slice(-2) + '-' + ('0' + date.getUTCDate()).slice(-2),
						title : appConstants.APP_NAME + " - New Scoresheet",
						flightId : req.query.flightId,
						session_location: flight.location,
						flight_total: numScoresheets+1,
						flight_position: numScoresheets+1
					});
				} else {
					res.status(401)
				}
			})
		}).catch(err => {
			res.status(500)
			console.log(err)
		})
	} else {
		// If we do NOT have a scoresheet ID just give the user a clean sheet to start new
		let date = new Date(Date.now());
		res.render('scoresheet', {
			user: req.user,
			sess_date: date.getUTCFullYear() + '-' + ('0' + (date.getUTCMonth()+1)).slice(-2) + '-' + ('0' + date.getUTCDate()).slice(-2),
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
	ss.user_id = req.user.id;

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
	let scoresheetId = req.params.scoresheetId;

	Scoresheet.findOne({
		where: {
			id: scoresheetId
		}
	}).then(scoresheet => {
		// Doing this because userId isn't a FK on Scoresheet and this is a really fugly workaround
		return Promise.all([
			User.findOne({
				where: {
					id: scoresheet.user_id
				}
			}),
			Flight.findOne({
				where: {
					id: scoresheet.flight_key
				}
			}),
		]).then(([user,flight]) => {
			return [scoresheet.get({plain:true}), user.get({plain:true}), flight.get({plain:true})]
		})
	}).then(async ([scoresheet, user]) => {
		// These need to be STATIC and not relative! They also MUST be png files.
		const static_image_paths = {
			bjcp_logo: 'public/images/CANE-ISLAND-ALERS-LOGO_d400.png',
			aha_logo: 'public/images/CANE-ISLAND-ALERS-LOGO_d400.png',
			club_logo: 'public/images/CANE-ISLAND-ALERS-LOGO_d400.png',
			comp_logo: 'public/images/OpfermVI-hybrid_d400.png'
		}

		pdfService.generateScoresheet('views/bjcp_modified.pug', {
			scoresheet: scoresheet,
			judge: user,
			images: static_image_paths
		}).then(pdf => {
			res.send(pdf)
		})
	})
};

module.exports = scoresheetController;