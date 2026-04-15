const express = require('express');
const router = express.Router();
const { registerUser, verifyCode, loginUser  } = require('../controlers/auth');

router.post('/verify-code', verifyCode);
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;