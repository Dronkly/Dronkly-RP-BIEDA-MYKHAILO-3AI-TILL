const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  addPaymentMethod,
  deletePaymentMethod,
  getAllUsers,
  getAdminUserDetail,
  updateAdminUser,
  addDiscountToUser

} = require('../controlers/profileController');


router.get('/admin/users', getAllUsers);
router.get('/admin/users/:id', getAdminUserDetail);
router.put('/admin/users/:id', updateAdminUser);
router.get('/:email', getProfile);
router.put('/:email', updateProfile);
router.post('/:email/payment-methods', addPaymentMethod);
router.post("/admin/users/:id/discounts", addDiscountToUser);
router.delete('/:email/payment-methods/:methodId', deletePaymentMethod);


module.exports = router;