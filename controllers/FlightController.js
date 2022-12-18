const User = require("../models").User;
const Competition = require("../models").Competition;
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
    },
  })
    .then((flight) => {
      const flightObject = flight.get({ plain: true });
      res.json(flightObject);
    })
    .catch((err) => {
      jsonErrorProcessor(err, res);
    });
};

flightController.getFlightById = function (req, res) {
  const flightId = req.body.flightId;
  const userIsAdmin = req.user.user_level;

  Flight.findOne({
    where: {
      id: flightId,
    },
    include: User,
  })
    .then(async (flight) => {
      const numScoresheets = await Scoresheet.findAndCountAll({
        where: { FlightId: flight.id },
      }).then((scoresheets) => scoresheets.count);

      const flightObject = flight.get({ plain: true });
      flightObject.flight_total = numScoresheets;

      flightObject.judge_name =
        flight.User.firstname + " " + flight.User.lastname;
      flightObject.bjcp_id = flight.User.bjcp_id;
      flightObject.bjcp_rank = flight.User.bjcp_rank;

      res.json(flightObject);
    })
    .catch((err) => {
      jsonErrorProcessor(err, res);
    });
};

flightController.addFlight = function (req, res) {
  const newFlightParams = {
    flight_id: req.body.flightName,
    location: req.body.flightLocation,
    date: req.body.flightDate,
    UserId: req.user.id,
    CompetitionId: req.body.competitionId,
  };

  console.log(newFlightParams);

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
  let updateFlightParams = {
    flight_id: req.body.flightName,
    location: req.body.flightLocation,
    date: req.body.flightDate,
  };

  // Only admins can reassign flights
  if (req.body.createdBy && userIsAdmin) {
    updateFlightParams.UserId = req.body.createdBy;
  }

  // Only admins can unsubmit a flight
  if (userIsAdmin) {
    updateFlightParams.submitted = Boolean(req.body.submitted);
  }

  const searchConditions = { id: flightId };
  if (!userIsAdmin) {
    searchConditions.UserId = req.user.id;
  }

  Flight.update(updateFlightParams, {
    where: searchConditions,
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
    });
};

flightController.deleteFlight = function (req, res) {
  const flightId = req.body.flightId;
  const userIsAdmin = req.user.user_level;

  const queryParams = {
    id: flightId,
  };

  if (!userIsAdmin) {
    queryParams.UserId = req.user.id;
  }

  Flight.destroy({
    where: queryParams,
  })
    .then(() => {
      res.status(200).json(flightId);
    })
    .catch((err) => {
      jsonErrorProcessor(err, res);
    });
};

module.exports = flightController;
