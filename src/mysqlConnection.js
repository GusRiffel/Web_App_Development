require("dotenv").config();
const Sequelize = require("sequelize");

const db = new Sequelize(process.env.DB_DBASE, process.env.DB_USERNAME, null, {
  host: process.env.DB_HOST,
  dialect: process.env.DIALECT,
  operatorsAliases: false,
});

db.authenticate()
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

module.exports = db;
