const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const districtsRouter = require(path.join(
  __dirname,
  "routes",
  "districts.router"
));

const statesRouter = require(path.join(__dirname, "routes", "states.router"));
const app = express();
app.use(express.json()); // express json parser
const dbPath = path.join(__dirname, "models", "covid19India.db");

// routers
const statesRouter = express.Router();
const districtRouter = express.Router();

let db = null;
const PORT = 3000;
const initializeServerAndDatabase = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    console.log("Database connected successfully !");
    app.listen(3000, (error) => {
      if (error) console.log("Server Error!");
      console.log(`Server started and listening at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

initializeServerAndDatabase();
app.use("/states", statesRouter);
app.use("/districts", districtsRouter);

module.exports = app;
