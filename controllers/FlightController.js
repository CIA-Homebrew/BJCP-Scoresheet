const User = require('../models').User;
const Flight = require('../models').Flight;
const Scoresheet = require('../models').Scoresheet;
const errorConstants = require("../helpers/errorConstants");

let appConstants = require("../helpers/appConstants");
let debug = require('debug')('aha-scoresheet:flightController');

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

const flightController = {};

// Restrict access to root page
flightController.home = function(req, res) {
	const scoresheetPromise = Scoresheet.findAll({
		where: {
			user_id : req.user.id
		},
	})

	const flightPromise = Flight.findAll({
		where: {
			created_by : req.user.id
		},
	})

	Promise.all([scoresheetPromise, flightPromise]).then(([scoresheets, flights]) => {
		const flightObject = {}

		flights.forEach(flight => {
			flightObject[flight.id] = {
				...flight.get({plain:true}),
				scoresheets : scoresheets.filter(scoresheet => scoresheet.flight_key === flight.id).map(scoresheet => scoresheet.get({plain:true}))
			}
		})

		res.render('flights', {
			user: req.user,
			title : appConstants.APP_NAME + " - Home",
			flights: flightObject
		})
	}).catch(err => {
		res.status(500)
		debug(err)
		console.log(err)
	})
};

flightController.getFlightByName = function(req,res) {
    const flightName = req.body.flightName

    Flight.findOne({
        where: {
            flight_id: flightName,
            created_by: req.user.id
        }
    }).then(flight => {
        const flightObject = flight.get({plain:true})
        res.json(flightObject)
    }).catch(err => {
        jsonErrorProcessor(err, res)
        console.log(err)
    })
}

flightController.getFlightById = function(req, res) {
    const flightId = req.body.flightId

    Flight.findOne({
        where: {
            id: flightId,
            created_by: req.user.id
        }
    }).then(flight => {
        const flightObject = flight.get({plain:true})
        res.json(flightObject)
    }).catch(err => {
        jsonErrorProcessor(err, res)
        console.log(err)
    })
}

flightController.addFlight = function(req, res) {
    const newFlightParams = {
        flight_id: req.body.flightName,
        location: req.body.flightLocation,
        date: req.body.flightDate,
        created_by: req.user.id
    }

    Flight.create(newFlightParams).then(newFlight => {
        res.json(newFlight)
    }).catch(err => {
        jsonErrorProcessor(err, res)
    })
}

flightController.editFlight = function(req, res) {
    const flightId = req.body.flightId
    const updateFlightParams = {
        flight_id: req.body.flightName,
        location: req.body.flightLocation,
        date: req.body.flightDate,
        created_by: req.body.createdBy || req.user.id,
        submitted: req.user.user_level >= 900 ? req.body.submitted : undefined
    }

    Flight.update(updateFlightParams, {
        where: {
            id: flightId,
        }
    }).then(newFlight => {
        if (updateFlightParams.submitted !== undefined) {
            return Scoresheet.update(
                {scoresheet_submitted: updateFlightParams.submitted},
                {
                    where: {flight_key : flightId},
                    returning: true
                }
            ).then(() => {
                return newFlight
            }).catch(err => {
                jsonErrorProcessor(err, res)
            })
        } else {
            return Promise.resolve(newFlight)
        }
    }).then(newFlight => {
        res.json(newFlight)
    }).catch(err => {
        jsonErrorProcessor(err, res)
    })
}

flightController.submitFlight = function(req, res) {
    const flightId = req.body.flightId

    return Scoresheet.update(
        {scoresheet_submitted: true},
        {
            where: {flight_key : flightId},
            returning: true
        }
    ).then(scoresheets => {
        if (scoresheets[1] === 0 || scoresheets[1].length === 0) {
            return Promise.reject("INVALID_FLIGHT_EMPTY")
        }

        return Flight.update({submitted: true}, {
            where: {
                id: flightId,
                created_by: req.user.id
            }
        })
    })
    .then(flightId => {
        res.json(flightId)
    })
    .catch(err => {
        jsonErrorProcessor(err, res)
        console.log(err)
    })
}

flightController.deleteFlight = function(req, res) {
    const flightId = req.body.flightId

    Flight.destroy({
        where: {
            id: flightId,
            created_by: req.user.id
        }
    }).then(() => {
        res.status(200)
    }).catch(err => {
        jsonErrorProcessor(err, res)
        console.log(err)
    })
}

module.exports = flightController