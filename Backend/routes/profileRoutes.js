import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import { getProfile, updateProfile } from "../controllers/profileController.js";

const router = express.Router();

const profileUpload = upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "resume", maxCount: 1 },
]);

router.get("/me", protect, getProfile);
router.put("/update", protect, profileUpload, updateProfile);

export default router;
