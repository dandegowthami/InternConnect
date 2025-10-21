// controllers/authController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import crypto from "crypto";
import { sendVerificationEmail, sendPasswordResetEmail } from "../utils/email.js";

// =======================
// REGISTER USER + EMAIL VERIFICATION
// =======================
export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const emailToken = crypto.randomBytes(20).toString("hex");

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "student",
      emailVerified: false,
      emailVerificationToken: emailToken,
      emailVerificationExpires: Date.now() + 30 * 60 * 1000, // 30 min
    });

    try {
      await sendVerificationEmail(user, emailToken);
    } catch (emailError) {
      await User.findByIdAndDelete(user._id);
      console.error("Failed to send verification email:", emailError);
      return res
        .status(500)
        .json({ message: "Failed to send verification email. Please try again." });
    }

    res.status(201).json({
      message:
        "Registration successful! Please verify your email to activate your account.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// =======================
// VERIFY EMAIL
// =======================
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.send(`
        <html>
          <head>
            <title>Verification Failed</title>
            <style>
              body { font-family: Arial; text-align: center; margin-top: 100px; }
              h2 { color: red; }
              a { text-decoration: none; color: #4a90e2; font-size: 16px; }
            </style>
          </head>
          <body>
            <h2>❌ Verification Failed</h2>
            <p>The verification link is invalid or expired.</p>
            <a href="http://localhost:5173/register">Go Back</a>
          </body>
        </html>
      `);
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return res.redirect("http://localhost:5173/login?verified=true");
  } catch (err) {
    console.error("Email verification error:", err);
    res.send(`
      <html>
        <head>
          <title>Server Error</title>
          <style>
            body { font-family: Arial; text-align: center; margin-top: 100px; }
            h2 { color: red; }
            a { text-decoration: none; color: #4a90e2; font-size: 16px; }
          </style>
        </head>
        <body>
          <h2>⚠️ Something went wrong</h2>
          <p>Please try again later.</p>
          <a href="http://localhost:5173/">Go to Home</a>
        </body>
      </html>
    `);
  }
};

// =======================
// LOGIN USER
// =======================
export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ message: "User not found" });

    if (!user.emailVerified)
      return res.status(403).json({ message: "Please verify your email first" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ Updated response format
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// =======================
// FORGOT PASSWORD
// =======================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.emailVerified)
      return res.status(403).json({ message: "Email not verified" });

    // --------------------------
    // Generate reset token
    // --------------------------
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    // You can remove expiration if you don't want a time limit
    // user.resetPasswordExpires = Date.now() + 3600000; // optional
    await user.save();

    // Send reset email
    await sendPasswordResetEmail(user, resetToken);

    res.json({ message: "Password reset email sent" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// =======================
// RESET PASSWORD
// =======================
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Find user by token only, ignore expiration
    const user = await User.findOne({
      resetPasswordToken: token
    });

    if (!user) return res.status(400).json({ message: "Invalid reset token" });

    // Update password
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined; // clear token
    user.resetPasswordExpires = undefined; // optional
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// =======================
// GET CURRENT USER
// =======================
export const getMe = async (req, res) => {
  try {
    // req.user is set by the protect middleware
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (error) {
    console.error("GetMe error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
