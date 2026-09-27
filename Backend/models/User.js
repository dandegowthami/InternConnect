import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "recruiter", "admin"], default: "student" },

    // Profile fields
    education: String,
    yearOfPassing: String,
    skills: [String],
    interests: [String],
    bio: { type: String, maxlength: 500 },
    photo: String,
    resume: String,

    // Auth fields
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
