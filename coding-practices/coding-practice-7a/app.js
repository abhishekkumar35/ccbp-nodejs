const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "cricketMatchDetails.db");
let db = null;
const PORT = 3000;
async function initDbAndServer() {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(PORT, (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Server started and Listening at http://localhost:${PORT}`);
      }
    });
  } catch (error) {
    console.log(error);
  }
}
initDbAndServer();
const playerObjects = (player) => {
  return {
    playerId: player.player_id,
    playerName: player.player_name,
  };
};

const matchDetails = (match) => {
  return {
    matchId: match.match_id,
    match: match.match,
    year: match.year,
  };
};

//api 1
app.get("/players", async (request, response) => {
  try {
    const sqlQ = `select * from player_details;`;
    const dbResponse = await db.all(sqlQ);
    response.send(
      dbResponse.map((player) => {
        return playerObjects(player);
      })
    );
  } catch (error) {
    console.log(error);
  }
});
//api 2
app.get("/players/:playerId", async (request, response) => {
  try {
    const { playerId } = request.params;
    const sqlQ = `select * from player_details
     where player_id = ${playerId};`;
    const dbResponse = await db.get(sqlQ);
    response.send(playerObjects(dbResponse));
  } catch (error) {
    console.log(error);
  }
});
//api 3
app.put("/players/:playerId", async (request, response) => {
  try {
    const { playerId } = request.params;
    const { playerName } = request.body;
    const sqlQ = `
    update 
    player_details 
    set 
    player_name = '${playerName}'
     where player_id = ${playerId};`;
    const dbResponse = await db.get(sqlQ);

    response.send("Player Details Updated");
  } catch (error) {
    console.log(error);
  }
});
// api 4
app.get("/matches/:matchId", async (request, response) => {
  try {
    const { matchId } = request.params;
    const sqlQ = `select * from match_details where match_id = ${matchId}`;
    const dbResponse = await db.get(sqlQ);
    response.send(matchDetails(dbResponse));
  } catch (error) {
    console.log(error);
  }
});
// api 5
app.get("/players/:playerId/matches", async (request, response) => {
  try {
    const { playerId } = request.params;
    const sqlQ = `select match_id,match,year from 
       match_details natural join player_match_score
       where player_match_score.player_id = ${playerId};`;
    const dbResponse = await db.all(sqlQ);
    console.log(dbResponse);
    response.send(dbResponse.map((match) => matchDetails(match)));
  } catch (error) {
    console.log(error);
  }
});
//api 6
app.get("/matches/:matchId/players", async (request, response) => {
  try {
    const { matchId } = request.params;
    const sqlQ = `select player_id as playerId,
      player_name as playerName from player_details 
        natural join player_match_score
       where match_id = ${matchId};`;
    const dbResponse = await db.all(sqlQ);
    response.send(dbResponse);
  } catch (error) {
    console.log(error);
  }
});
// api 7
app.get("/players/:playerId/playerScores", async (request, response) => {
  try {
    const { playerId } = request.params;
    const sqlQ = `select player_id as playerId,
    player_name as playerName,
    sum(score) as totalScore,
    sum(fours) as totalFours,
    sum(sixes) as totalSixes
    
    from 
       player_details natural join player_match_score
       where player_details.player_id = ${playerId};`;
    const dbResponse = await db.get(sqlQ);

    response.send(dbResponse);
  } catch (error) {
    console.log(error);
  }
});
module.exports = app;
