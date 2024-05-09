
const twilio = require('twilio');

// Initialize Twilio Client
const accountSid = 'your-twilio-account-sid';
const authToken = 'your-twilio-auth-token';
const client = new twilio(accountSid, authToken);

async function sendOTPSMS(mobileNumber, otp) {
  const message = `Your OTP for password reset is: ${otp}`;

  try {
    await client.messages.create({
      body: message,
      to: `+91${mobileNumber}`, // Example for Indian phone number, change accordingly
      from: 'your-twilio-phone-number',
    });
    console.log(`OTP SMS sent to ${mobileNumber}`);
  } catch (error) {
    console.error(`Failed to send OTP SMS: ${error.message}`);
  }
}

module.exports = sendOTPSMS;
