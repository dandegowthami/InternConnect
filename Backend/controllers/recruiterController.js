import Internship, { INTERNSHIP_TYPES } from "../models/Internship.js";
import Application from "../models/Application.js";
import { parseList } from "../utils/parseList.js";

// @desc    Create a new internship
// @route   POST /api/recruiter/internships  (also POST /api/internships)
// @access  Private (Recruiter)
export const createInternship = async (req, res) => {
  try {
    const { title, company, location, description, stipend, duration, type, skills } = req.body;

    if (!title?.trim() || !company?.trim() || !description?.trim()) {
      return res.status(400).json({
        message: "Please provide title, company, and description",
        success: false,
      });
    }

    const existingInternship = await Internship.findOne({
      title: title.trim(),
      company: company.trim(),
      recruiter: req.user._id,
    });

    if (existingInternship) {
      return res.status(409).json({
        message: "You have already posted an internship with this title and company",
        success: false,
      });
    }

    const internship = await Internship.create({
      title: title.trim(),
      company: company.trim(),
      location: location?.trim() || "Remote",
      description: description.trim(),
      type: INTERNSHIP_TYPES.includes(type) ? type : "Full-time",
      stipend: stipend?.trim(),
      duration: duration?.trim(),
      skills: parseList(skills),
      recruiter: req.user._id,
    });

    await internship.populate("recruiter", "name email");

    res.status(201).json({
      message: "Internship created successfully",
      internship,
      success: true,
    });
  } catch (err) {
    console.error("Create internship error:", err);

    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: Object.values(err.errors).map((e) => e.message),
        success: false,
      });
    }

    res.status(500).json({ message: "Server error", success: false });
  }
};

// @desc    Internships posted by the logged-in recruiter
// @route   GET /api/recruiter/internships
// @access  Private (Recruiter)
export const getRecruiterInternships = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const skip = (page - 1) * limit;
    const filter = { recruiter: req.user._id };

    const [internships, total] = await Promise.all([
      Internship.find(filter).sort({ createdAt: -1 }).limit(limit).skip(skip),
      Internship.countDocuments(filter),
    ]);

    res.json({
      internships,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching recruiter internships:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// @desc    Delete one of the recruiter's internships (and its applications)
// @route   DELETE /api/recruiter/internships/:id
// @access  Private (Recruiter)
export const deleteRecruiterInternship = async (req, res) => {
  try {
    const internship = await Internship.findOneAndDelete({
      _id: req.params.id,
      recruiter: req.user._id,
    });

    if (!internship) {
      return res.status(404).json({ message: "Internship not found or access denied" });
    }

    await Application.deleteMany({ internship: internship._id });

    res.json({ message: "Internship deleted successfully", success: true });
  } catch (error) {
    console.error("Delete internship error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid internship ID" });
    }
    res.status(500).json({ message: "Server error", success: false });
  }
};
