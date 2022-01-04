const { DataTypes, Model } = require("sequelize");
const sequelize = require("../mysqlConnection");

class PointOfInterest extends Model {}

PointOfInterest.init(
  {
    name: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
    country: {
      type: DataTypes.STRING,
    },
    region: {
      type: DataTypes.STRING,
    },
    lat: {
      type: DataTypes.FLOAT,
    },
    lon: {
      type: DataTypes.FLOAT,
    },
    description: {
      type: DataTypes.STRING,
    },
    recommendations: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    modelName: "PointOfInterest",
    tableName: "PointsOfInterest",
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = PointOfInterest;
