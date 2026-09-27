import path from "path";
import fs from "fs";
import User from "../models/User.js";
import { UPLOADS_DIR } from "../config/paths.js";
import { parseList } from "../utils/parseList.js";

// Removes a previously stored "/uploads/<file>" path from disk (ignores anything else)
const removeUpload = (storedPath) => {
  if (!storedPath?.startsWith("/uploads/")) return;
  const filePath = path.join(UPLOADS_DIR, path.basename(storedPath));
  fs.promises.unlink(filePath).catch(() => {});
};

// @desc    Current user's profile
// @route   GET /api/profile/me
// @access  Private
export const getProfile = async (req, res) => {
  res.json({ user: req.user });
};

// @desc    Update current user's profile (multipart: photo, resume)
// @route   PUT /api/profile/update
// @access  Private
export const updateProfile = async (req, res) => {
  const photo = req.files?.photo?.[0];
  const resume = req.files?.resume?.[0];

  // Discard freshly uploaded files if the request is rejected
  const discardUploads = () => {
    if (photo) removeUpload(`/uploads/${photo.filename}`);
    if (resume) removeUpload(`/uploads/${resume.filename}`);
  };

  try {
    const { name, education, yearOfPassing, skills, interests, bio } = req.body;

    if (!name?.trim()) {
      discardUploads();
      return res.status(400).json({ message: "Name is required" });
    }

    if (photo && photo.size > 5 * 1024 * 1024) {
      discardUploads();
      return res.status(400).json({ message: "Image size must be less than 5MB" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      discardUploads();
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name.trim();
    user.education = education?.trim() || "";
    user.yearOfPassing = yearOfPassing?.toString().trim() || "";
    user.skills = parseList(skills);
    user.interests = parseList(interests);
    user.bio = (bio || "").trim().substring(0, 500);

    if (photo) {
      removeUpload(user.photo);
      user.photo = `/uploads/${photo.filename}`;
    }

    if (resume) {
      removeUpload(user.resume);
      user.resume = `/uploads/${resume.filename}`;
    }

    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.password;

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Update profile error:", err);
    discardUploads();

    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: Object.values(err.errors).map((e) => e.message),
      });
    }

    res.status(500).json({ message: "Server error" });
  }
};
