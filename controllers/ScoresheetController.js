let Scoresheet = require('../models').Scoresheet;
let appConstants = require('../helpers/appConstants');
const errorConstants = require("../helpers/errorConstants");

let validator = require('validator');
const User = require('../models').User;
const Flight = require('../models').Flight;

let debug = require('debug')('aha-scoresheet:scoresheetController');
const pdfService = require('../services/pdf.service')

let scoresheetController = {};

function jsonErrorProcessor(err, res) {
	if (errorConstants[err]) {
		res.status(400).json({
			errors: [
				{
					code: err,
					message: errorConstants[err]
				}
			]
		})
	} else {
		console.log(err)
		jsonErrorProcessor(err, res)
	}
}

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
	if (req.session.scoresheetId) {
		const scoresheetId = req.session.scoresheetId;
		delete req.session.scoresheetId;

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
	
	} else if (req.session.flightId) {
		// If we have a flight ID, then create a scoresheet with flight ID prepopulated
		const flightId = req.session.flightId
		delete req.session.flightId;

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
						flightId : flightId,
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

	const  ss = {};

	/**
	 * There may be a cleaner way of doing this but just for sanity only map the known keys
	 */
	Object.keys(Scoresheet.rawAttributes).map((key, index) => {
		ss[key] = req.body[key];
	});

	// Filter an "empty string" or null ID
	if (!ss.id || ss.id === '') {
		delete ss.id
	}
	// Associate this scoresheet to the user
	ss.user_id = req.user.id;

	// Upsert the record
	Scoresheet.upsert(ss)
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
			console.log(err)
			// Bad upsert send the error back to the AJAX caller
			return res.status(500).send({update: false, id: null, error: err});
		});
};

scoresheetController.previewPDF = function(req,res) {
	let scoresheetId = req.body.scoresheetId;

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
	}).then(async ([scoresheet, user, flight]) => {
		// These need to be STATIC and not relative! They also MUST be png files.
		const static_image_paths = {
			bjcp_logo: 'public/images/CANE-ISLAND-ALERS-LOGO_d400.png',
			aha_logo: 'public/images/CANE-ISLAND-ALERS-LOGO_d400.png',
			club_logo: 'public/images/CANE-ISLAND-ALERS-LOGO_d400.png',
			comp_logo: 'public/images/OpfermVI-hybrid_d400.png'
		}

		pdfService.generateScoresheet('views/bjcp_modified.pug', {
			scoresheet: scoresheet,
			flight: flight,
			judge: user,
			images: static_image_paths
		}, true).then(html => {
			res.send(html)
		})
	})
}

scoresheetController.generatePDF = function(req, res) {
	const scoresheetId = req.params.scoresheetId;
	const userIsAdmin = req.user.user_level

	Scoresheet.findOne({
		where: {
			id: scoresheetId
		}
	}).then(scoresheet => {
		if (!(scoresheet.user_id === req.user.id || userIsAdmin)) {
			return Promise.reject('NOT_AUTHORIZED')
		}

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
	}).then(async ([scoresheet, user, flight]) => {
		// These need to be STATIC and not relative! They also MUST be png files.
		const static_image_paths = {
			bjcp_logo: 'public/images/CANE-ISLAND-ALERS-LOGO_d400.png',
			aha_logo: 'public/images/CANE-ISLAND-ALERS-LOGO_d400.png',
			club_logo: 'public/images/CANE-ISLAND-ALERS-LOGO_d400.png',
			comp_logo: 'public/images/OpfermVI-hybrid_d400.png'
		}

		pdfService.generateScoresheet('views/bjcp_modified.pug', {
			scoresheet: scoresheet,
			flight: flight,
			judge: user,
			images: static_image_paths
		}).then(pdf => {
			res.send(pdf)
		})
	}).catch(err => {
        jsonErrorProcessor(err, res)
	})
};

module.exports = scoresheetController;