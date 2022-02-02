const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
let db = null;
const dbPath = path.join(__dirname, "moviesData.db");
const PORT = 3300;
// database connection and init server
const initializeDatabaseAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    console.log("Database Connected!");
    app.listen(3300, () => {
      console.log(`Server Started and Listening at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};
initializeDatabaseAndServer();

app.get("/movies/", async (request, response) => {
  try {
    const fetchListOfMoviesInTable = `select * from movie`;
    const dbResponse = await db.all(fetchListOfMoviesInTable);
    response.send(dbResponse);
  } catch (error) {
    console.log(error);
  }
});

app.get("/movies/:movieId/", async (request, response) => {
  try {
    const { movieId } = request.params;
    const fetchMovieInTable = `select * from movie
      where movie_id = ${movieId}`;
    const dbResponse = await db.get(fetchMovieInTable);
    response.send(dbResponse);
  } catch (error) {
    console.log(error);
  }
});

app.get("/directors/", async (request, response) => {
  try {
    const fetchDirectorsInTable = `select * from director;`;
    const dbResponse = await db.all(fetchDirectorsInTable);
    response.send(dbResponse);
  } catch (error) {
    console.log(error);
  }
});

app.get("/directors/:directorId/movies/", async (request, response) => {
  try {
    const { director_id } = request.params;

    const fetchMoviesOfDirectorQuery = `select * from movie`;
    const dbResponse = db.all(fetchMoviesOfDirectorQuery);
    response.send(dbResponse);
  } catch (error) {
    console.log(error);
  }
});

app.post("/movies/", async (request, response) => {
  try {
    const movieDetails = request.body;
    const { directorId, movieName, leadActor } = movieDetails;
    const addNewMovieQuery = `insert into movie 
    (director_id, movie_name, lead_actor)
    values
    (${directorId}, ${movieName}, ${leadActor});
    `;
    await db.run(addNewMovieQuery);
    response.send("Movie Successfully Added");
  } catch (error) {
    console.log(error);
  }
});

app.put("/movies/:movieId/", async (request, response) => {
  try {
    const movieId = request.params();
    const movieDetails = request.body;
    const { directorId, movieName, leadActor } = movieDetails;
    const updateMovieQuery = `update movie set
    director_id=${directorId}, movie_name= ${movieName}, lead_actor=${leadActor}
    where movie_id = ${movieId}`;
    await db.run(updateMovieQuery);
    response.send("Movie Details Updated");
  } catch (error) {
    console.log(error);
  }
});

app.delete("/movies/:movieId/", async (request, response) => {
  try {
    const movieId = request.params();
    const deleteMovieQuery = `delete from movie where movie_id = ${movieId}`;
    await db.run(deleteMovieQuery);
    response.send("Movie Removed");
  } catch (error) {
    console.log(error);
  }
});
