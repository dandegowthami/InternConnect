import express from "express";
import { createInternship, getInternships } from "../controllers/internshipController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
const router = express.Router();

// ✅ Get all internships (public)
router.get("/", getInternships);

// ✅ Create internship (Recruiter only)
router.post("/", protect, authorize("recruiter"), createInternship);

export default router;
