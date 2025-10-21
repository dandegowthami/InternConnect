import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { getApplicantsForInternship } from "../controllers/applicationController.js";

const router = express.Router();

// Get applicants for a specific internship (only recruiters)
router.get(
  "/internship/:internshipId/applicants",
  protect,               // verifies JWT
  authorize("recruiter"), // ensures user role is recruiter
  getApplicantsForInternship
);

export default router;
