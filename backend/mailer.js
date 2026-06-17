const nodemailer = require("nodemailer")
require("dotenv").config()

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

async function sendVerificationCode(toEmail, code) {
  await transporter.sendMail({
    from: `"QA Dashboard" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Your QA Dashboard verification code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">QA Dashboard</h2>
        <p>Your verification code is:</p>
        <p style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #1E293B;">${code}</p>
        <p style="color: #64748B; font-size: 13px;">This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
      </div>
    `,
  })
}

module.exports = { sendVerificationCode }