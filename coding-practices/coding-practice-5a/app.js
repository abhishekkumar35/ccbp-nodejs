const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json()); // express json parser
const dbPath = path.join(__dirname, "moviesData.db");
let db = null;
const PORT = 3000;
const initializeServerAndDatabase = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
<<<<<<< HEAD
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
=======
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
app.get("/movies", async (request, response) => {
  try {
    const moviesQ = `select movie_name from movie`;
    const dbResponse = await db.all(moviesQ);
>>>>>>> fb164f1d9859155c8e70798223c40ffce14f231c
    response.send(dbResponse);
  } catch (error) {
    console.log(error);
  }
});

app.get("/movies/:movieId/", async (request, response) => {
  try {
    const { movieId } = request.params;
<<<<<<< HEAD
    const fetchMovieInTable = `select * from movie
      where movie_id = ${movieId}`;
    const dbResponse = await db.get(fetchMovieInTable);
=======
    console.log(movieId);
    const movieQ = `select * from movie
    where movie_id = ${movieId};`;
    const dbResponse = await db.get(movieQ);
>>>>>>> fb164f1d9859155c8e70798223c40ffce14f231c
    response.send(dbResponse);
  } catch (error) {
    console.log(error);
  }
});

<<<<<<< HEAD
app.get("/directors/", async (request, response) => {
  try {
    const fetchDirectorsInTable = `select * from director;`;
    const dbResponse = await db.all(fetchDirectorsInTable);
=======
app.get("/directors/:directorId/movies/", async (request, response) => {
  try {
    const { directorId } = request.params;
    const directorMoviesQ = `select * from movie
    where director_id = ${directorId};`;
    const dbResponse = await db.all(directorMoviesQ);
>>>>>>> fb164f1d9859155c8e70798223c40ffce14f231c
    response.send(dbResponse);
  } catch (error) {
    console.log(error);
  }
});

<<<<<<< HEAD
app.get("/directors/:directorId/movies/", async (request, response) => {
  try {
    const { director_id } = request.params;

    const fetchMoviesOfDirectorQuery = `select * from movie`;
    const dbResponse = db.all(fetchMoviesOfDirectorQuery);
=======
app.get("/directors", async (request, response) => {
  try {
    const moviesQ = `select * from director`;
    const dbResponse = await db.all(moviesQ);
>>>>>>> fb164f1d9859155c8e70798223c40ffce14f231c
    response.send(dbResponse);
  } catch (error) {
    console.log(error);
  }
});

app.post("/movies/", async (request, response) => {
  try {
    const movieDetails = request.body;
    const { directorId, movieName, leadActor } = movieDetails;
<<<<<<< HEAD
    const addNewMovieQuery = `insert into movie 
    (director_id, movie_name, lead_actor)
    values
    (${directorId}, ${movieName}, ${leadActor});
    `;
    await db.run(addNewMovieQuery);
    response.send("Movie Successfully Added");
=======
    const updateMovieQ = `insert into
    movie 
    (director_id,movie_name,lead_actor) values (${directorId},'${movieName}','${leadActor}')
    ;`;
    await db.run(updateMovieQ);
    response.send(`Movie Successfully Added`);
>>>>>>> fb164f1d9859155c8e70798223c40ffce14f231c
  } catch (error) {
    console.log(error);
  }
});

<<<<<<< HEAD
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
=======
app.put("/movies/:movieId", async (request, response) => {
  try {
    const { movieId } = request.params;
    const movieDetails = request.body;
    const { directorId, movieName, leadActor } = movieDetails;

    const updateMovieQ = `update
    movie
    set
        director_id='${directorId}',
        movie_name=${movieName},
        lead_actor='${leadActor}'
    where movie_id = ${movieId};`;
    await db.run(updateMovieQ);

    response.send(`Movie Details Updated`);
>>>>>>> fb164f1d9859155c8e70798223c40ffce14f231c
  } catch (error) {
    console.log(error);
  }
});

<<<<<<< HEAD
app.delete("/movies/:movieId/", async (request, response) => {
  try {
    const movieId = request.params();
    const deleteMovieQuery = `delete from movie where movie_id = ${movieId}`;
    await db.run(deleteMovieQuery);
=======
app.delete("/movies/:movieId", async (request, response) => {
  try {
    const { movieId } = request.params;
    const deleteMovieQ = `DELETE from movie where movie_id = ${movieId}`;
    await db.run(deleteMovieQ);
>>>>>>> fb164f1d9859155c8e70798223c40ffce14f231c
    response.send("Movie Removed");
  } catch (error) {
    console.log(error);
  }
});
<<<<<<< HEAD
=======

module.exports = app;
>>>>>>> fb164f1d9859155c8e70798223c40ffce14f231c
