import nodemailer from "nodemailer";
import { primaryFrontendUrl } from "../config/env.js";

let transporter = null;

// Created lazily so the server can start even when email credentials are missing
const getTransporter = () => {
  if (transporter) return transporter;

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("EMAIL_USER and EMAIL_PASS must be set in environment variables");
  }

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
  });

  return transporter;
};

const getFrontendUrl = primaryFrontendUrl;

const getEmailTemplate = (content) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; background: #f8fafc; margin: 0; }
      .container { max-width: 600px; margin: 0 auto; padding: 32px 24px; background: #ffffff; }
      .brand { font-size: 20px; font-weight: 700; color: #4f46e5; margin-bottom: 24px; }
      .button { display: inline-block; padding: 12px 24px; background: #4f46e5; color: #ffffff !important; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: 600; }
      .footer { margin-top: 32px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="brand">InternConnect</div>
      ${content}
      <div class="footer">
        <p>This is an automated email from InternConnect. Please do not reply to this email.</p>
        <p>&copy; ${new Date().getFullYear()} InternConnect. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
`;

const sendMail = async ({ to, subject, html, text }) => {
  const info = await getTransporter().sendMail({
    from: `"InternConnect" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: getEmailTemplate(html),
    text,
  });
  return { success: true, messageId: info.messageId };
};

const assertUser = (user) => {
  if (!user || !user.email || !user.name) {
    throw new Error("Invalid user object: email and name are required");
  }
};

// =======================
// SEND VERIFICATION EMAIL
// =======================
export const sendVerificationEmail = async (user, token) => {
  try {
    assertUser(user);
    if (!token) throw new Error("Verification token is required");

    const verificationLink = `${getFrontendUrl()}/verify-email/${token}`;

    const result = await sendMail({
      to: user.email,
      subject: "Verify your email for InternConnect",
      html: `
        <h2>Hello ${user.name},</h2>
        <p>Thank you for registering on InternConnect! We're excited to have you join our community.</p>
        <p>Please verify your email address by clicking the button below:</p>
        <a href="${verificationLink}" class="button">Verify Email Address</a>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #4f46e5;">${verificationLink}</p>
        <p><strong>Important:</strong> This link will expire in 30 minutes for security reasons.</p>
        <p>If you didn't create an account with InternConnect, please ignore this email.</p>
      `,
      text: `Hello ${user.name},\n\nThank you for registering on InternConnect. Please verify your email by visiting: ${verificationLink}\n\nThis link will expire in 30 minutes.`,
    });

    console.log(`✅ Verification email sent to ${user.email}`);
    return result;
  } catch (error) {
    console.error("❌ Failed to send verification email:", error.message);
    throw new Error(`Email sending failed: ${error.message}`);
  }
};

// =======================
// SEND PASSWORD RESET EMAIL
// =======================
export const sendPasswordResetEmail = async (user, token) => {
  try {
    assertUser(user);
    if (!token) throw new Error("Reset token is required");

    const resetLink = `${getFrontendUrl()}/reset-password/${token}`;

    const result = await sendMail({
      to: user.email,
      subject: "Reset your password for InternConnect",
      html: `
        <h2>Hello ${user.name},</h2>
        <p>We received a request to reset your password for your InternConnect account.</p>
        <p>Click the button below to reset your password:</p>
        <a href="${resetLink}" class="button">Reset Password</a>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #4f46e5;">${resetLink}</p>
        <p><strong>Security Notice:</strong></p>
        <ul>
          <li>This link will expire in 1 hour</li>
          <li>If you didn't request a password reset, please ignore this email</li>
          <li>Your password will remain unchanged unless you use this link</li>
        </ul>
      `,
      text: `Hello ${user.name},\n\nYou requested a password reset. Visit this link to reset your password: ${resetLink}\n\nIf you didn't request this, you can ignore this email. This link expires in 1 hour.`,
    });

    console.log(`✅ Password reset email sent to ${user.email}`);
    return result;
  } catch (error) {
    console.error("❌ Failed to send password reset email:", error.message);
    throw new Error(`Email sending failed: ${error.message}`);
  }
};

// =======================
// SEND WELCOME EMAIL
// =======================
export const sendWelcomeEmail = async (user) => {
  try {
    assertUser(user);
    const frontendUrl = getFrontendUrl();

    const result = await sendMail({
      to: user.email,
      subject: "Welcome to InternConnect!",
      html: `
        <h2>Welcome to InternConnect, ${user.name}! 🎉</h2>
        <p>Your email has been verified successfully. You're all set to start your journey with us!</p>
        <h3>What's next?</h3>
        <ul>
          <li>Complete your profile to stand out</li>
          <li>Browse available internship opportunities</li>
          <li>Connect with companies and mentors</li>
        </ul>
        <a href="${frontendUrl}/login" class="button">Sign In</a>
      `,
      text: `Welcome to InternConnect, ${user.name}! Your email has been verified successfully. Visit ${frontendUrl}/login to get started.`,
    });

    console.log(`✅ Welcome email sent to ${user.email}`);
    return result;
  } catch (error) {
    console.error("❌ Failed to send welcome email:", error.message);
    throw new Error(`Email sending failed: ${error.message}`);
  }
};

// =======================
// GRACEFUL SHUTDOWN
// =======================
export const closeTransporter = () => {
  if (transporter) {
    transporter.close();
    transporter = null;
    console.log("✅ Email transporter closed");
  }
};
