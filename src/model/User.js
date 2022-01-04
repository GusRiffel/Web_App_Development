const { DataTypes, Model } = require("sequelize");
const sequelize = require("../mysqlConnection");
const passportLocalSequelize = require("passport-local-sequelize");

class User extends Model {}

User.init(
  {
    username: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "poi_users",
    freezeTableName: true,
    timestamps: false,
  }
);

passportLocalSequelize.attachToUser(User, {
  sequelize,
  modelName: "User",
  tableName: "poi_users",
  freezeTableName: true,
  timestamps: false,
});

module.exports = User;
