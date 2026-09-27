import rateLimit from "express-rate-limit";

const limiter = (windowMinutes, limit, message) =>
  rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    limit,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { message },
  });

// General API protection
export const apiLimiter = limiter(15, 500, "Too many requests. Please try again later.");

// Stricter limits for credential and email endpoints
export const authLimiter = limiter(15, 20, "Too many attempts. Please wait a few minutes and try again.");
