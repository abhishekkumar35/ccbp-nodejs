const express = require("express");
const path = require("path");
const statesRouter = express.Router();
const statesController = require(path.join(__dirname, "states.controller"));

statesRouter.get("/", statesController.getAllStates);
statesRouter.get("/:stateId/", statesController.getStateById);
statesRouter.get("/:stateId/stats/", statesController.getStatsByState);

module.exports = statesRouter;
