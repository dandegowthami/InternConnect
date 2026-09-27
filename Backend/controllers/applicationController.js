import Application, { APPLICATION_STATUSES } from "../models/Application.js";
import Internship from "../models/Internship.js";
import Notification from "../models/Notification.js";

const getPagination = (query) => {
  const page = Math.max(parseInt(query.page) || 1, 1);
  const limit = Math.min(parseInt(query.limit) || 50, 100);
  return { page, limit, skip: (page - 1) * limit };
};

const normaliseStatus = (status) => {
  const value = status?.trim().toLowerCase();
  return APPLICATION_STATUSES.includes(value) ? value : null;
};

// @desc    Student applies to an internship
// @route   POST /api/applications/:internshipId/apply
// @access  Private (Student)
export const applyToInternship = async (req, res) => {
  try {
    const { internshipId } = req.params;
    const student = req.user;

    const internship = await Internship.findById(internshipId);
    if (!internship) {
      return res.status(404).json({ message: "Internship not found" });
    }

    const existingApplication = await Application.findOne({
      internship: internshipId,
      student: student._id,
    });
    if (existingApplication) {
      return res.status(409).json({ message: "You have already applied to this internship" });
    }

    if (!student.resume) {
      return res.status(400).json({ message: "Please upload your resume before applying" });
    }

    const newApplication = await Application.create({
      internship: internshipId,
      student: student._id,
      resume: student.resume,
      skills: student.skills || [],
    });

    await Internship.updateOne({ _id: internship._id }, { $inc: { applicationCount: 1 } });

    await Notification.create({
      user: internship.recruiter,
      title: "New Application",
      message: `${student.name} has applied for your internship: ${internship.title}.`,
      type: "application",
      relatedId: newApplication._id,
      relatedModel: "Application",
    });

    await newApplication.populate("internship", "title company location");

    res.status(201).json({
      message: "Application submitted successfully",
      application: newApplication,
      applicationId: newApplication._id,
      success: true,
    });
  } catch (error) {
    console.error("Application error:", error);

    if (error.code === 11000) {
      return res.status(409).json({ message: "You have already applied to this internship" });
    }
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid internship ID" });
    }

    res.status(500).json({ message: "Failed to apply" });
  }
};

// @desc    Applications of the logged-in student
// @route   GET /api/applications/my
// @access  Private (Student)
export const getMyApplications = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const filter = { student: req.user._id };

    const status = normaliseStatus(req.query.status);
    if (status) filter.status = status;

    const [applications, total] = await Promise.all([
      Application.find(filter)
        .populate({
          path: "internship",
          select: "title company location description duration stipend type skills recruiter",
          populate: { path: "recruiter", select: "name email" },
        })
        .sort({ appliedAt: -1 })
        .limit(limit)
        .skip(skip),
      Application.countDocuments(filter),
    ]);

    res.json({
      applications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      success: true,
    });
  } catch (error) {
    console.error("Get applications error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Applicants for one of the recruiter's internships
// @route   GET /api/applications/:internshipId/applicants
// @access  Private (Recruiter)
export const getApplicantsForInternship = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { internshipId } = req.params;

    const internship = await Internship.findOne({ _id: internshipId, recruiter: req.user._id });
    if (!internship) {
      return res.status(404).json({ message: "Internship not found or access denied" });
    }

    const filter = { internship: internshipId };
    const status = normaliseStatus(req.query.status);
    if (status) filter.status = status;

    const [applications, total] = await Promise.all([
      Application.find(filter)
        .populate("student", "name email photo resume skills education yearOfPassing bio")
        .sort({ appliedAt: -1 })
        .limit(limit)
        .skip(skip),
      Application.countDocuments(filter),
    ]);

    res.json({
      internship: {
        _id: internship._id,
        title: internship.title,
        company: internship.company,
        location: internship.location,
      },
      applications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching applicants:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid internship ID" });
    }
    res.status(500).json({ message: "Error fetching applicants" });
  }
};

// @desc    Recruiter updates an application's status
// @route   PATCH /api/applications/status/:applicationId
// @access  Private (Recruiter)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const status = normaliseStatus(req.body.status);

    if (!status) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const internship = await Internship.findOne({
      _id: application.internship,
      recruiter: req.user._id,
    });
    if (!internship) {
      return res.status(403).json({ message: "Access denied" });
    }

    application.status = status;
    await application.save();

    const notifications = {
      accepted: {
        title: "Congratulations! You're Shortlisted!",
        message: `Great news! Your application for the ${internship.title} role at ${internship.company} has been accepted. The recruiter will be in touch with the next steps.`,
        type: "success",
      },
      rejected: {
        title: "Update on your Internship Application",
        message: `Regarding your application for ${internship.title} at ${internship.company}, the recruiter has decided not to move forward at this time. We encourage you to apply for other opportunities. All the best!`,
        type: "warning",
      },
      pending: {
        title: "Application Status Updated",
        message: `Your application for ${internship.title} at ${internship.company} is back under review.`,
        type: "info",
      },
    };

    await Notification.create({
      user: application.student,
      ...notifications[status],
      relatedId: application._id,
      relatedModel: "Application",
    });

    res.json({
      message: `Application ${status} successfully`,
      application,
      success: true,
    });
  } catch (error) {
    console.error("Update application status error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid application ID" });
    }
    res.status(500).json({ message: "Failed to update application status" });
  }
};
