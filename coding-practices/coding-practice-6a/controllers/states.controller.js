const path = require("path");
const dbModulePath = path.join(__dirname, "..", "dbServer");
const { db, PORT, initializeServerAndDatabase } = require(dbModulePath);

async function getAllStates(request, response) {
  try {
    const statesQ = `select * from state;`;
    const dbResponse = await db.database.all(statesQ);

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
}

async function getStateById(request, response) {
  try {
    const { stateId } = request.params;
    const statesQ = `select * from state where
      state_id = ${stateId};`;
    const dbResponse = await db.database.get(statesQ);

    response.send({
      stateId: dbResponse.state_id,
      stateName: dbResponse.state_name,
      population: dbResponse.population,
    });
  } catch (error) {
    console.log(error);
  }
}

async function getStatsByState(request, response) {
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
    const dbResponse = await db.database.get(statesQ);

    const e = dbResponse;
    response.send(dbResponse);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getAllStates,
  getStateById,
  getStatsByState,
};
