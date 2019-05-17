let mongoose = require("mongoose");
let passport = require("passport");
let User = require("../models/User");

let scoresheetController = {};

//Load Scoresheet List
scoresheetController.loadScoresheetList = function(req, res) {
	res.render('loadScoresheetList');
};

//Load Individual Scoresheet
scoresheetController.loadScoresheet = function(req, res) {
    console.log(req.params);
    if (req.user){
        res.render('loadScoresheet', {
            sendData:req.params
        });
    } else {
        res.redirect('/');
    }
};

// New Scoresheet Render
scoresheetController.newScoresheet = function(req, res) {
    if (req.user){
        res.render('newScoresheet');
    } else {
        res.redirect('/')
    }
};

//New Scoresheet Post
scoresheetController.doNewScoresheet = function(req, res) {
    // console.log(req.body);
    if (req.user){
        res.render('submitScoresheet');
    } else {
        res.redirect('/')
    }
}

module.exports = scoresheetController;