const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

let db = {};
const PORT = 3000;
const dbPath = path.join(__dirname, "models", "covid19India.db");
const initializeServerAndDatabase = async (app) => {
  try {
    db.database = await open({
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
module.exports = {
  db,
  PORT,
  initializeServerAndDatabase,
};
