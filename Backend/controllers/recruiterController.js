import Internship from "../models/Internship.js";

// @desc    Create a new internship
// @route   POST /api/recruiter/internships
// @access  Private (Recruiter)
export const createInternship = async (req, res) => {
  try {
    const { title, company, location, description } = req.body;

    if (!title || !company || !description) {
      return res.status(400).json({ message: "Please provide title, company, and description" });
    }

    const internship = new Internship({
      title,
      company,
      location,
      description,
      recruiter: req.user.id, // From protect middleware
    });

    const createdInternship = await internship.save();
    res.status(201).json(createdInternship);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get internships posted by the logged-in recruiter
// @route   GET /api/recruiter/internships
// @access  Private (Recruiter)
export const getRecruiterInternships = async (req, res) => {
  try {
    const internships = await Internship.find({ recruiter: req.user.id }).sort({ createdAt: -1 });
    res.json(internships);
  } catch (error) {
    console.error("Error fetching recruiter internships:", error);
    res.status(500).json({ message: "Server Error" });
  }
};