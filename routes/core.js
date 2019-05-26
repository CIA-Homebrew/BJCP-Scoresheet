let express = require('express');
let router = express.Router();
let auth = require("../controllers/AuthController.js");
let scoresheet = require('../controllers/ScoresheetController.js')

// restrict index for logged in user only
router.get('/', auth.home);

// route to register page
router.get('/register', auth.register);

// route for register action
router.post('/register', auth.doRegister);

// route to login page
router.get('/login', auth.login);

// route for login action
router.post('/login', auth.doLogin);

// route for logout action
router.get('/logout', auth.logout);

// route for user profile edit
router.get('/profile/edit', auth.editProfile);

//* SCORESHEET FUNCTIONS *//

//route for scoresheet list load
router.get('/scoresheet/load', scoresheet.loadScoresheetList);

//route for new scoresheet load
router.get('/scoresheet/new', scoresheet.newScoresheet);

//route for new scoresheet post
router.post('/scoresheet/new', scoresheet.doNewScoresheet);

//route for change scoresheet post
router.post('/scoresheet/change', scoresheet.doChangeScoresheet);

//route for check scoresheet post
router.post('/scoresheet/check', scoresheet.doCheckScoresheet);

//route for scoresheet individual load
router.get('/scoresheet/:scoresheetId', scoresheet.loadScoresheet);

module.exports = router;