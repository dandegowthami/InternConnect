import express from "express";
import { getInternshipById, getInternships, createInternship } from "../controllers/internshipController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getInternships);
router.get("/:id", protect, getInternshipById);
router.post("/", protect, createInternship);

export default router;
