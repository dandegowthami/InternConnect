import mongoose from "mongoose";

export const INTERNSHIP_TYPES = ["Full-time", "Part-time", "Remote", "Hybrid"];

const internshipSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    type: { type: String, enum: INTERNSHIP_TYPES, default: "Full-time" },
    stipend: String,
    duration: String,
    skills: [String],
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applicationCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Internship = mongoose.model("Internship", internshipSchema);
export default Internship;
