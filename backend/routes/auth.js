const express = require('express');
const router = express.Router();
const { registerUser } = require('../controlers/auth');

router.post('/verify-code', verifyCode);
router.post('/register', registerUser);

module.exports = router;