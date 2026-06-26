const { sendOTP, verifyOTP } = require('../controllers/otpController');
const express = require('express');
const router = express.Router();
router.post('/send', sendOTP);
router.post('/verify', verifyOTP);
module.exports = router;