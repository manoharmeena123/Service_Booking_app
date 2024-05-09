
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const otpModel = require('../models/otpModel');
const generateOTP = require('../utils/otpHelper');
const sendOTPEmail = require('../utils/emailService');

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found or not registered' });
        }

        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // OTP valid for 15 minutes

        // Save or update OTP for this user
        const existingOtp = await otpModel.findOne({ email });
        if (existingOtp) {
            existingOtp.otp = otp;
            existingOtp.otpExpiry = otpExpiry;
            await existingOtp.save();
        } else {
            const newOtp = new otpModel({ email, otp, otpExpiry });
            await newOtp.save();
        }

        await sendOTPEmail(email, otp);
        // Optionally send OTP via SMS to user.mobileNumber here.
        res.status(200).json({ message: 'OTP sent to email and mobile number', otp });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await userModel.findOne({ email });
        const otpData = await otpModel.findOne({ email });

        if (!user || !otpData || otpData.otp !== otp || otpData.otpExpiry < new Date()) {
            return res.status(400).json({ error: 'Invalid OTP or OTP expired' });
        }

        user.password = await bcrypt.hash(newPassword, 5);
        await user.save();

        await otpModel.deleteOne({ email }); // Delete OTP data after successful password reset

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { forgotPassword, resetPassword };
