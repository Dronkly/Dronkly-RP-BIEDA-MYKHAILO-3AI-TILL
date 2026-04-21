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

const createProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      image,
      category,
      material,
      stock,
    } = req.body;

    if (!name || !slug || !price || !image) {
      return res.status(400).json({ message: 'Vyplň povinná pole produktu.' });
    }

    const existingProduct = await Product.findOne({ slug });

    if (existingProduct) {
      return res.status(409).json({ message: 'Produkt s tímto slugem už existuje.' });
    }

    const product = await Product.create({
      name,
      slug,
      description,
      price,
      image,
      category,
      material,
      stock,
    });

    res.status(201).json({
      message: 'Produkt byl úspěšně vytvořen.',
      product,
    });
  } catch (error) {
    console.error('CREATE PRODUCT ERROR:', error);
    res.status(500).json({ message: 'Chyba při vytváření produktu.' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      image,
      category,
      material,
      stock,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Produkt nebyl nalezen.' });
    }

    product.name = name;
    product.slug = slug;
    product.description = description;
    product.price = price;
    product.image = image;
    product.category = category;
    product.material = material;
    product.stock = stock;

    await product.save();

    res.status(200).json({
      message: 'Produkt byl úspěšně upraven.',
      product,
    });
  } catch (error) {
    console.error('UPDATE PRODUCT ERROR:', error);
    res.status(500).json({ message: 'Chyba při úpravě produktu.' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Produkt nebyl nalezen.' });
    }

    res.status(200).json({ message: 'Produkt byl úspěšně smazán.' });
  } catch (error) {
    console.error('DELETE PRODUCT ERROR:', error);
    res.status(500).json({ message: 'Chyba při mazání produktu.' });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};