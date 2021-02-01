const User = require("../models").User;
const Flight = require("../models").Flight;
const Scoresheet = require("../models").Scoresheet;
const errorConstants = require("../helpers/errorConstants");

function jsonErrorProcessor(err, res) {
  if (errorConstants[err]) {
    res.status(400).json({
      errors: [
        {
          code: err,
          message: errorConstants[err],
        },
      ],
    });
  } else {
    console.log(err);
    jsonErrorProcessor(err, res);
  }
}

const flightController = {};

flightController.getFlightByName = function (req, res) {
  const flightName = req.body.flightName;
  const userIsAdmin = req.user.user_level;

  Flight.findOne({
    where: {
      flight_id: flightName,
      UserId: userIsAdmin ? undefined : req.user.id,
    },
  })
    .then((flight) => {
      const flightObject = flight.get({ plain: true });
      res.json(flightObject);
    })
    .catch((err) => {
      jsonErrorProcessor(err, res);
      console.log(err);
    });
};

flightController.getFlightById = function (req, res) {
  const flightId = req.body.flightId;
  const userIsAdmin = req.user.user_level;

  Flight.findOne({
    where: {
      id: flightId,
      UserId: userIsAdmin ? undefined : req.user.id,
    },
  })
    .then((flight) => {
      const flightObject = flight.get({ plain: true });
      res.json(flightObject);
    })
    .catch((err) => {
      jsonErrorProcessor(err, res);
      console.log(err);
    });
};

flightController.addFlight = function (req, res) {
  const newFlightParams = {
    flight_id: req.body.flightName,
    location: req.body.flightLocation,
    date: req.body.flightDate,
    UserId: req.user.id,
  };

  Flight.create(newFlightParams)
    .then((newFlight) => {
      res.json(newFlight);
    })
    .catch((err) => {
      jsonErrorProcessor(err, res);
    });
};

flightController.editFlight = function (req, res) {
  const userIsAdmin = req.user.user_level;

  const flightId = req.body.flightId;
  const updateFlightParams = {
    flight_id: req.body.flightName,
    location: req.body.flightLocation,
    date: req.body.flightDate,
    UserId: userIsAdmin ? req.body.createdBy : undefined, // Only admins can reassign flights
    submitted: userIsAdmin ? req.body.submitted : undefined, // Only admins can unsubmit a flight
  };

  Flight.update(updateFlightParams, {
    where: {
      id: flightId,
      UserId: userIsAdmin ? undefined : req.user.id,
    },
  })
    .then((newFlight) => {
      res.json(newFlight);
    })
    .catch((err) => {
      jsonErrorProcessor(err, res);
    });
};

flightController.submitFlight = function (req, res) {
  const flightId = req.body.flightId;

  return Scoresheet.findAndCountAll({
    where: { FlightId: flightId },
  })
    .then((scoresheets) => {
      if (scoresheets.count === 0) {
        console.log(scoresheets.count);
        return Promise.reject("INVALID_FLIGHT_EMPTY");
      }

      return Flight.update(
        { submitted: true },
        {
          where: {
            id: flightId,
            UserId: req.user.id,
          },
        }
      );
    })
    .then((flightId) => {
      res.json(flightId);
    })
    .catch((err) => {
      jsonErrorProcessor(err, res);
      console.log(err);
    });
};

flightController.deleteFlight = function (req, res) {
  const flightId = req.body.flightId;
  const userIsAdmin = req.user.user_level;

  Flight.destroy({
    where: {
      id: flightId,
      UserId: userIsAdmin ? undefined : req.user.id,
    },
  })
    .then(() => {
      res.status(200);
    })
    .catch((err) => {
      jsonErrorProcessor(err, res);
      console.log(err);
    });
};

module.exports = flightController;
