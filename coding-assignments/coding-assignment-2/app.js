const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// First making an express object instance.
const app = express();

// using middleware express json parser
app.use(express.json());

// PORT and DB path
const PORT = 8081;
const dbPath = path.join(__dirname, "twitterClone.db");
let db = null;

// database and server initializer function
const initServerAndDB = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    console.log("Database Connected");
    app.listen(PORT, (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Listening at ${PORT}`);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

initServerAndDB();
// authenticateUser

// API1 path: /register  method: POST
app.post("/register", async (request, response) => {
  try {
    const {
      username = "",
      password = "",
      name = "",
      gender = "",
    } = request.body;
    const sqlQToCheckUsernameExistOrNot = `

    select * from user where username = '${username}';`;
    if (username === "") {
      response.status(401);
      response.send("Please Input Username");
    } else if (username !== undefined) {
      const userCheckDbResponse = await db.get(sqlQToCheckUsernameExistOrNot);
      if (userCheckDbResponse) {
        response.status(400);
        response.send("User already exists");
      } else {
        if (password.length < 6) {
          response.status(400);
          response.send("Password is too short");
        } else {
          const hashedPassword = await bcrypt.hash(password, 15);
          const createUserQ = `insert into user 
          (name,username,password,gender) values ('${name}','${username}','${hashedPassword}','${gender}');`;
          createUserDbResponse = await db.run(createUserQ);
          response.status(200);
          response.send("User created successfully");
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
});

// API 2 path: /login/   method : POST
app.post("/login", async (request, response) => {});

module.exports = app;
