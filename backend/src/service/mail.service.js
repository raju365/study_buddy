/*
 * -------------------------------------------------------
 * File : mail.service.js
 * Description : Sends transactional emails (password
 *               reset) via Nodemailer
 * Author : Raju Barman
 * -------------------------------------------------------
 */

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendResetPasswordEmail(to, resetUrl) {
  try {
    console.log("📧 Sending reset email...");
    console.log("To:", to);

    const info = await transporter.sendMail({
      from: `"Study Buddy" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Reset your Study Buddy password",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
          <h2 style="color: #6D5FE0;">Reset your password</h2>

          <p>
            You requested a password reset. Click the button below —
            this link expires in 15 minutes.
          </p>

          <a
            href="${resetUrl}"
            style="
              display:inline-block;
              background:#6D5FE0;
              color:white;
              padding:10px 20px;
              border-radius:8px;
              text-decoration:none;
              margin-top:10px;
            "
          >
            Reset Password
          </a>

          <p style="color:#888; font-size:13px; margin-top:20px;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    console.log("✅ Email sent successfully");


    return info;
  } catch (error) {
    console.error("❌ Email send failed:");
    console.error(error);

    throw error;
  }
}

module.exports = { sendResetPasswordEmail };