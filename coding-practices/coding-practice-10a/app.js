const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "covid19IndiaPortal.db");
let db = null;
const PORT = 3000;
const SECRET_KEY = "XZ0428u5804W*&^392IH2D";

const initDBAndServer = async () => {
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
  console.log(`Database connected...!`);
  app.listen(PORT, (error) => {
    if (error) {
      console.log(`error: ${error}`);
    } else {
      console.log(`Listening server at http://localhost:${PORT}`);
    }
  });
};
initDBAndServer();

const authenticateUser = (request, response, next) => {
  const authHeader = request.header("authorization");
  let jwtToken;
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (jwtToken === undefined) {
    response.status(401);
    response.send("Invalid JWT Token");
  } else {
    jwt.verify(jwtToken, SECRET_KEY, async (error, payload) => {
      if (error) {
        response.status(401);
        response.send("Invalid JWT Token");
      } else {
        next();
      }
    });
  }
};

app.post("/login", async (request, response) => {
  const { username, password } = request.body;
  const sqlQ = `select * from user where username = '${username}';`;
  const dbUser = await db.get(sqlQ);
  if (dbUser === undefined) {
    response.status(400);
    response.send("Invalid user");
  } else {
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
    if (!isPasswordMatched) {
      response.status(400);
      response.send("Invalid password");
    } else {
      const jwtToken = jwt.sign({ username }, SECRET_KEY);
      response.status(200);
      response.send({ jwtToken });
    }
  }
});

app.get("/states/", authenticateUser, async (request, response) => {
  try {
    const sqlQ = "select * from state";
    const dbResponse = await db.all(sqlQ);

    response.send(
      dbResponse.map((state) => {
        return {
          stateId: state.state_id,
          stateName: state.state_name,
          population: state.population,
        };
      })
    );
  } catch (error) {
    console.log(error);
  }
});

app.get("/states/:stateId", authenticateUser, async (request, response) => {
  try {
    const { stateId } = request.params;
    const sqlQ = `select * from state where state_id = ${stateId}`;
    const dbResponse = await db.get(sqlQ);
    const state = dbResponse;
    response.send({
      stateId: state.state_id,
      stateName: state.state_name,
      population: state.population,
    });
  } catch (error) {
    console.log(error);
  }
});

app.get(
  "/districts/:districtId",
  authenticateUser,
  async (request, response) => {
    try {
      const { districtId } = request.params;
      const sqlQ = `select * from district where district_id = ${districtId}`;
      const dbResponse = await db.get(sqlQ);
      const district = dbResponse;
      response.send({
        districtId: district.district_id,
        districtName: district.district_name,
        stateId: district.state_id,
        cases: district.cases,
        cured: district.cured,
        active: district.active,
        deaths: district.deaths,
      });
    } catch (error) {
      console.log(error);
    }
  }
);

app.delete(
  "/districts/:districtId",
  authenticateUser,
  async (request, response) => {
    try {
      const { districtId } = request.params;
      const sqlQ = `delete from district
     where district_id = ${districtId}`;
      await db.run(sqlQ);
      response.send(`District Removed`);
    } catch (error) {
      console.log(error);
    }
  }
);

app.get(
  "/states/:stateId/stats",
  authenticateUser,
  async (request, response) => {
    try {
      const { stateId } = request.params;
      const sqlQ = `select 
    sum(cases) as totalCases,
    sum(cured) as totalCured,
    sum(active) as totalActive,
    sum(deaths) as totalDeaths
    from district where state_id = ${stateId}`;
      const dbResponse = await db.get(sqlQ);
      const state = dbResponse;
      response.send(dbResponse);
    } catch (error) {
      console.log(error);
    }
  }
);

app.post("/districts/", authenticateUser, async (request, response) => {
  try {
    const {
      districtName,
      stateId,
      cases,
      cured,
      active,
      deaths,
    } = request.body;
    const sqlQ = `insert into district
     (district_name,state_id,cases,cured,active,deaths) 
    values ('${districtName}',${stateId},${cases},${cured},
        ${active},${deaths});
        `;
    await db.run(sqlQ);
    response.send("District Successfully Added");
  } catch (error) {
    console.log(error);
  }
});
app.put(
  "/districts/:districtId",
  authenticateUser,
  async (request, response) => {
    try {
      const { districtId } = request.params;
      const {
        districtName,
        stateId,
        cases,
        cured,
        active,
        deaths,
      } = request.body;
      const sqlQ = `update district set 
        district_name= '${districtName}',
        state_id= ${stateId},
        cases = ${cases},
        cured=${cured},
        active=${active},
        deaths=${deaths}
        where district_id = ${districtId};
        `;
      await db.run(sqlQ);
      response.send("District Details Updated");
    } catch (error) {
      console.log(error);
    }
  }
);
module.exports = app;
