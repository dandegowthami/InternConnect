import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { getInternships } from "../controllers/internshipController.js";

const router = express.Router();

// The frontend is fetching /api/dashboard/internships, let's make that work.
// Note: We also created /api/internships which is a cleaner approach.
router.get("/internships", protect, authorize("student"), getInternships);

export default router;
