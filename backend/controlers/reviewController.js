const Review = require("../models/Review");

const getPublicReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ isApproved: true })
      .populate("user", "name surname email")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Nepodařilo se načíst recenze." });
  }
};

const getAllReviewsAdmin = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name surname email")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Nepodařilo se načíst recenze." });
  }
};

const createReview = async (req, res) => {
  try {
    const { userId, rating, text } = req.body;

    if (!userId || !rating || !text) {
      return res.status(400).json({
        message: "Chybí uživatel, hodnocení nebo text recenze.",
      });
    }

    await Review.create({
      user: userId,
      rating,
      text,
      isApproved: false,
    });

    res.status(201).json({
      message: "Recenze byla odeslána. Po schválení se zobrazí.",
    });
  } catch (error) {
    res.status(500).json({ message: "Nepodařilo se odeslat recenzi." });
  }
};

const updateReviewAdmin = async (req, res) => {
  try {
    const { rating, text, isApproved } = req.body;

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { rating, text, isApproved },
      { new: true, runValidators: true }
    ).populate("user", "name surname email");

    if (!review) {
      return res.status(404).json({ message: "Recenze nebyla nalezena." });
    }

    res.status(200).json({
      message: "Recenze byla upravena.",
      review,
    });
  } catch (error) {
    res.status(500).json({ message: "Nepodařilo se upravit recenzi." });
  }
};

const deleteReviewAdmin = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Recenze nebyla nalezena." });
    }

    res.status(200).json({ message: "Recenze byla smazána." });
  } catch (error) {
    res.status(500).json({ message: "Nepodařilo se smazat recenzi." });
  }
};

module.exports = {
  getPublicReviews,
  getAllReviewsAdmin,
  createReview,
  updateReviewAdmin,
  deleteReviewAdmin,
};