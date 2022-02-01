const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json()); // express json parser
const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;

const initializeServerAndDatabase = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    console.log("Database connected successfully !");
    app.listen(3000, (req, res) => {
      console.log("Server started and listening at http://localhost:3000");
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
initializeServerAndDatabase();
app.get("/players/", async (req, res) => {
  try {
    const fetchAllPlayersQuery = `select * from cricket_team;`;
    const dbResponse = await db.all(fetchAllPlayersQuery);
    res.send(dbResponse);
  } catch (error) {
    console.log(error);
  }
});
app.get("/players/:playerId/", async (request, response) => {
  try {
    const { playerId } = request.params;
    console.log(playerId);
    const getPlayerByIdQuery = `select * from cricket_team 
    where player_id = ${playerId};`;
    const dbResponse = await db.get(getPlayerByIdQuery);
    response.send(dbResponse);
  } catch (error) {
    console.log(`${error}`);
  }
});
app.post("/players/", async (request, response) => {
  try {
    console.log(request.body);
    const playerDetails = request.body;
    const { playerName, jerseyNumber, role } = playerDetails;
    console.log(playerName, jerseyNumber, role);

    const createPlayersQuery = `insert into 
    cricket_team 
    (
    
        player_name,
        jersey_number,
        role
    ) 
    values
    (
    
      '${playerName}',
      ${jerseyNumber},
      '${role}'
    );`;

    await db.run(createPlayersQuery);
    response.send(`Player Added to Team`);
  } catch (error) {
    console.log(error);
  }
});

app.put("/players/:playerId", async (request, response) => {
  try {
    console.log(request.body);
    const { playerId } = request.params;
    const playerDetails = request.body;
    const { playerName, jerseyNumber, role } = playerDetails;
    console.log(playerName, jerseyNumber, role);
    const updatePlayerQuery = `update
    cricket_team 
    set
        player_name='${playerName}',
        jersey_number=${jerseyNumber},
        role='${role}'
    where player_id = ${playerId};`;
    await db.run(updatePlayerQuery);

    response.send(`Player Details Updated`);
  } catch (error) {
    console.log(error);
  }
});
app.delete("/players/:playerId/", async (request, response) => {
  try {
    const { playerId } = request.params;
    console.log(playerId);
    const getPlayerByIdQuery = `delete from cricket_team 
    where player_id = ${playerId};`;
    await db.run(getPlayerByIdQuery);
    response.send("Player Removed");
  } catch (error) {
    console.log(`${error}`);
  }
});
module.exports = app;
