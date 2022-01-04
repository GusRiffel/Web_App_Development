const Review = require("../model/Review");

class ReviewDao {
  constructor() {}

  async createReview(reviewBody) {
    return await Review.create({
      poi_id: reviewBody.poi_id,
      review: reviewBody.reviewText,
    });
  }
}

module.exports = ReviewDao;
