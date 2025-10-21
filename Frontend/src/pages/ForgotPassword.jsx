import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/pages/Login.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="login-page d-flex align-items-center justify-content-center">
      <div className="card login-card shadow-lg">
        <div className="card-header bg-warning text-center  text-white">
          <h3>Forgot Password</h3>
          <small>Enter your registered email to reset password</small>
        </div>
        <div className="card-body">
          {message && (
            <div
              className={`alert text-center ${
                message.toLowerCase().includes("sent") || message.toLowerCase().includes("success")
                  ? "alert-success"
                  : "alert-danger"
              }`}
            >
              {message}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3 position-relative">
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="d-grid mt-3">
              <button type="submit" className="btn btn-warning">
                Send Reset Link
              </button>
            </div>
          </form>
        </div>
        <div className="card-footer text-center">
          <Link to="/login">← Back to Login</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
