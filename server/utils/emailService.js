const nodemailer = require("nodemailer");

const sendOtpEmail = async (toEmail, otp) => {
  // Create a test account (FAKE SMTP)
  const testAccount = await nodemailer.createTestAccount();

  // Create transporter using Ethereal SMTP
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  // Send email
  const info = await transporter.sendMail({
    from: '"Inventory App" <no-reply@inventoryapp.com>',
    to: toEmail,
    subject: "Your Password Reset OTP",
    text: `Your OTP is ${otp}. It expires in 10 minutes.`,
  });

  console.log("OTP Email Preview URL: ", nodemailer.getTestMessageUrl(info));
};

module.exports = sendOtpEmail;