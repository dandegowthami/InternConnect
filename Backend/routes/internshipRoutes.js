import express from "express";
import {
  getInternshipById,
  getInternships,
  getPublicInternships,
} from "../controllers/internshipController.js";
import { createInternship } from "../controllers/recruiterController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public listing (landing / opportunities page)
router.get("/public", getPublicInternships);

// Students: all internships with their application status
router.get("/", protect, authorize("student"), getInternships);

// Any signed-in user: single internship
router.get("/:id", protect, getInternshipById);

// Recruiters: create internship
router.post("/", protect, authorize("recruiter"), createInternship);

export default router;
