import multer from "multer";
import path from "path";
import fs from "fs";
import { UPLOADS_DIR } from "../config/paths.js";

if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const badRequest = (message) => Object.assign(new Error(message), { status: 400 });

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "photo") {
    return IMAGE_TYPES.includes(file.mimetype)
      ? cb(null, true)
      : cb(badRequest("Only JPG, PNG or WEBP images are allowed for profile photo"), false);
  }

  if (file.fieldname === "resume") {
    return file.mimetype === "application/pdf"
      ? cb(null, true)
      : cb(badRequest("Only PDF files are allowed for resume"), false);
  }

  cb(badRequest("Unexpected file field"), false);
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter,
});

export default upload;
