/**
 * System and 3rd party libs
 */
require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

/**
 * Required Services
 */
const Logger = require("./services/logger");

/**
 * Global declarations
 */
const models = path.join(__dirname, "models");
const dbURL = process.env.DB_URL || "mongodb://127.0.0.1:27017/multilingual";

const app = express();

// CORS
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      " X-Requested-With",
      " Content-Type",
      " Accept ",
      " Authorization",
    ],
    credentials: true,
  })
);
app.use(Logger.morgan);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

/**
 * Import and Register Routes
 */
const index = require("./routers/index");

app.use("/", index);
/**
 * Catch 404 routes
 */
app.use(function (req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

/**
 * Mongoose Configuration
 */
mongoose.Promise = global.Promise;

mongoose.connection.on("connected", () => {
  Logger.log.info("DATABASE - Connected");
});

mongoose.connection.on("error", (err) => {
  Logger.log.error(`DATABASE - Error:${err}`);
});

mongoose.connection.on("disconnected", () => {
  Logger.log.warn("DATABASE - disconnected  Retrying....");
});

const connectDb = function () {
  const dbOptions = {
    useNewUrlParser: true,
  };
  mongoose.connect(dbURL, dbOptions).catch((err) => {
    Logger.log.fatal(`DATABASE - Error:${err}`);
  });
};

connectDb();
module.exports = app;
