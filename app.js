let createError = require("http-errors");
let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let expressSession = require("express-session");
let logger = require("morgan");
let stylus = require("stylus");
let flash = require("connect-flash");
const tmp = require("tmp");
let models = require("./models");
let passport = require("passport");
let debug = require("debug")("aha-scoresheet:app");

let coreRouter = require("./routes/core");

// Clear temporary files on app process exit
tmp.setGracefulCleanup();

// Setup environmental variables
require("dotenv").config();

let app = express();

// Sequelize middleware
app.use(function (req, res, next) {
  req.models = models;
  next();
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(stylus.middleware(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  expressSession({
    secret: "bjcpScoresheet",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

//app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

app.use("/", coreRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
