const express = require('express');
const router = express.Router();
const { createOrder, getOrdersByUserEmail  } = require('../controlers/orderController');

router.post('/', createOrder);
router.get('/user/:email', getOrdersByUserEmail);

module.exports = router;