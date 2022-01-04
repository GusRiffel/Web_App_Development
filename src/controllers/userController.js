const userDao = require("../repository/UserDao");

class UserController {
  constructor() {
    this.dao = new userDao();
  }

  async createUser(req, res) {
    try {
      const isValid = Object.values(req.body).every(
        (detail) => detail !== null && detail !== ""
      );
      if (!isValid) {
        res.status(500).json({ error: "Please complete all fields" });
        return;
      }
      const userBody = await this.dao.createUser(req.body);
      res.json({ userBody });
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }

  async findUserById(userId) {
    try {
      return await this.dao.findById(userId);
    } catch (e) {
      return null;
    }
  }
}

module.exports = UserController;
