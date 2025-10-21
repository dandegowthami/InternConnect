// backend/controllers/profileController.js
import User from "../models/User.js";
import path from "path";
import fs from "fs";

export const getProfile = async (req, res) => {
  try {
    const user = req.user;
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT middleware
    const {
      name,
      education,
      yearOfPassing,
      skills,
      interests,
      bio
    } = req.body;

    // Find the user first to access old file paths for deletion
    const user = await User.findById(userId);

    // Construct update object
    const updateData = {
      name,
      education,
      yearOfPassing,
      skills,
      interests,
      bio,
    };

    // Handle uploaded files
    if (req.files) {
      if (req.files.photo && req.files.photo[0]) {
        // If an old photo exists, delete it
        if (user.photo) {
          const oldPath = path.join(path.resolve(), 'backend', user.photo);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        updateData.photo = `/uploads/${req.files.photo[0].filename}`;
      }
      if (req.files.resume && req.files.resume[0]) {
        // If an old resume exists, delete it
        if (user.resume) {
          const oldPath = path.join(path.resolve(), 'backend', user.resume);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        updateData.resume = `/uploads/${req.files.resume[0].filename}`;
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const getUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const filter = {};

    if (role) {
      // You might want to validate the role against a list of allowed roles
      // e.g., if (!['student', 'recruiter', 'admin'].includes(role)) { ... }
      filter.role = role;
    }

    // Exclude password from the result for security
    const users = await User.find(filter).select("-password");
    res.json({ users });
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
