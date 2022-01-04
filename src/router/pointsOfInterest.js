const express = require("express");
const poiRouter = express.Router();

const connection = require("../mysqlConnection");
const pointOfInterestController = require("../controllers/pointOfInterestController");

const poiController = new pointOfInterestController(connection);

poiRouter.get(
  "/region/:region",
  poiController.findPoiByRegion.bind(poiController)
);

poiRouter.patch(
  "/update-recommendations/:id",
  poiController.updatePoiRecommendation.bind(poiController)
);
poiRouter.put(
  "/update-poi/",
  poiController.updatePoiDetails.bind(poiController)
);
poiRouter.post("/create", poiController.createPoi.bind(poiController));

module.exports = poiRouter;
