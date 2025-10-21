import mongoose from "mongoose";

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
      enum: ["applied", "shortlisted", "accepted", "rejected"],
      default: "applied",
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    // These fields are copied from the student's profile at the time of application
    resume: String,
    skills: [String],
  },
  { timestamps: true }
);

const Application = mongoose.model("Application", applicationSchema);
export default Application;
