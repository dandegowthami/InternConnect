import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendVerificationEmail, sendPasswordResetEmail } from "../utils/email.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;
const SELF_REGISTER_ROLES = ["student", "recruiter"];
const VERIFICATION_TTL = 30 * 60 * 1000; // 30 minutes
const RESET_TTL = 60 * 60 * 1000; // 1 hour

const toPublicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  photo: user.photo,
  resume: user.resume,
});

const normaliseEmail = (value) => value?.trim().toLowerCase() || "";

// Case-insensitive lookup, so accounts created with mixed-case emails still match
const findByEmail = (email) => User.findOne({ email }).collation({ locale: "en", strength: 2 });

const newToken = () => crypto.randomBytes(20).toString("hex");

// Gives the user a fresh verification link and emails it
const issueVerification = async (user) => {
  const token = newToken();
  user.emailVerificationToken = token;
  user.emailVerificationExpires = Date.now() + VERIFICATION_TTL;
  await user.save();
  await sendVerificationEmail(user, token);
};

// =======================
// REGISTER USER + EMAIL VERIFICATION
// =======================
export const register = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const email = normaliseEmail(req.body.email);
    const { password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email address" });
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({ message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` });
    }

    // Admin accounts cannot be created through public registration
    const safeRole = SELF_REGISTER_ROLES.includes(role) ? role : "student";
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await findByEmail(email);

    if (existingUser?.emailVerified) {
      return res.status(400).json({ message: "An account with this email already exists. Please sign in." });
    }

    // An unverified account (e.g. its link expired) can register again to get a new link
    if (existingUser) {
      existingUser.name = name;
      existingUser.password = hashedPassword;
      existingUser.role = safeRole;

      try {
        await issueVerification(existingUser);
      } catch (emailError) {
        console.error("Failed to resend verification email:", emailError.message);
        return res.status(500).json({ message: "Failed to send verification email. Please try again." });
      }

      return res.status(200).json({
        success: true,
        message: "We've sent you a new verification link. Please check your inbox.",
        user: toPublicUser(existingUser),
      });
    }

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: safeRole,
      emailVerified: false,
    });

    try {
      await issueVerification(user);
    } catch (emailError) {
      // Don't keep an account the user can never verify
      await User.findByIdAndDelete(user._id);
      console.error("Failed to send verification email:", emailError.message);
      return res.status(500).json({ message: "Failed to send verification email. Please try again." });
    }

    res.status(201).json({
      success: true,
      message: "Registration successful! Please check your inbox to verify your email.",
      user: toPublicUser(user),
    });
  } catch (error) {
    console.error("Register error:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// =======================
// RESEND VERIFICATION EMAIL
// =======================
export const resendVerification = async (req, res) => {
  try {
    const email = normaliseEmail(req.body.email);
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await findByEmail(email);

    if (user?.emailVerified) {
      return res.status(400).json({ message: "This email is already verified. Please sign in." });
    }

    if (user) {
      await issueVerification(user);
    }

    // Same response whether or not the account exists, to avoid revealing registered emails
    res.json({
      success: true,
      message: "If an unverified account exists for this email, a new verification link has been sent.",
    });
  } catch (err) {
    console.error("Resend verification error:", err);
    res.status(500).json({ message: "Could not send verification email. Please try again." });
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
      return res
        .status(400)
        .json({ success: false, message: "This verification link is invalid or has expired." });
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({ success: true, message: "Email verified successfully. You can now sign in." });
  } catch (err) {
    console.error("Email verification error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// =======================
// LOGIN USER
// =======================
export const login = async (req, res) => {
  try {
    const email = normaliseEmail(req.body.email);
    const { password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!user.emailVerified) {
      return res.status(403).json({
        message: "Please verify your email before signing in",
        code: "EMAIL_NOT_VERIFIED",
      });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: toPublicUser(user),
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
    const email = normaliseEmail(req.body.email);
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "No account found with this email" });
    }
    if (!user.emailVerified) {
      return res.status(403).json({ message: "Please verify your email first" });
    }

    const resetToken = newToken();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + RESET_TTL;
    await user.save();

    await sendPasswordResetEmail(user, resetToken);

    res.json({ success: true, message: "Password reset link sent to your email" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Could not send reset email. Please try again." });
  }
};

// =======================
// RESET PASSWORD
// =======================
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({ message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "This reset link is invalid or has expired" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// =======================
// GET CURRENT USER
// =======================
export const getMe = async (req, res) => {
  // req.user is loaded (without password) by the protect middleware
  res.json({ user: req.user });
};
