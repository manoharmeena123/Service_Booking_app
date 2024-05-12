
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const otpModel = require('../models/otpModel');
const generateOTP = require('../utils/otpHelper');
const sendOTPEmail = require('../utils/emailService');
const sendOTPSMS = require("../utils/smsService")

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });
        console.log("user", user)
        if (!user) {
            return res.status(404).json({ error: 'User not found or not registered' });
        }

        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // OTP valid for 15 minutes
        console.log(otp, otpExpiry)
        // Save or update OTP for this user
        const existingOtp = await otpModel.findOne({ email });
        if (existingOtp) {
            existingOtp.otp = otp;
            existingOtp.otpExpiry = otpExpiry;
            existingOtp.mobileNumber = user.mobileNumber;
            await existingOtp.save();
        } else {
            const newOtp = new otpModel({ email, otp, otpExpiry, mobileNumber: user?.mobileNumber });
            await newOtp.save();
        }

        await sendOTPEmail(email, otp);
        await sendOTPSMS(user?.mobileNumber, otp)
        // Optionally send OTP via SMS to user.mobileNumber here.
        res.status(200).json({ message: 'OTP sent to email and mobile number', otp });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { password } = req.body; // Only take password from the request body
        const userId = req.user?.userId; // Assume userId is securely set after successful OTP verification

        if (!userId) {
            return res.status(400).json({ error: 'User verification failed or session expired' });
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Hash the new password and save it
        user.password = await bcrypt.hash(password, 5);
        await user.save();

        // Optionally clear any session-related data here if needed

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const verifyOTP = async (req, res) => {
    const { otp } = req.body;
    const otpData = await otpModel.findOne({ otp, otpExpiry: { $gt: new Date() } });

    if (!otpData) {
        return res.status(400).json({ error: 'Invalid OTP or OTP expired' });
    }

    // You can update the OTP record to indicate it has been verified, or handle verification in another way.
    otpData.verified = true;
    await otpData.save();

    res.status(200).json({ message: 'OTP verified successfully' });
};


const mobileOtp = async (req, res) => {
    try {
        const { mobileNumber } = req.body;
        const user = await userModel.findOne({ mobileNumber });
        console.log("user", user)
        if (!user) {
            return res.status(404).json({ error: 'Mobile number not registered' });
        }

        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // OTP valid for 15 minutes
        console.log(otp, otpExpiry)
        // Save or update OTP for this user
        const existingOtp = await otpModel.findOne({ mobileNumber });
        if (existingOtp) {
            existingOtp.otp = otp;
            existingOtp.otpExpiry = otpExpiry;
            await existingOtp.save();
        } else {
            const newOtp = new otpModel({ mobileNumber, otp, otpExpiry });
            await newOtp.save();
        }

        // Optionally send OTP via SMS
        await sendOTPSMS(mobileNumber, otp);
        res.status(200).json({ message: 'OTP sent to mobile number', otp });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { forgotPassword, resetPassword, verifyOTP, mobileOtp };

