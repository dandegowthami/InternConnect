import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaPlusCircle,
  FaSignOutAlt,
  FaUserCircle,
  FaBell,
  FaChevronLeft,
  FaTimes,
} from "react-icons/fa";
import "../styles/pages/RecruiterDashboard.css";

function RecruiterDashboard() {
  const [recruiter, setRecruiter] = useState(null);
  const [internships, setInternships] = useState([]);
  const [form, setForm] = useState({ title: "", company: "", location: "", description: "" });
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    // Check for token and user role on mount
    if (!token) {
      navigate("/login");
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.role !== "recruiter") {
        alert("Access Denied: You are not authorized to view this page.");
        navigate(user.role === "student" ? "/student-dashboard" : "/login");
        return;
      }
    } else {
      // If no user in localStorage but token exists, let API calls clarify
      // handleApiError will catch 403s or /api/auth/me will return user data
    }

    fetchRecruiterAndInternships();
  }, []);

  // Centralized error handler to check for authorization issues
  const handleApiError = (err) => { // Returns true if the error was a 403 and handled
    console.error(err);
    if (err.response && err.response.status === 403) {
      alert("Access Denied: You are not authorized to view this page.");
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        navigate(user.role === "student" ? "/student-dashboard" : "/login");
      } else {
        navigate("/login"); // Fallback if user data is missing from localStorage
      }
      return true; // Error was handled
    }
    return false; // Error was not a 403 or not handled by this function
  };

  const fetchRecruiterAndInternships = async () => {
    try {
      setLoading(true);
      // fetch recruiter info (from /api/auth/me)
      const me = await axios.get("http://localhost:5000/api/auth/me", { headers });
      setRecruiter(me.data.user);

      // fetch posted internships
      const res = await axios.get("http://localhost:5000/api/recruiter/internships", { headers });
      setInternships(res.data);
    } catch (err) {
      if (!handleApiError(err)) {
        alert("Failed to load dashboard data."); // Generic alert for other errors
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePost = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/recruiter/internships", form, { headers });
      setInternships((p) => [res.data, ...p]);
      setForm({ title: "", company: "", location: "", description: "" });
      alert("Internship posted successfully!"); // Success message
    } catch (err) {
      if (!handleApiError(err)) {
        alert("Failed to post internship"); // Generic alert for other errors
      }
    }
  };

  const viewApplicants = async (internship) => {
    try {
      setSelectedInternship(internship);
      const res = await axios.get(`http://localhost:5000/api/recruiter/internships/${internship._id}/applicants`, { headers });
      setApplicants(res.data.applicants);
      // No success alert needed for viewing applicants
    } catch (err) {
      if (!handleApiError(err)) {
        alert("Failed to load applicants"); // Generic alert for other errors
      }
    }
  };

  const closeApplicants = () => {
    setSelectedInternship(null);
    setApplicants([]);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setShowLogoutModal(false); // Close modal on logout
    window.location.href = "/login";
  };

  return (
    <div className="recruiter-dashboard">
      {/* Top Navbar */}
      <header className="recruiter-navbar">
        <div className="brand">
          <h3>InternConnect</h3>
        </div>
        <div className="search-and-user">
          <div className="welcome">
            <FaUserCircle className="user-icon" />
            <div className="welcome-text">
              <div className="small">Welcome,</div>
              <div className="name">{recruiter ? recruiter.name : "Recruiter"}</div>
            </div>
          </div>
          <FaBell className="notif" />
          <button className="btn-logout" onClick={() => setShowLogoutModal(true)}><FaSignOutAlt /> Logout</button>
        </div>
      </header>

      {/* Main content with bg image */}
      <main className="recruiter-main">
        <div className="left-col">
          <div className="card post-card">
            <h4><FaPlusCircle /> Post a New Internship</h4>
            <form onSubmit={handlePost}>
              <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required />
              <input name="company" value={form.company} onChange={handleChange} placeholder="Company" required />
              <input name="location" value={form.location} onChange={handleChange} placeholder="Location" required />
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Short description (optional)" rows="4" />
              <div className="form-actions">
                <button type="submit" className="btn btn-post">Post Internship</button>
              </div>
            </form>
          </div>

          <div className="card posted-list">
            <h4>All Posted Internships</h4>
            {loading ? <p>Loading...</p> : internships.length === 0 ? <p>No internships yet.</p> : (
              <ul className="internship-list">
                {internships.map((i) => (
                  <li key={i._id} className="internship-item">
                    <div>
                      <div className="title">{i.title}</div>
                      <div className="meta">{i.company} • {i.location}</div>
                    </div>
                    <div className="item-actions">
                      <button className="btn small" onClick={() => viewApplicants(i)}>View Applicants</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="right-col">
          {!selectedInternship ? (
            <div className="card summary-card">
              <h4>Dashboard Summary</h4>
              <div className="summary-grid">
                <div className="stat">
                  <div className="num">{internships.length}</div>
                  <div className="label">Total Internships</div>
                </div>
                <div className="stat">
                  <div className="num">—</div>
                  <div className="label">Active Applicants</div>
                </div>
              </div>
              <div className="recent-activity">
                <h5>Recent Posts</h5>
                {internships.slice(0, 4).map((i) => (
                  <div key={i._id} className="recent-item">
                    <div>{i.title}</div>
                    <div className="muted">{new Date(i.createdAt).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="card applicants-card">
              <div className="applicants-header">
                <button className="icon-btn" onClick={closeApplicants}><FaChevronLeft /></button>
                <h4>Applicants for: <span className="muted">{selectedInternship.title}</span></h4>
              </div>

              <div className="applicants-list">
                {applicants.length === 0 ? <p>No applicants yet.</p> : (
                  <table className="table-applicants">
                    <thead><tr><th>Name</th><th>Email</th><th>Resume</th><th>Status</th></tr></thead>
                    <tbody>
                      {applicants.map((a) => (
                        <tr key={a._id}>
                          <td>{a.applicant?.name}</td>
                          <td>{a.applicant?.email}</td>
                          <td>{a.resumeUrl ? <a href={a.resumeUrl} target="_blank" rel="noreferrer">View</a> : "—"}</td>
                          <td>{a.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="logout-modal">
          <div className="logout-box shadow-lg">
            <h5>Are you sure you want to logout?</h5>
            <div className="d-flex justify-content-between mt-3">
              <button
                className="btn btn-secondary"
                onClick={() => setShowLogoutModal(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecruiterDashboard;
