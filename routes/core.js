let express = require("express");
let router = express.Router();

//* CONTROLLERS *//
let authController = require("../controllers/AuthController");
let scoresheetController = require("../controllers/ScoresheetController");
let adminController = require("../controllers/AdminController");
const flightController = require("../controllers/FlightController");

//* MIDDELWARE *//
let authMiddle = require("../middleware/auth");

//* CORE SITE FUNCTIONS *//

// route to index/home
router.get("/", authController.home);

// route to register page
router.get("/register", authController.register);

// route for register action
router.post("/register", authController.doRegister);

// route to login page
router.get("/login", authController.login);

// route for login action
router.post("/login", authController.doLogin);

// route for logout action
router.get("/logout", authController.logout);

// route for user profile edit
router.get(
  "/profile/edit",
  authMiddle.isAuthenticated,
  authController.editProfile
);

// route for user profile edit
router.post(
  "/profile/edit",
  authMiddle.isAuthenticated,
  authController.saveProfile
);
router.post(
  "/profile/email",
  authMiddle.isAuthenticated,
  authController.updateEmail
);
router.post(
  "/profile/password",
  authMiddle.isAuthenticated,
  authController.updatePassword
);

// route for email functinos
router.get("/requestvalidation", authController.requestEmailValidation);
router.get("/validate", authController.validateEmail);
router.get("/forgotPassword", authController.userRequestPasswordResetForm);
router.post("/forgotpassword", authController.userRequestPasswordReset);
router.get("/resetpassword", authController.userResetPasswordForm);
router.post("/resetpassword", authController.userResetPassword);

// route for unsubscribe from email functions
router.get("/unsubscribe", authController.unsubscribeForm);
router.post("/unsubscribe", authController.unsubscribe);

//* SCORESHEET FUNCTIONS *//

//route for scoresheet individual or new load
router.get(
  "/scoresheet/edit/",
  authMiddle.isAuthenticated,
  scoresheetController.initScoresheet
);
router.post(
  "/scoresheet/data",
  authMiddle.isAuthenticated,
  scoresheetController.getScoresheetData
);

//route for scoresheet individual post edit
router.post(
  "/scoresheet/edit/",
  authMiddle.isAuthenticated,
  scoresheetController.initScoresheet
);

// route for scoresheet delete
router.post(
  "/scoresheet/delete/",
  authMiddle.isAuthenticated,
  scoresheetController.deleteScoresheet
);

// route for scoresheet ajax autosave
router.post(
  "/scoresheet/update/",
  authMiddle.isAuthenticated,
  scoresheetController.doScoresheetDataChange
);

//route for PDF Generate
router.post(
  "/scoresheet/pdf",
  authMiddle.isAuthenticated,
  scoresheetController.generatePDF
);
router.post(
  "/scoresheet/previewpdf",
  authMiddle.isAdmin,
  scoresheetController.previewPDF
);
router.post(
  "/scoresheet/downloadstatus",
  authMiddle.isAuthenticated,
  scoresheetController.getDownloadStatus
);

//* ADMIN FUNCTIONS *//
router.get("/admin", authMiddle.isAdmin, adminController.controlPanel);
router.get("/admin/alldata", authMiddle.isAdmin, adminController.getAllData);
router.post(
  "/admin/resetpassword",
  authMiddle.isAdmin,
  authController.resetPassword
);

//* FLIGHT FUNCTIONS *//
router.post(
  "/flight/add",
  authMiddle.isAuthenticated,
  flightController.addFlight
);
router.post(
  "/flight/edit",
  authMiddle.isAuthenticated,
  flightController.editFlight
);
router.post(
  "/flight/submit",
  authMiddle.isAuthenticated,
  flightController.submitFlight
);
router.post(
  "/flight/getByName",
  authMiddle.isAuthenticated,
  flightController.getFlightByName
);
router.post(
  "/flight/getById",
  authMiddle.isAuthenticated,
  flightController.getFlightById
);
router.post(
  "/flight/delete",
  authMiddle.isAuthenticated,
  flightController.deleteFlight
);
router.post(
  "/flight/incompleteScoresheets",
  authMiddle.isAuthenticated,
  scoresheetController.getIncompleteScoresheetsInFlight
);

module.exports = router;
