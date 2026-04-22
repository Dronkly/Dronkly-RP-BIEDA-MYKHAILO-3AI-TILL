const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrdersByUserEmail,
  getAllOrders,
  updateOrderStatus,
} = require('../controlers/orderController');

router.get('/admin/all', getAllOrders);
router.get('/user/:email', getOrdersByUserEmail);
router.post('/', createOrder);
router.put('/:id/status', updateOrderStatus);

module.exports = router;