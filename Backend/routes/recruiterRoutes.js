import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  createInternship,
  getRecruiterInternships,
} from "../controllers/recruiterController.js";
import { getApplicantsForInternship } from "../controllers/applicationController.js"; // This is for a different route

const router = express.Router();

// Recruiter creates an internship
router.post("/internships", protect, authorize("recruiter"), createInternship);

// Recruiter gets their own posted internships
router.get("/internships", protect, authorize("recruiter"), getRecruiterInternships);

// Recruiter gets applicants for a specific internship
router.get(
  "/internships/:internshipId/applicants", // Corrected path to be plural
  protect,
  authorize("recruiter"),
  getApplicantsForInternship
);

export default router;
