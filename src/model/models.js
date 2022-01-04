const UserMeta = require("./User");
const connection = require("../mysqlConnection");

const User = connection.define("users", UserMeta.attributes, UserMeta.options);

User.sync();
module.exports.User = User;
