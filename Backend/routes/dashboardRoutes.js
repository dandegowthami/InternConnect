import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { getInternships } from "../controllers/internshipController.js";

const router = express.Router();

// Legacy alias of GET /api/internships, kept for backwards compatibility
router.get("/internships", protect, authorize("student"), getInternships);

export default router;
