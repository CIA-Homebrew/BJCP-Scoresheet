let express = require('express');
let router = express.Router();

//* CONTROLLERS *//
let authController = require("../controllers/AuthController");
let scoresheetController = require('../controllers/ScoresheetController');
let adminController = require('../controllers/AdminController');
const flightController = require('../controllers/FlightController');

//* MIDDELWARE *//
let authMiddle = require("../middleware/auth");

//* CORE SITE FUNCTIONS *//

// route to index/home
router.get('/', authController.home);

// route to register page
router.get('/register', authController.register);

// route for register action
router.post('/register', authController.doRegister);

// route to login page
router.get('/login', authController.login);

// route for login action
router.post('/login', authController.doLogin);

// route for logout action
router.get('/logout', authController.logout);

// route for user profile edit
router.get('/profile/edit', authMiddle.isAuthenticated, authController.editProfile);

// route for user profile edit
router.post('/profile/edit', authMiddle.isAuthenticated, authController.saveProfile);
router.post('/profile/email', authMiddle.isAuthenticated, authController.updateEmail);
router.post('/profile/password', authMiddle.isAuthenticated, authController.updatePassword);

//* SCORESHEET FUNCTIONS *//
// REWRITES
router.get('/flight/scoresheet/edit/:scoresheetId', authMiddle.isAuthenticated, (req, res) => {
	req.session.scoresheetId = req.params.scoresheetId;
	res.redirect('/flight/scoresheet/edit/');
});
// GETS
router.get('/flight/scoresheet/edit/', authMiddle.isAuthenticated, scoresheetController.initScoresheet);
router.get('/scoresheet/pdf/:scoresheetId', authMiddle.isAuthenticated, scoresheetController.generatePDF);
// POSTS
router.post('/scoresheet/edit/', authMiddle.isAuthenticated, scoresheetController.initScoresheet);
router.post('/scoresheet/update/', authMiddle.isAuthenticated, scoresheetController.doScoresheetDataChange);
router.post('/scoresheet/previewpdf', authMiddle.isAdmin, scoresheetController.previewPDF);

//* ADMIN FUNCTIONS *//
// GETS
router.get('/admin', authMiddle.isAdmin, adminController.controlPanel);
router.get('/admin/alldata', authMiddle.isAdmin, adminController.getAllData)
// POSTS
router.post('/admin/resetpassword', authMiddle.isAdmin, authController.resetPassword)

//* FLIGHT FUNCTIONS *//
// REWRITES
router.get('/flight/:flightId/scoresheet/edit/', authMiddle.isAuthenticated, (req, res) => {
	req.session.flightId = req.params.flightId;
	res.redirect('/flight/scoresheet/edit/');
});
// GETS
router.get('/flight', authMiddle.isAuthenticated, flightController.home);

//POSTS
router.post('/flight/add', authMiddle.isAuthenticated, flightController.addFlight)
router.post('/flight/edit', authMiddle.isAdmin, flightController.editFlight)
router.post('/flight/submit', authMiddle.isAuthenticated, flightController.submitFlight)
router.post('/flight/getByName', authMiddle.isAuthenticated, flightController.getFlightByName)
router.post('/flight/getById', authMiddle.isAuthenticated, flightController.getFlightById)
router.post('/flight/delete', authMiddle.isAdmin, flightController.deleteFlight)

module.exports = router;