const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendOTPEmail(to, otp) {
  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}`,
    };

    let info = await transporter.sendMail(mailOptions);
    console.log(`OTP Email sent: ${info.response}`);
    return { success: true, message: 'Email sent successfully', info };
  } catch (error) {
    console.error(`Failed to send OTP Email: ${error.message}`);
    return { success: false, message: 'Failed to send email', error };
  }
}

module.exports = sendOTPEmail;
