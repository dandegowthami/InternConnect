import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  createInternship,
  getRecruiterInternships,
  deleteRecruiterInternship,
} from "../controllers/recruiterController.js";
import { getApplicantsForInternship } from "../controllers/applicationController.js";

const router = express.Router();

router.use(protect, authorize("recruiter"));

router.post("/internships", createInternship);
router.get("/internships", getRecruiterInternships);
router.delete("/internships/:id", deleteRecruiterInternship);
router.get("/internships/:internshipId/applicants", getApplicantsForInternship);

export default router;
