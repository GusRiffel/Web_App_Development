const { DataTypes, Model } = require("sequelize");
const sequelize = require("../mysqlConnection");

class Review extends Model {}

Review.init(
  {
    poi_id: {
      type: DataTypes.INTEGER,
    },
    review: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "Review",
    tableName: "poi_reviews",
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Review;
