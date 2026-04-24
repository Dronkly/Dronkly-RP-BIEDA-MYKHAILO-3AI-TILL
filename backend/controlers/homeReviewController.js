const HomeReview = require("../models/HomeReview");

const getHomeReviews = async (req, res) => {
  try {
    const reviews = await HomeReview.find().sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Nepodařilo se načíst hodnocení." });
  }
};

const getAllHomeReviewsAdmin = async (req, res) => {
  try {
    const reviews = await HomeReview.find().sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Nepodařilo se načíst hodnocení." });
  }
};

const createHomeReview = async (req, res) => {
  try {
    const { name, role, rating, text, image } = req.body;

    if (!name || !text || !rating) {
      return res.status(400).json({ message: "Vyplň jméno, text a hodnocení." });
    }

    const review = await HomeReview.create({
      name,
      role,
      rating,
      text,
      image,
    });

    res.status(201).json({
      message: "Hodnocení bylo přidáno.",
      review,
    });
  } catch (error) {
    console.error("CREATE HOME REVIEW ERROR:", error);
    res.status(500).json({ message: "Chyba při přidávání hodnocení." });
  }
};

const deleteHomeReview = async (req, res) => {
  try {
    await HomeReview.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Hodnocení bylo smazáno." });
  } catch (error) {
    res.status(500).json({ message: "Nepodařilo se smazat hodnocení." });
  }
};

module.exports = {
  getHomeReviews,
  getAllHomeReviewsAdmin,
  createHomeReview,
  deleteHomeReview,
};