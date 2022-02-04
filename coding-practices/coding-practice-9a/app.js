const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");
const path = require("path");
const app = express();
app.use(express.json());
//database and server init
const PORT = 3000;
dbPath = path.join(__dirname, "userData.db"); //database path
let db = null; // to store database connection object
const initServerAndDB = async () => {
  try {
    // connecting to database
    db = await open({
      // returns a promise object
      filename: dbPath,
      driver: sqlite3.Database,
    });
    console.log("Database Connected !");
    app.listen(PORT, (error) => {
      if (error) {
        console.log(error);
        process.exit(1);
      } else {
        console.log(`Server is Listening at http://localhost:${PORT}`);
      }
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
initServerAndDB(); // invoking server and database
app.post("/register", async (request, response) => {
  try {
    const { username, name, password, gender, location } = request.body;
    const sqlQ = `select * from user where username = '${username}';`;
    const dbUser = await db.get(sqlQ);
    if (dbUser === undefined) {
      if (password.length < 5) {
        response.status(400);
        response.send("Password is too short");
      } else {
        const hashedPassword = await bcrypt.hash(password, 14); //saltRounds = 14
        const insertUserQ = `insert into user 
      (username, name, password, gender, location)
       values
      ('${username}', '${name}', '${hashedPassword}', '${gender}', '${location}');`;
        await db.run(insertUserQ);
        response.status(200);
        response.send("User created successfully");
      }
    } else {
      response.status(400);
      response.send("User already exists");
    }
  } catch (error) {
    console.log(error);
  }
});

app.post("/login", async (request, response) => {
  try {
    const { username, password } = request.body;
    const sqlQ = `select * from user where username = '${username}';`;
    const dbUser = await db.get(sqlQ);
    if (dbUser === undefined) {
      //invalid user
      response.status(400);
      response.send("Invalid user");
    } else {
      // user exist authentication process
      const passwordCheck = await bcrypt.compare(password, dbUser.password);

      if (passwordCheck) {
        response.status(200);
        response.send("Login success!");
      } else {
        response.status(400);
        response.send("Invalid password");
      }
    }
  } catch (error) {
    console.log(error);
  }
});

app.put("/change-password", async (request, response) => {
  try {
    const { username, oldPassword, newPassword } = request.body;
    console.log(username, oldPassword, newPassword);
    const sqlQ = `select * from user where username = '${username}'`;
    const dbUser = await db.get(sqlQ);
    if (dbUser !== undefined) {
      const oldPasswordCheck = await bcrypt.compare(
        oldPassword,
        dbUser.password
      );
      if (oldPasswordCheck) {
        if (newPassword.length < 5) {
          response.status(400);
          response.send("Password is too short");
        } else {
          const hashedPassword = bcrypt.hash(newPassword, 14);
          const changePasswordQ = `update 
        user 
        set 
        password = '${hashedPassword}'
        where 
        username = '${username}'
        `;
          await db.run(changePasswordQ); // updating password
          response.status(200);
          response.send("Password updated");
        }
      } else {
        response.status(400);
        response.send("Invalid current password");
      }
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = app;
