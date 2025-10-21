import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/pages/Login.css";
import axios from "axios";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  // ✅ Handle input changes
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ✅ Toggle password visibility
  const togglePassword = () => setShowPassword(!showPassword);

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // stop reload
    setErrorMsg("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      const { token, user } = res.data;

      if (!token || !user) {
        setErrorMsg("Invalid response from server");
        return;
      }

      // ✅ Save token & user info
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // ✅ Redirect according to role
      if (user.role === "student") {
        navigate("/student-dashboard");
      } else if (user.role === "recruiter") {
        navigate("/recruiter-dashboard");
      } else if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login Error:", err);
      if (err.response) {
        setErrorMsg(err.response.data.message || "Invalid credentials");
      } else {
        setErrorMsg("Server not responding. Please try again later.");
      }
    }
  };

  return (
    <div className="login-page d-flex align-items-center justify-content-center">
      {/* Back to Home Button */}
      <div className="back-home">
        <Link to="/" className="btn btn-light shadow-sm">
          ← Back to Home 🏠
        </Link>
      </div>

      {/* Login Card */}
      <div className="card login-card shadow-lg">
        <div className="card-header login-header text-center">
          <h2 className="login-name">IC</h2>
          <h2 className="login-title mb-2">Welcome Back</h2>
          <p className="login-subtitle mb-0">
            Sign in to access your dashboard
          </p>
        </div>

        <div className="card-body">
          {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-3 position-relative">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="form-control ps-5"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className="mb-3 position-relative">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="form-control ps-5"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="btn-show-hide"
                onClick={togglePassword}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div className="mb-3 text-end">
              <Link to="/forgot-password" className="text-decoration-none">
                Forgot Password?
              </Link>
            </div>

            <div className="d-grid mt-3">
              <button type="submit" className="btn btn-login">
                Login
              </button>
            </div>
          </form>
        </div>

        <div className="card-footer text-center">
          <small>
            Don’t have an account?{" "}
            <Link to="/register" className="create-youraccount">
              Create your account
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}

export default Login;
