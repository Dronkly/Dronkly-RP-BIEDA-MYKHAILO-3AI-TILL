const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  addPaymentMethod,
} = require('../controlers/profileController');

router.get('/:email', getProfile);
router.put('/:email', updateProfile);
router.post('/:email/payment-methods', addPaymentMethod);

module.exports = router;