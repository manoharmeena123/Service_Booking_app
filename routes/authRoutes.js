// routes/authRoutes.js
const express = require('express');
const { forgotPassword, resetPassword } = require('../controllers/authController');

const authRouter = express.Router();

authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password', resetPassword);

module.exports = { authRouter };
