import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaUserCircle, FaSignOutAlt, FaBell, FaTimes } from "react-icons/fa";
import axios from "axios";
import "../styles/pages/StudentDashboard.css";

function StudentDashboard() {
  const [internships, setInternships] = useState([]);
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();

  // ✅ Fetch user data from backend using token
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data.user);
      } catch (err) {
        console.error("Error fetching user data:", err);
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  // ✅ Fetch internships
  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/dashboard/internships", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInternships(res.data);
      } catch (err) {
        console.error("Error fetching internships", err);
      }
    };
    fetchInternships();
  }, []);

  // ✅ Filter internships based on search
  const filteredInternships = internships.filter((i) =>
    i.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Logout functionality
  const handleLogout = () => {
    localStorage.removeItem("token");
    setShowLogoutModal(false);
    navigate("/login");
  };

  return (
    <div className="student-dashboard">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark dashboard-navbar">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold" to="/student-dashboard">
            InternConnect
          </Link>

          {/* Search Bar */}
          <form className="d-flex search-bar">
            <FaSearch className="search-icon" />
            <input
              type="search"
              className="form-control"
              placeholder="Search internships..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>

          {/* Right Side */}
          <div className="d-flex align-items-center gap-3">
            <span className="welcome-text">
              {user ? `Welcome, ${user.name}` : "Welcome, Student"}
            </span>
            <FaBell className="notif-icon" />
            <FaUserCircle
              className="profile-icon"
              onClick={() => setShowProfile(!showProfile)}
            />
            <button
              className="btn btn-logout"
              onClick={() => setShowLogoutModal(true)}
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Internships Section */}
      <div className="container mt-4">
        <h3 className="mb-4">Latest Internships</h3>
        <div className="row">
          {filteredInternships.length > 0 ? (
            filteredInternships.map((intern) => (
              <div className="col-md-4 mb-4" key={intern._id}>
                <div className="card internship-card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{intern.title}</h5>
                    <p className="card-text">{intern.company}</p>
                    <p className="card-text text-muted">{intern.location}</p>
                    <Link
                      to={`/internships/${intern._id}`}
                      className="btn btn-apply"
                    >
                      Apply Now
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No internships found.</p>
          )}
        </div>
      </div>

      {/* Profile Sidebar */}
      {showProfile && user && (
        <div className="profile-sidebar shadow-lg">
          <div className="profile-header">
            <button className="btn-close-profile" onClick={() => setShowProfile(false)}>
              <FaTimes />
            </button>
            {user.photo ? (
              <img
                src={`http://localhost:5000/${user.photo}`}
                alt="Profile"
                className="profile-avatar-img"
              />
            ) : (
              <FaUserCircle className="profile-avatar" />
            )}
            <h5 className="mt-2">{user.name}</h5>
            <p className="text-muted">{user.email}</p>
            <button
              className="btn-icon-logout"
              onClick={() => setShowLogoutModal(true)}
            >
              <FaSignOutAlt />
            </button>
          </div>
          <div className="profile-links">
            <Link to="/applications" className="profile-link">
              📄 Applications
            </Link>
            <Link to="/my-internships" className="profile-link">
              💼 My Internships
            </Link>
            <Link to="/view-profile" className="profile-link">
              👤 View Profile
            </Link>
            <Link to="/edit-profile" className="profile-link">
              ✏️ Edit Profile
            </Link>
            <Link to="/notifications" className="profile-link">
              🔔 Notifications
            </Link>
            <button
              className="profile-link text-danger"
              onClick={() => setShowLogoutModal(true)}
            >
              🚪 Logout
            </button>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="logout-modal">
          <div className="logout-box shadow-lg">
            <h5>Are you sure you want to logout?</h5>
            <div className="d-flex justify-content-between mt-3">
              <button
                className="btn btn-secondary"
                onClick={() => setShowLogoutModal(false)}
              >
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

export default StudentDashboard;
