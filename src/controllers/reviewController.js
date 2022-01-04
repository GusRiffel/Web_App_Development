const reviewDao = require("../repository/ReviewDao");

class ReviewController {
  constructor() {
    this.dao = new reviewDao();
  }

  async createReview(req, res) {
    const reviewBody = req.body;
    const userSession = req.user;
    const isValid = Object.values(reviewBody).every(
      (detail) => detail !== null && detail !== ""
    );

    if (!userSession) {
      res
        .status(401)
        .json({ error: "You need to be logged in to complete this action." });
      return;
    }
    if (!isValid) {
      res.status(400).json({ error: "Review cannot be empty." });
      return;
    }
    try {
      const reviewCreated = await this.dao.createReview(reviewBody);
      res.json({ reviewCreated });
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }
}

module.exports = ReviewController;
