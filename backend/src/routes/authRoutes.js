const { registerUser, loginUser, googleLogin, resetPassword } = require('../controllers/authController');
const express = require('express');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/reset-password', resetPassword);
router.post('/google-login', googleLogin);

module.exports = router;