import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  getStats,
  getUsers,
  getAllInternships,
  deleteUser,
  deleteInternship,
} from "../controllers/adminController.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/stats", getStats);
router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);
router.get("/internships", getAllInternships);
router.delete("/internships/:id", deleteInternship);

export default router;
