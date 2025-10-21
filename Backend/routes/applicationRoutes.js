import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  getMyApplications,
  applyToInternship,
  getApplicantsForInternship, // ✅ Correct name
} from "../controllers/applicationController.js";

const router = express.Router();

// Student: Get all their own applications
router.get("/my", protect, authorize("student"), getMyApplications);

// Student: Apply to an internship
router.post("/apply/:internshipId", protect, authorize("student"), applyToInternship);

// Recruiter: Get applicants for a specific internship
router.get("/:internshipId/applicants", protect, authorize("recruiter"), getApplicantsForInternship);

export default router;
