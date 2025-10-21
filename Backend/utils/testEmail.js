// utils/testEmail.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

async function sendTestEmail() {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App password, not Gmail login
      },
    });

    let info = await transporter.sendMail({
      from: `"InternConnect" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // send to yourself for testing
      subject: "Test Email from InternConnect",
      text: "✅ This is a test email. If you got this, email works!",
    });

    console.log("✅ Test email sent successfully:", info.response);
  } catch (err) {
    console.error("❌ Failed to send test email:", err);
  }
}

sendTestEmail();
