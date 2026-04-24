const express = require('express');
const router = express.Router();
const { registerUser, verifyCode, loginUser, checkEmailAvailability, forgotPassword, resetPassword, } = require('../controlers/auth');

router.post('/verify-code', verifyCode);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/check-email', checkEmailAvailability);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;