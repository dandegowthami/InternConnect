import User from "../models/User.js";
import Internship from "../models/Internship.js";
import Application from "../models/Application.js";
import Notification from "../models/Notification.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// @desc    Platform-wide counts
// @route   GET /api/admin/stats
// @access  Private (Admin)
export const getStats = async (req, res) => {
  try {
    const [students, recruiters, admins, internships, applications, accepted] = await Promise.all([
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "recruiter" }),
      User.countDocuments({ role: "admin" }),
      Internship.countDocuments(),
      Application.countDocuments(),
      Application.countDocuments({ status: "accepted" }),
    ]);

    res.json({
      totalUsers: students + recruiters + admins,
      students,
      recruiters,
      internships,
      applications,
      accepted,
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    List users with optional role filter and search
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getUsers = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const { role, search } = req.query;
    const filter = {};

    if (["student", "recruiter", "admin"].includes(role)) {
      filter.role = role;
    }

    if (search?.trim()) {
      const pattern = new RegExp(escapeRegex(search.trim()), "i");
      filter.$or = [{ name: pattern }, { email: pattern }];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password -emailVerificationToken -resetPasswordToken")
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit),
      User.countDocuments(filter),
    ]);

    res.json({ users, totalPages: Math.ceil(total / limit), currentPage: page, total });
  } catch (err) {
    console.error("Admin get users error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    List all internships
// @route   GET /api/admin/internships
// @access  Private (Admin)
export const getAllInternships = async (req, res) => {
  try {
    const internships = await Internship.find({})
      .populate("recruiter", "name email")
      .sort({ createdAt: -1 })
      .limit(200);

    res.json({ internships, total: internships.length });
  } catch (err) {
    console.error("Admin get internships error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a user and the data that belongs to them
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role === "admin") {
      return res.status(400).json({ message: "Admin accounts cannot be deleted here" });
    }

    if (user.role === "recruiter") {
      const internshipIds = await Internship.find({ recruiter: user._id }).distinct("_id");
      await Application.deleteMany({ internship: { $in: internshipIds } });
      await Internship.deleteMany({ recruiter: user._id });
    } else {
      const applications = await Application.find({ student: user._id });
      await Promise.all(
        applications.map((app) =>
          Internship.updateOne(
            { _id: app.internship, applicationCount: { $gt: 0 } },
            { $inc: { applicationCount: -1 } }
          )
        )
      );
      await Application.deleteMany({ student: user._id });
    }

    await Notification.deleteMany({ user: user._id });
    await user.deleteOne();

    res.json({ message: "User deleted successfully", success: true });
  } catch (err) {
    console.error("Admin delete user error:", err);
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete any internship and its applications
// @route   DELETE /api/admin/internships/:id
// @access  Private (Admin)
export const deleteInternship = async (req, res) => {
  try {
    const internship = await Internship.findByIdAndDelete(req.params.id);
    if (!internship) {
      return res.status(404).json({ message: "Internship not found" });
    }

    await Application.deleteMany({ internship: internship._id });

    res.json({ message: "Internship deleted successfully", success: true });
  } catch (err) {
    console.error("Admin delete internship error:", err);
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid internship ID" });
    }
    res.status(500).json({ message: "Server error" });
  }
};
