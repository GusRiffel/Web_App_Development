const User = require("../model/User");

class UserDao {
  constructor() {}

  async createUser(userBody) {
    return await User.create({
      username: userBody.username,
      password: userBody.password,
    });
  }

  async login(username) {
    return await User.findAll({
      where: {
        username: username,
      },
    });
  }

  async findById(userId) {
    return await User.findById(userId);
  }
}

module.exports = UserDao;
