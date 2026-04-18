const Product = require('../models/Product');

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Chyba pri nacitani produktu.' });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Produkt nebyl nalezen.' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Chyba pri nacitani detailu produktu.' });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
};