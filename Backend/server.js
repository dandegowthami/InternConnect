import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import fs from "fs";
import multer from "multer";

import connectDB, { disconnectDB, isDBConnected } from "./config/db.js";
import { allowedOrigins, isProduction, validateEnv } from "./config/env.js";
import { UPLOADS_DIR } from "./config/paths.js";
import { apiLimiter } from "./middleware/rateLimit.js";
import { closeTransporter } from "./utils/email.js";

import authRoutes from "./routes/authRoutes.js";
import recruiterRoutes from "./routes/recruiterRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import internshipRoutes from "./routes/internshipRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

validateEnv();
connectDB();

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const app = express();

// Behind a hosting proxy (Render, Railway, Heroku…) so rate limiting sees real client IPs
app.set("trust proxy", 1);
app.disable("x-powered-by");

// Allow uploaded images/resumes to be embedded by the frontend on another origin
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(compression());
app.use(morgan(isProduction ? "combined" : "dev"));

const origins = allowedOrigins();
app.use(
  cors({
    origin: (origin, callback) => {
      // Requests without an Origin header (curl, health checks) are allowed
      if (!origin || origins.includes(origin)) return callback(null, true);
      callback(Object.assign(new Error("Not allowed by CORS"), { status: 403 }));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Serve uploaded files (profile photos, resumes)
app.use("/uploads", express.static(UPLOADS_DIR, { maxAge: "7d" }));

// Root URL of the deployed API
app.get("/", (req, res) => {
  res.json({ name: "InternConnect API", status: "running", health: "/api/health" });
});

app.get("/api/health", (req, res) => {
  const database = isDBConnected() ? "connected" : "disconnected";
  const healthy = database === "connected";
  res.status(healthy ? 200 : 503).json({ status: healthy ? "ok" : "degraded", database });
});

// API routes
app.use("/api", apiLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/internships", internshipRoutes);
app.use("/api/recruiter", recruiterRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);

// 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Central error handler (Express requires the 4-argument signature)
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);

  if (err instanceof multer.MulterError) {
    const message = err.code === "LIMIT_FILE_SIZE" ? "File is too large (max 10MB)" : err.message;
    return res.status(400).json({ message });
  }

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Invalid JSON in request body" });
  }

  if (err.status && err.status < 500) {
    return res.status(err.status).json({ message: err.message });
  }

  console.error("Unhandled error:", err);
  res.status(500).json({
    message: "Something went wrong!",
    error: isProduction ? undefined : err.message,
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Graceful shutdown for hosting platforms that send SIGTERM on redeploy
const shutdown = (signal) => {
  console.log(`${signal} received, shutting down…`);
  server.close(async () => {
    closeTransporter();
    await disconnectDB().catch(() => {});
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000).unref();
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("unhandledRejection", (reason) => console.error("Unhandled rejection:", reason));
