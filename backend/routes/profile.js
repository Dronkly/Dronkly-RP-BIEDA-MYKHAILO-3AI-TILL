const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  addPaymentMethod,
  deletePaymentMethod
} = require('../controlers/profileController');



router.get('/:email', getProfile);
router.put('/:email', updateProfile);
router.post('/:email/payment-methods', addPaymentMethod);
router.delete('/:email/payment-methods/:methodId', deletePaymentMethod);

module.exports = router;