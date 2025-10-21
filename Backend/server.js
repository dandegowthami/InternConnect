import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js'; // Assuming you have this file

// Import your routes
import authRoutes from './routes/authRoutes.js';
import recruiterRoutes from './routes/recruiterRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import applicationRoutes from "./routes/applicationRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
// ... other routes

dotenv.config();
connectDB();

const app = express();

// ES module-friendly way to get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enable CORS - This is the crucial part
// This will allow requests from any origin. For production, you should restrict it.
app.use(cors({ origin: 'http://localhost:5173' })); // Or your frontend URL

app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/recruiter', recruiterRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/profile", profileRoutes);
// ... other app.use() for other routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
