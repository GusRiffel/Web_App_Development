const PointOfInterest = require("../model/PointOfInterest");

class PointOfInterestDao {
  constructor() {}

  async findPoiByRegion(region) {
    return await PointOfInterest.findAll({
      where: {
        region: region,
      },
    });
  }

  async createPoi(poiToSave) {
    return await PointOfInterest.create({
      name: poiToSave.name,
      type: poiToSave.type,
      country: poiToSave.country,
      region: poiToSave.region,
      lat: poiToSave.lat,
      lon: poiToSave.lon,
      description: poiToSave.description,
      recommendations: 0,
    });
  }

  async updatePoiDetails(poi) {
    return await PointOfInterest.update(
      {
        name: poi.name,
        type: poi.type,
        country: poi.country,
        region: poi.region,
        lon: poi.lon,
        lat: poi.lat,
        description: poi.description,
        recommendations: poi.recommendations,
      },
      {
        where: {
          id: poi.id,
        },
      }
    );
  }

  async updatePoiRecommendation(poiId) {
    return await PointOfInterest.increment(
      { recommendations: 1 },
      { where: { id: poiId } }
    );
  }
}

module.exports = PointOfInterestDao;
