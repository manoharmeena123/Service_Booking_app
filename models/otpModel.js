
const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  otpExpiry: {
    type: Date,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('OTP', otpSchema);
