const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controlers/productController');



router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);      // vytvořit produkt
router.put('/:id', updateProduct);   // upravit produkt
router.delete('/:id', deleteProduct); // smazat produkt

module.exports = router;