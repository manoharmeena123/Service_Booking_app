
const nodemailer = require('nodemailer');

async function sendOTPEmail(to, otp) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-email-password',
    },
  });

  let mailOptions = {
    from: 'your-email@gmail.com',
    to,
    subject: 'Password Reset OTP',
    text: `Your OTP for password reset is: ${otp}`,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = sendOTPEmail;
