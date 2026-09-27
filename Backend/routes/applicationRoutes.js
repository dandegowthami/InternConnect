import express from "express";
import {
  applyToInternship,
  getMyApplications,
  getApplicantsForInternship,
  updateApplicationStatus,
} from "../controllers/applicationController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Student applies
router.post("/:internshipId/apply", protect, authorize("student"), applyToInternship);

// Student gets their applications
router.get("/my", protect, authorize("student"), getMyApplications);

// Recruiter gets applicants for internship
router.get("/:internshipId/applicants", protect, authorize("recruiter"), getApplicantsForInternship);

// Recruiter updates application status
router.patch("/status/:applicationId", protect, authorize("recruiter"), updateApplicationStatus);

export default router;
