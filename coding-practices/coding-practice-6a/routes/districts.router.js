const express = require("express");
const path = require("path");
const districtsRouter = express.Router();
const districtsController = require(`${path.join(
  __dirname,
  "..",
  "controllers",
  "districts.controller.js"
)}`);

districtsRouter.get(
  "/:districtId/details/",
  districtsController.getStateNameByDistrictId
);
districtsRouter.get("/:districtId/", districtsController.getDistrictById);
districtsRouter.post("/districts/", districtsController.insertADistrict);
districtsRouter.put("/:districtId/", districtsController.updateDistrict);
districtsRouter.delete("/:districtId/", districtsController.deleteDistrict);

module.exports = districtsRouter;
