const twilio = require('twilio');
require('dotenv').config();

// Initialize Twilio Client
const accountSid = process.env.TWILLIO_SID;
const authToken = process.env.TWILLIO_TOKEN;
const client = new twilio(accountSid, authToken);

const sendOTPSMS = async (mobileNumber, otp) => {
  const message = `Your OTP for password reset is: ${otp}`;
  console.log("mb", mobileNumber, otp);

  try {
    await client.messages.create({
      body: message,
      to: `+91${mobileNumber}`, // Example for Indian phone number, change accordingly
      from: process.env.TWILLIO_NUMBER,
    });
    console.log(`OTP SMS sent to ${mobileNumber}`);
  } catch (error) {
    console.error(`Failed to send OTP SMS: ${error.message}`);
  }
};

module.exports = sendOTPSMS;
