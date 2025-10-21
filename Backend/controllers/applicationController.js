import Application from "../models/Application.js";
import Internship from "../models/Internship.js";
import User from "../models/User.js";

// 📩 Student applies for an internship
export const applyToInternship = async (req, res) => {
  try {
    const { internshipId } = req.params;

    const internship = await Internship.findById(internshipId);
    if (!internship) {
      return res.status(404).json({ message: "Internship not found" });
    }

    const existing = await Application.findOne({
      internship: internshipId,
      student: req.user._id,
    });

    if (existing) {
      return res.status(400).json({ message: "Already applied to this internship" });
    }

    const student = await User.findById(req.user._id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const newApp = await Application.create({
      internship: internshipId,
      student: req.user._id,
      resume: student.resume || "",
      skills: student.skills || [],
    });

    res.status(201).json(newApp);
  } catch (error) {
    console.error("Error applying:", error);
    res.status(500).json({ message: "Failed to apply" });
  }
};

// 📋 Get all applications of logged-in student
export const getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ student: req.user._id })
      .populate("internship", "title company location")
      .sort({ appliedAt: -1 });
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// 🧾 Recruiter — View all applicants for an internship
export const getApplicantsForInternship = async (req, res) => {
  try {
    const { internshipId } = req.params;

    const internship = await Internship.findById(internshipId);
    if (!internship) return res.status(404).json({ message: "Internship not found" });

    const applicants = await Application.find({ internship: internshipId })
      .populate("student", "name email phone resume skills"); // ✅ Correct chaining

    res.json({
      internship,
      applicants: applicants.map(app => ({
        _id: app._id,
        status: app.status,
        appliedAt: app.appliedAt,
        applicant: app.student, // mapped for frontend
      })),
    });
  } catch (error) {
    console.error("Error fetching applicants:", error);
    res.status(500).json({ message: "Error fetching applicants" });
  }
};
