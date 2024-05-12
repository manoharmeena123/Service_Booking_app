const express = require('express');
const { forgotPassword, resetPassword, mobileOtp } = require('../controllers/authController');

const authRouter = express.Router();

// Endpoint for handling password recovery via email
authRouter.post('/auth/forgot-password', forgotPassword);

// Endpoint for resetting the password using the OTP received via email
authRouter.post('/auth/reset-password', resetPassword);

// New endpoint for generating OTP via mobile number
authRouter.post('/auth/mobile-otp', mobileOtp);

module.exports = { authRouter };
