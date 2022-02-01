const express = require("express");
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

//Get Book API
app.get("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;
  const getBookQuery = `select * from book where book_id = ${bookId};`;
  let book = await db.get(getBookQuery);
  const body = JSON.stringify(book);
  response.send(body);
});

//Add Book API
app.post("/books/", async (request, response) => {
  const bookDetails = request.body;
  const {
    title,
    authorId,
    rating,
    ratingCount,
    reviewCount,
    description,
    pages,
    dateOfPublication,
    editionLanguage,
    price,
    onlineStores,
  } = bookDetails;
  const addBookQuery = `

    INSERT INTO
      book (title,author_id,rating,rating_count,review_count,description,pages,date_of_publication,edition_language,price,online_stores)
    VALUES
      (
        '${title}',
         ${authorId},
         ${rating},
         ${ratingCount},
         ${reviewCount},
        '${description}',
         ${pages},
        '${dateOfPublication}',
        '${editionLanguage}',
         ${price},
        '${onlineStores}'
      );`;
  const dbBookResponse = await db.run(addBookQuery);

  const bookId = dbBookResponse.lastId;
  response.send({ bookId: bookId });
});

app.put("/books/:bookID", async (request, response) => {
  try {
    const bookId = request.params;
    const bookDetails = request.body;

    const {
      title,
      authorId,
      rating,
      ratingCount,
      reviewCount,
      description,
      pages,
      dateOfPublication,
      editionLanguage,
      price,
      onlineStores,
    } = bookDetails;

    const updateBookQuery = `
        UPDATE book 
        SET
      title='${title}',
      author_id=${authorId},
      rating=${rating},
      rating_count=${ratingCount},
      review_count=${reviewCount},
      description='${description}',
      pages=${pages},
      date_of_publication='${dateOfPublication}',
      edition_language='${editionLanguage}',
      price= ${price},
      online_stores='${onlineStores}'
      where book_id = ${bookId}

    `;
    await db.run(updateBookQuery);
    response.send("Book Updated Successfully!");
  } catch (error) {
    response.send(`error: ${error}`);
    console.log(`error: ${error}`);
  }
});
app.delete("/books/:bookId", async (request, response) => {
  try {
    const bookId = request.params;
    const deleteQuery = `delete from book where book_id = ${bookId}`;
    await db.run(deleteQuery);
    response.send("Book Deleted Successfully!");
  } catch (error) {
    response.send(`error: ${error}`);
  }
});
app.get("/author/:authorId/books", async (request, response) => {
  try {
    const { authorId } = request.params;
    const authorBooksQuery = `select * from book where author_id = ${authorId}`;

    const dbResponseAuthorBooks = await db.all(authorBooksQuery);
    response.send(dbResponseAuthorBooks);
  } catch (error) {
    response.send(`error:${error}`);
  }
});
