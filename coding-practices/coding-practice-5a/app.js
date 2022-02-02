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

    response.send(
      dbResponse.map((obj) => {
        return { movieName: obj.movie_name };
      })
    );
  } catch (error) {
    console.log(error);
  }
});

app.get("/movies/:movieId/", async (request, response) => {
  try {
    const { movieId } = request.params;
    console.log(movieId);
    const movieQ = `select * from movie
    where movie_id = ${movieId};`;
    const dbResponse = await db.get(movieQ);
    response.send({
      movieId: dbResponse.movie_id,
      directorId: dbResponse.director_id,
      movieName: dbResponse.movie_name,
      leadActor: dbResponse.lead_actor,
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/directors/:directorId/movies/", async (request, response) => {
  try {
    const { directorId } = request.params;
    const directorMoviesQ = `select * from movie
    where director_id = ${directorId};`;
    const dbResponse = await db.all(directorMoviesQ);
    console.log(dbResponse);
    response.send(
      dbResponse.map((movie) => {
        return {
          movieName: movie.movie_name,
        };
      })
    );
  } catch (error) {
    console.log(error);
  }
});

app.get("/directors", async (request, response) => {
  try {
    const moviesQ = `select * from director`;
    const dbResponse = await db.all(moviesQ);

    response.send(
      dbResponse.map((e) => {
        return { directorId: e.director_id, directorName: e.director_name };
      })
    );
  } catch (error) {
    console.log(error);
  }
});

app.post("/movies/", async (request, response) => {
  try {
    const movieDetails = request.body;
    const { directorId, movieName, leadActor } = movieDetails;
    const updateMovieQ = `insert into
    movie 
    (director_id,movie_name,lead_actor) values (${directorId},'${movieName}','${leadActor}')
    ;`;
    await db.run(updateMovieQ);
    response.send(`Movie Successfully Added`);
  } catch (error) {
    console.log(error);
  }
});

app.put("/movies/:movieId", async (request, response) => {
  try {
    const { movieId } = request.params;
    const movieDetails = request.body;
    const { directorId, movieName, leadActor } = movieDetails;

    const updateMovieQ = `update
    movie
    set
        director_id=${directorId},
        movie_name='${movieName}',
        lead_actor='${leadActor}'
    where movie_id = ${movieId};`;
    await db.run(updateMovieQ);

    response.send(`Movie Details Updated`);
  } catch (error) {
    console.log(error);
  }
});

app.delete("/movies/:movieId", async (request, response) => {
  try {
    const { movieId } = request.params;
    const deleteMovieQ = `DELETE from movie where movie_id = ${movieId}`;
    await db.run(deleteMovieQ);
    response.send("Movie Removed");
  } catch (error) {
    console.log(error);
  }
});

module.exports = app;
