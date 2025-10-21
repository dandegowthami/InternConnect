import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getProfile, updateProfile, getUsers } from "../controllers/profileController.js";
import multer from "multer";
import path from "path";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const router = express.Router();

// We can use upload.fields for multiple different file inputs
const profileUpload = upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'resume', maxCount: 1 }]);

router.get("/", protect, getProfile);
router.put("/", protect, profileUpload, updateProfile);
router.get("/users", protect, getUsers); // Assuming admin-only access might be needed here

export default router;