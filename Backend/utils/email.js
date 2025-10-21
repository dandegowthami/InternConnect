import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// =======================
// SEND VERIFICATION EMAIL
// =======================
export const sendVerificationEmail = async (user, token) => {
  try {
    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
    const verificationLink = `${FRONTEND_URL}/verify-email/${token}`;

    const mailOptions = {
      from: `"InternConnect" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Verify your email for InternConnect",
      html: `
        <h2>Hello ${user.name},</h2>
        <p>Thank you for registering on InternConnect. Please verify your email by clicking the link below:</p>
        <a href="${verificationLink}" target="_blank" style="display:inline-block;padding:10px 20px;background:#6c63ff;color:white;text-decoration:none;border-radius:5px;">Verify Email</a>
        <p>This link will expire in 30 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${user.email}`);
  } catch (error) {
    console.error("Failed to send verification email:", error);
    throw error;
  }
};

// =======================
// SEND PASSWORD RESET EMAIL
// =======================
export const sendPasswordResetEmail = async (user, token) => {
  try {
    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetLink = `${FRONTEND_URL}/reset-password/${token}`;

    const mailOptions = {
      from: `"InternConnect" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Reset your password for InternConnect",
      html: `
        <h2>Hello ${user.name},</h2>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetLink}" target="_blank" style="display:inline-block;padding:10px 20px;background:#6c63ff;color:white;text-decoration:none;border-radius:5px;">Reset Password</a>
        <p>If you didn't request this, you can ignore this email. This link expires in 1 hour.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${user.email}`);
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    throw error;
  }
};