import mongoose from "mongoose";

export const APPLICATION_STATUSES = ["pending", "accepted", "rejected"];

const applicationSchema = new mongoose.Schema(
  {
    internship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Internship",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: APPLICATION_STATUSES,
      default: "pending",
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    resume: String,
    skills: [String],
  },
  { timestamps: true }
);

// A student can apply to an internship only once
applicationSchema.index({ internship: 1, student: 1 }, { unique: true });

const Application = mongoose.model("Application", applicationSchema);
export default Application;
