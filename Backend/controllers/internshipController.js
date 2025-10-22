import Internship from "../models/Internship.js";

// ✅ Create internship
export const createInternship = async (req, res) => {
  try {
    const { title, company, location, stipend, duration, description, skills } = req.body;

    if (!title || !company || !description) {
      return res.status(400).json({ message: "Please provide title, company, and description" });
    }

    const internship = new Internship({
      title,
      company,
      location,
      stipend,
      duration,
      description,
      skills,
      recruiter: req.user?._id || null, // optional recruiter association
    });

    const createdInternship = await internship.save();
    res.status(201).json(createdInternship);
  } catch (err) {
    console.error("Error creating internship:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get all internships
export const getInternships = async (req, res) => {
  try {
    const internships = await Internship.find({}).populate("recruiter", "name email");
    res.json(internships);
  } catch (err) {
    console.error("Error fetching internships:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Get internship by ID
export const getInternshipById = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id).populate("recruiter", "name email");
    if (!internship) {
      return res.status(404).json({ message: "Internship not found" });
    }
    res.json(internship);
  } catch (err) {
    console.error("Error fetching internship by ID:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
