import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaUserGraduate, FaBuilding, FaUserShield } from "react-icons/fa";
import "../styles/pages/Register.css";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student", // default role
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRoleChange = (role) => setFormData({ ...formData, role });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", formData);
      // Use the success message from the server
      setMessage(`✅ ${res.data.message}`);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage(`❌ ${err.response?.data?.message || "Registration failed. Please try again."}`);
    }
  };

  return (
    <div className="register-page d-flex align-items-center justify-content-center">
      <div className="back-home">
        <Link to="/" className="btn btn-light shadow-sm">
          ← Back to Home🏠
        </Link>
      </div>

      <div className="card register-card shadow-lg">
        <div className="card-header">
          <h3 className="mb-0">IC – Join InternConnect</h3>
          <small>Create your account and start your journey</small>
        </div>

        <div className="card-body">
          {message && <div className="alert alert-info text-center">{message}</div>}

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Create password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              
            </div>

            {/* Role Selection */}
            <div className="mb-3">
              <label className="form-label d-block">Register as</label>
              <div className="d-flex justify-content-between">
                <div
                  className={`role-option ${formData.role === "student" ? "active" : ""}`}
                  onClick={() => handleRoleChange("student")}
                >
                  <FaUserGraduate size={24} />
                  <span>Student</span>
                </div>
                <div
                  className={`role-option ${formData.role === "recruiter" ? "active" : ""}`}
                  onClick={() => handleRoleChange("recruiter")}
                >
                  <FaBuilding size={24} />
                  <span>Recruiter</span>
                </div>
                <div
                  className={`role-option ${formData.role === "admin" ? "active" : ""}`}
                  onClick={() => handleRoleChange("admin")}
                >
                  <FaUserShield size={24} />
                  <span>Admin</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="d-grid">
              <button type="submit" className="btn btn-signup">
                Sign Up
              </button>
            </div>
          </form>
        </div>

        <div className="card-footer text-center">
          <small>
            Already have an account? <Link to="/login">Login</Link>
          </small>
        </div>
      </div>
    </div>
  );
}

export default Register;
