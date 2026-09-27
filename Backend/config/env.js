// Validates required environment variables at startup so misconfiguration fails fast.
const REQUIRED = ["MONGO_URI", "JWT_SECRET"];
const RECOMMENDED = ["FRONTEND_URL", "RESEND_API_KEY"];

export const isProduction = process.env.NODE_ENV === "production";

export const validateEnv = () => {
  const missing = REQUIRED.filter((key) => !process.env[key]);
  if (missing.length) {
    console.error(`❌ Missing required environment variables: ${missing.join(", ")}`);
    process.exit(1);
  }

  const missingRecommended = RECOMMENDED.filter((key) => !process.env[key]);
  if (missingRecommended.length) {
    console.warn(`⚠️  Missing recommended environment variables: ${missingRecommended.join(", ")}`);
  }

  if (isProduction && process.env.JWT_SECRET.length < 32) {
    console.warn("⚠️  JWT_SECRET should be at least 32 characters in production");
  }
};

// FRONTEND_URL may hold several comma-separated origins (e.g. production + preview)
export const allowedOrigins = () =>
  (process.env.FRONTEND_URL || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);

// The first origin is used when building links in emails
export const primaryFrontendUrl = () => allowedOrigins()[0];
