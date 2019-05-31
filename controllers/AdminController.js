let mongoose = require("mongoose");
let passport = require("passport");
let User = require("../models/User");
let Scoresheet = require("../models/Scoresheet");

let adminController = {};

adminController.controlPanel = function(req, res) {
	res.render("admin")
};

module.exports = adminController;