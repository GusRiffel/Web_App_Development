const PointOfInterestDao = require("../repository/PointOfInterestDao");

class PointOfInterestController {
  constructor() {
    this.dao = new PointOfInterestDao();
  }

  async findPoiByRegion(req, res) {
    const regionInput = req.params.region;
    try {
      const poiByRegion = await this.dao.findPoiByRegion(regionInput);
      if (poiByRegion === null || poiByRegion.length < 1) {
        res
          .status(404)
          .json({ error: "No points of interest found in this region" });
      } else {
        res.json(poiByRegion);
      }
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }

  async createPoi(req, res) {
    const poiBody = req.body;
    const userSession = req.user;
    const isValid = Object.values(poiBody).every(
      (detail) => detail !== null && detail !== ""
    );

    if (!userSession) {
      res
        .status(401)
        .json({ error: "You need to be logged in to complete this action." });
      return;
    }
    if (!isValid) {
      res.status(400).json({ error: "Please fill in all fields." });
      return;
    }
    try {
      const poiCreated = await this.dao.createPoi(poiBody);
      res.json({ poiCreated });
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }

  async updatePoiDetails(req, res) {
    const poiBody = req.body;
    const userSession = req.user;
    const isValid = Object.values(poiBody).every(
      (detail) => detail !== null && detail !== ""
    );

    if (!userSession) {
      res
        .status(401)
        .json({ error: "You need to be logged in to complete this action." });
      return;
    }
    if (!isValid) {
      res.status(400).json({ error: "Please fill in all fields." });
      return;
    }
    try {
      const poiUpdated = await this.dao.updatePoiDetails(poiBody);
      res.json({ poiUpdated });
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }

  async updatePoiRecommendation(req, res) {
    const poiToUpdateUId = req.params.id;
    try {
      const poiToUpdate = await this.dao.updatePoiRecommendation(
        poiToUpdateUId
      );
      res.json(poiToUpdate);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }
}

module.exports = PointOfInterestController;
