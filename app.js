// Setup environmental variables
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

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
const db = require("./models/index");

let coreRouter = require("./routes/core");

// Clear temporary files on app process exit
tmp.setGracefulCleanup();

// Set up persistent sessions
const SequelizeStore = require("connect-session-sequelize")(
  expressSession.Store
);
const persistentDbStore = new SequelizeStore({
  db: db.sequelize,
});

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
    secret: "bjcp-scoresheet-secret",
    store: persistentDbStore,
    resave: false,
    saveUninitialized: false,
    proxy: true,
  })
);

persistentDbStore.sync();

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

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
