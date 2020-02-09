let express = require('express');
let router = express.Router();

//* CONTROLLERS *//
let authController = require("../controllers/AuthController");
let scoresheetController = require('../controllers/ScoresheetController');
let adminController = require('../controllers/AdminController');

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

//* SCORESHEET FUNCTIONS *//

//route for scoresheet list load
router.get('/scoresheet/load', authMiddle.isAuthenticated, scoresheetController.loadScoresheetList);

//route for PDF Generate
router.get('/scoresheet/pdf/:scoresheetId', authMiddle.isAuthenticated, scoresheetController.generatePDF);

//route for new scoresheet load
router.get('/scoresheet/new', authMiddle.isAuthenticated, scoresheetController.newScoresheet);

//route for new scoresheet post
router.post('/scoresheet/new', authMiddle.isAuthenticated, scoresheetController.doNewScoresheet);

//route for change scoresheet post
router.post('/scoresheet/change', authMiddle.isAuthenticated, scoresheetController.doChangeScoresheet);

//route for check scoresheet post
router.post('/scoresheet/check', authMiddle.isAuthenticated, scoresheetController.doCheckScoresheet);

//route for validate scoresheet post
router.post('/scoresheet/validate', authMiddle.isAuthenticated, scoresheetController.doValidateScoresheet);

//route for scoresheet individual load
router.post('/scoresheet/edit/', authMiddle.isAuthenticated, scoresheetController.loadScoresheet);

//* ADMIN FUNCTIONS *//
router.get('/admin', authMiddle.isAdmin, adminController.controlPanel);

module.exports = router;