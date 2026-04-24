const express = require("express");
const router = express.Router();

const {
  getPublicReviews,
  getAllReviewsAdmin,
  createReview,
  updateReviewAdmin,
  deleteReviewAdmin,
} = require("../controlers/reviewController");

router.get("/", getPublicReviews);
router.post("/", createReview);

router.get("/admin/all", getAllReviewsAdmin);
router.put("/admin/:id", updateReviewAdmin);
router.delete("/admin/:id", deleteReviewAdmin);

module.exports = router;