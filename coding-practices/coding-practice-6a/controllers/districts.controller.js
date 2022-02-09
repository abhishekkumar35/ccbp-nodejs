const path = require("path")
const dbModulePath =  path.join(__dirname,"..","dbServer");
const  {
    db,
    PORT,
    initializeServerAndDatabase
} = require(dbModulePath);


async function getDistrictById(request, response) {
  try {
    const { districtId } = request.params;

    const districtQ = `select * from district
     where
      district_id = ${districtId};`;
    const dbResponse = await db.database.get(districtQ);
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
}

async function getStateNameByDistrictId(request, response) {
  try {
    const { districtId } = request.params;
    const districtQ = `select state_name from state natural join
     district where
      district_id = ${districtId};`;
    const dbResponse = await db.database.get(districtQ);
    response.send({ stateName: dbResponse.state_name });
  } catch (error) {
    console.log(error);
  }
}

async function insertADistrict(request, response) {
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
    await db.database.database.run(districtQ);
    response.send("District Successfully Added");
  } catch (error) {
    console.log(error);
  }
}

async function updateDistrict(request, response) {
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
    await db.database.run(districtQ);
    response.send("District Details Updated");
  } catch (error) {
    console.log(error);
  }
}

async function deleteDistrict(request, response) {
  try {
    const { districtId } = request.params;
    const deleteQ = `delete from district where 
      district_id = ${districtId}`;
    await db.database.run(deleteQ);
    response.send("District Removed");
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getDistrictById,
  getStateNameByDistrictId,
  insertADistrict,
  updateDistrict,
  deleteDistrict,
};
