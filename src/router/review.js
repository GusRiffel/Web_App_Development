const express = require("express");
const reviewRouter = express.Router();

const connection = require("../mysqlConnection");
const revController = require("../controllers/reviewController");

const reviewController = new revController(connection);

reviewRouter.post(
  "/create",
  reviewController.createReview.bind(reviewController)
);

module.exports = reviewRouter;