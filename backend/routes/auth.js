const express = require('express');
const router = express.Router();
const { registerUser, verifyCode, loginUser, checkEmailAvailability  } = require('../controlers/auth');

router.post('/verify-code', verifyCode);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/check-email', checkEmailAvailability);

module.exports = router;