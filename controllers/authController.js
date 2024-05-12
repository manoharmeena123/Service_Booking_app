
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const otpModel = require('../models/otpModel');
const generateOTP = require('../utils/otpHelper');
const sendOTPEmail = require('../utils/emailService');
const sendOTPSMS = require("../utils/smsService")
const SessionStorage = require('../utils/SessionStorage');

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found or not registered' });
        }

        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // OTP valid for 15 minutes

        await otpModel.findOneAndUpdate({ email }, { email, otp, otpExpiry, mobileNumber: user.mobileNumber }, { upsert: true });

        await sendOTPEmail(email, otp);
        await sendOTPSMS(user.mobileNumber, otp);

        // Save userId in session storage
        SessionStorage.setUserSession(req.sessionID, user._id.toString());

        res.status(200).json({ message: 'OTP sent to email and mobile number' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const resetPassword = async (req, res) => {
    try {
        const { password } = req.body;
        const sessionData = SessionStorage.getUserSession(req.sessionID);

        if (!sessionData || !sessionData.userId) {
            return res.status(400).json({ error: 'User verification failed or session expired' });
        }

        const user = await userModel.findById(sessionData.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.password = await bcrypt.hash(password, 5);
        await user.save();

        // Clear session data after password reset
        SessionStorage.clearUserSession(req.sessionID);

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
        res.status(200).json({ message: 'OTP sent to mobile number' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { forgotPassword, resetPassword, verifyOTP, mobileOtp };

