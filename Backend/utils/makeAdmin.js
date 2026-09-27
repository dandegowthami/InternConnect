// Promotes an existing, verified account to the admin role.
// Usage: npm run make-admin -- someone@example.com
import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.js";

const email = process.argv[2]?.trim();

if (!email) {
  console.error("Usage: npm run make-admin -- <email>");
  process.exit(1);
}

try {
  await mongoose.connect(process.env.MONGO_URI);

  const user = await User.findOneAndUpdate({ email }, { role: "admin", emailVerified: true }, { new: true });

  if (!user) {
    console.error(`❌ No user found with email ${email}`);
    process.exitCode = 1;
  } else {
    console.log(`✅ ${user.name} <${user.email}> is now an admin`);
  }
} catch (error) {
  console.error("❌ Failed to promote user:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
