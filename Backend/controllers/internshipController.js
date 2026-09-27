import Internship from "../models/Internship.js";
import Application from "../models/Application.js";

// Adds applied / applicationStatus / applicationId fields for the given student
const withApplicationStatus = async (internships, studentId) => {
  const applications = await Application.find({
    student: studentId,
    internship: { $in: internships.map((i) => i._id) },
  });

  const byInternship = new Map(applications.map((app) => [app.internship.toString(), app]));

  return internships.map((internship) => {
    const app = byInternship.get(internship._id.toString());
    return {
      ...internship.toObject(),
      applied: Boolean(app),
      applicationStatus: app?.status || "not_applied",
      applicationId: app?._id || null,
    };
  });
};

// @desc    All internships, with the student's application status
// @route   GET /api/internships
// @access  Private (Student)
export const getInternships = async (req, res) => {
  try {
    const internships = await Internship.find({ recruiter: { $ne: null } })
      .populate("recruiter", "name email")
      .sort({ createdAt: -1 });

    if (req.user?.role === "student") {
      return res.json(await withApplicationStatus(internships, req.user._id));
    }

    res.json(internships);
  } catch (err) {
    console.error("Error fetching internships:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Latest internships for the public listing
// @route   GET /api/internships/public
// @access  Public
export const getPublicInternships = async (req, res) => {
  try {
    const internships = await Internship.find({})
      .select("-applicationCount")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(internships);
  } catch (err) {
    console.error("Error fetching public internships:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Single internship (with application status for students)
// @route   GET /api/internships/:id
// @access  Private
export const getInternshipById = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id).populate("recruiter", "name email");
    if (!internship) {
      return res.status(404).json({ message: "Internship not found" });
    }

    if (req.user?.role === "student") {
      const [withStatus] = await withApplicationStatus([internship], req.user._id);
      return res.json(withStatus);
    }

    res.json(internship);
  } catch (err) {
    console.error("Error fetching internship by ID:", err);
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid internship ID" });
    }
    res.status(500).json({ message: "Server error" });
  }
};
