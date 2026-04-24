const express = require("express");
const router = express.Router();

const {
  getHomeReviews,
  getAllHomeReviewsAdmin,
  createHomeReview,
  deleteHomeReview,
} = require("../controlers/homeReviewController");

router.get("/", getHomeReviews);
router.get("/admin/all", getAllHomeReviewsAdmin);
router.post("/", createHomeReview);
router.delete("/:id", deleteHomeReview);

module.exports = router;
