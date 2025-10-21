import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Features from "./pages/Featres";
import About from "./pages/About";
import Contact from "./pages/Contact";
import "./styles/global.css";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import ViewProfile from "./pages/ViewProfile";
import EditProfile from "./pages/EditProfile";
import Applications from "./pages/Applications";
import MyInternships from "./pages/MyInternships";
import Notifications from "./pages/Notifications";
function App() {
  const location = useLocation();

  // Hide Navbar/Footer on login, register, dashboards, features, about, contact
  const hideNavFooter = [
    "/login",
    "/register",
    "/student-dashboard",
    "/recruiter-dashboard",
    "/admin-dashboard",
    "/features",
    "/about",
    "/contact"
  ];

  return (
    <div className="app-container d-flex flex-column min-vh-100">
      {!hideNavFooter.includes(location.pathname) && <Navbar />}

      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/features" element={<h2>Features Page</h2>} />
          <Route path="/internships/:id" element={<h2>Internship Detail Page</h2>} />
          <Route path="/about" element={<h2>About Us Page</h2>} />
          <Route path="/contact" element={<h2>Contact Page</h2>} />
          <Route path="/view-profile" element={<ViewProfile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/my-internships" element={<MyInternships />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </main>

      {!hideNavFooter.includes(location.pathname) && <Footer />}
    </div>
  );
}

export default App;
