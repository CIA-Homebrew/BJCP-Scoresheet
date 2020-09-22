const User = require('../models').User;
const Flight = require('../models').Flight;
const Scoresheet = require('../models').Scoresheet;

const flightController = {}

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
        res.status(500)
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
        res.status(500)
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
        res.status(500)
        console.log(err)
    })
}

flightController.editFlight = function(req, res) {
    const flightId = req.body.flightId
    const updateFlightParams = {
        flight_id: req.body.flightName,
        location: req.body.flightLocation,
        date: req.body.flightDate,
        created_by: req.user.id
    }

    Flight.upsert(updateFlightParams, {
        where: {
            id: flightId,
            created_by: req.user.id
        }
    }).then(newFlight => {
        res.json(newFlight)
    }).catch(err => {
        res.status(500)
        console.log(err)
    })
}

flightController.submitFlight = function(req, res) {
    const flightId = req.body.flightId

    Flight.update({submitted: true}, {
        where: {
            id: flightId,
            created_by: req.user.id
        }
    }).then(flightData => {
        return Scoresheet.update(
            {submitted: true},
            {where: {flightKey : flightData.id}}
        ).then(scoresheets => {
            return flightData
        })
    })
    .then(flightData => {
        res.json(flightData)
    }).catch(err => {
        res.status(500)
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
        res.status(500)
        console.log(err)
    })
}

module.exports = flightController