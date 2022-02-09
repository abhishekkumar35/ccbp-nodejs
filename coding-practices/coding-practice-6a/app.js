const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const { db, PORT, initializeServerAndDatabase } = require("./dbServer");
const districtsRouter = require(path.join(
  __dirname,
  "routes",
  "districts.router"
));
const statesRouter = require(path.join(__dirname, "routes", "states.router"));

const app = express();
app.use(express.json()); // express json parser



// routers

initializeServerAndDatabase(app);
app.use("/states", statesRouter);
app.use("/districts", districtsRouter);

module.exports = app;
