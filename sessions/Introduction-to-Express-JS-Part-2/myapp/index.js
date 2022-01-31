const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
const dbPath = path.join(__dirname, "goodreads.db");
let db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    console.log("DataBase Connected");
    app.listen(3000, () => {
      console.log(`Server Running at http://localhost:3000/`);
    });
  } catch (err) {
    console.log(`DB error: ${err.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();
app.get("/", (req, res) => {
  res.sendFile("./page.html", { root: __dirname });
});

app.get("/books/", async (req, res) => {
  const getBooksQuery = `select *
     from book
      order by
       book_id;`;

  let booksArray = await db.all(getBooksQuery);
  res.send(booksArray);
});
