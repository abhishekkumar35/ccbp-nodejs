const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json()); // express json parser
const dbPath = path.join(__dirname, "covid19India.db");
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

app.get("/states/", async (request, response) => {
  try {
    const statesQ = `select * from state;`;
    const dbResponse = await db.all(statesQ);

    response.send(
      dbResponse.map((e) => {
        return {
          stateId: e.state_id,
          stateName: e.state_name,
          population: e.population,
        };
      })
    );
  } catch (error) {
    console.log(error);
  }
});

app.get("/states/:stateId/", async (request, response) => {
  try {
    const { stateId } = request.params;
    const statesQ = `select * from state where
      state_id = ${stateId};`;
    const dbResponse = await db.get(statesQ);

    response.send({
      stateId: dbResponse.state_id,
      stateName: dbResponse.state_name,
      population: dbResponse.population,
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/districts/:districtId/", async (request, response) => {
  try {
    const { districtId } = request.params;

    const districtQ = `select * from district
     where
      district_id = ${districtId};`;
    const dbResponse = await db.get(districtQ);
    const e = dbResponse;
    response.send({
      districtId: e.district_id,
      districtName: e.district_name,
      stateId: e.state_id,
      cases: e.cases,
      cured: e.cured,
      active: e.active,
      deaths: e.deaths,
    });
  } catch (error) {
    console.log(error);
  }
});
//
app.get("/states/:stateId/stats/", async (request, response) => {
  try {
    const { stateId } = request.params;
    const statesQ = `select
      sum(cases) as totalCases,
      sum(cured) as totalCured,
      sum(active) as totalActive,
      sum(deaths) as totalDeaths
     from district 
     where state_id = ${stateId};
     `;
    const dbResponse = await db.get(statesQ);

    const e = dbResponse;
    response.send(dbResponse);
  } catch (error) {
    console.log(error);
  }
});
//'/districts/2/details/
app.get("/districts/:districtId/details/", async (request, response) => {
  try {
    const { districtId } = request.params;
    const districtQ = `select state_name from state natural join
     district where
      district_id = ${districtId};`;
    const dbResponse = await db.get(districtQ);
    response.send({ stateName: dbResponse.state_name });
  } catch (error) {
    console.log(error);
  }
});

app.post("/districts/", async (request, response) => {
  try {
    const districtDetails = request.body;
    const {
      districtName,
      stateId,
      cases,
      cured,
      active,
      deaths,
    } = districtDetails;
    const districtQ = `insert into district 
   (district_name,state_id,cases,cured,active,deaths) values
   ('${districtName}',${stateId},${cases},${cured},${active},${deaths});`;
    await db.run(districtQ);
    response.send("District Successfully Added");
  } catch (error) {
    console.log(error);
  }
});
app.put("/districts/:districtId/", async (request, response) => {
  try {
    const { districtId } = request.params;
    const districtDetails = request.body;
    const {
      districtName,
      stateId,
      cases,
      cured,
      active,
      deaths,
    } = districtDetails;
    const districtQ = `update  district set
 district_name='${districtName}',state_id=${stateId},cases=${cases},cured=${cured},active=${active},deaths=${deaths}
 where district_id = ${districtId}
   ;`;
    await db.run(districtQ);
    response.send("District Details Updated");
  } catch (error) {
    console.log(error);
  }
});
app.delete("/districts/:districtId/", async (request, response) => {
  try {
    const { districtId } = request.params;
    const deleteQ = `delete from district where 
      district_id = ${districtId}`;
    await db.run(deleteQ);
    response.send("District Removed");
  } catch (error) {
    console.log(error);
  }
});

module.exports = app;
