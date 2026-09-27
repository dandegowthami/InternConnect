import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["info", "success", "warning", "error", "application", "system", "alert"],
      default: "info",
    },
    read: {
      type: Boolean,
      default: false,
    },
    relatedId: {
      // For linking to internships/applications
      type: mongoose.Schema.Types.ObjectId,
      refPath: "relatedModel",
    },
    relatedModel: {
      type: String,
      enum: ["Internship", "Application"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
