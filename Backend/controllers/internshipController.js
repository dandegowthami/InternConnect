import Internship from "../models/Internship.js";

// @desc    Get all internships
// @route   GET /api/internships or /api/dashboard/internships
// @access  Private


export const createInternship = async (req, res) => {
  try {
    // Destructure the internship details from the request body
    const {
      title,
      company,
      location,
      stipend,
      duration,
      description,
      skills,
    } = req.body;

    // Check for required fields
    if (!title || !company || !description) {
      return res.status(400).json({ message: "Please provide title, company, and description" });
    }

    // Create the new internship object, associating it with the logged-in recruiter
    const internship = new Internship({
      title,
      company,
      location,
      stipend,
      duration,
      description,
      skills,
      recruiter: req.user._id, // Assign the logged-in recruiter's ID
    });

    const createdInternship = await internship.save();

    // Respond with 201 (Created) and the new internship data
    res.status(201).json(createdInternship);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getInternships = async (req, res) => {
  try {
    const internships = await Internship.find({}).populate("recruiter", "name");
    res.json(internships);
  } catch (error) {
    console.error("Error fetching internships:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

