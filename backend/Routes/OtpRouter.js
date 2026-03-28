const express = require('express');
const router = express.Router();
const { sendOtp, verifyOtp } = require('../Controllers/OtpController');

router.post('/send', sendOtp);
router.post('/verify', verifyOtp);

module.exports = router;