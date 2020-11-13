let passport = require("../helpers/seq.passport");
const User = require("../models").User;
const Flight = require("../models").Flight;
const Scoresheet = require("../models").Scoresheet;
let appConstants = require("../helpers/appConstants");
let debug = require("debug")("aha-scoresheet:adminController");

let adminController = {};

adminController.controlPanel = function (req, res) {
  res.render("admin", {
    user: req.user,
    title: appConstants.APP_NAME + " - Admin Home",
  });
};

adminController.getAllData = function (req, res) {
  const allFlights = Flight.findAll();
  const allScoresheets = Scoresheet.findAll();
  const allUsers = User.findAll({
    attributes: { exclude: ["password"] },
  });

  Promise.all([allFlights, allScoresheets, allUsers]).then(
    ([flights, scoresheets, users]) => {
      res.json({
        flights,
        scoresheets,
        users,
      });
    }
  );
};

module.exports = adminController;
