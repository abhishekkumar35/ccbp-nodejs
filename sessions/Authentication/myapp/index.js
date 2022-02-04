const express = require("express");
const bcrypt = require("bcrypt");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "goodreads.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

// Get Books API
app.get("/books/", async (request, response) => {
  const getBooksQuery = `
  SELECT
    *
  FROM
    book
  ORDER BY
    book_id;`;
  const booksArray = await db.all(getBooksQuery);
  response.send(booksArray);
});

// Register User API
app.post("/users", async (request, response) => {
  try {
    const { username, name, password } = request.body;
    const sqlUserCheck = `select * from user where username = '${username}';`;
    const dbRes = await db.all(sqlUserCheck);
    console.log(dbRes);
    dbRes === undefined ? console.log(true) : console.log(false);
    response.send(dbRes);
  } catch (error) {
    console.log(error);
  }
});
