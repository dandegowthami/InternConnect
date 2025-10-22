import React, { useState, useEffect } from "react";
import { FaSearch, FaUserCircle, FaSignOutAlt, FaBell, FaTimes } from "react-icons/fa";
import axios from "axios";
import "../styles/pages/StudentDashboard.css";

// Import pages/components
import Applications from "./Applications";
import MyInternships from "./MyInternships";
import ViewProfile from "./ViewProfile";
import EditProfile from "./EditProfile";
import Notifications from "./Notifications";

function StudentDashboard() {
  const [internships, setInternships] = useState([]);
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // State to control which page is open
  const [activePage, setActivePage] = useState("dashboard"); // default view

  const token = localStorage.getItem("token");

  // Fetch user
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!token) return;
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserData();
  }, [token]);

  // Fetch internships
  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/dashboard/internships", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInternships(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchInternships();
  }, [token]);

  // Apply Internship
  const applyToInternship = async (id) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/applications/apply/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message);
      // Update internships state to mark applied
      setInternships((prev) =>
        prev.map((intern) =>
          intern._id === id ? { ...intern, applied: true } : intern
        )
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error applying");
    }
  };

  const filteredInternships = internships.filter((i) =>
    i.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className="student-dashboard">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark dashboard-navbar">
        <div className="container-fluid">
          <span className="navbar-brand fw-bold">InternConnect</span>

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

          <div className="d-flex align-items-center gap-3">
            <span className="welcome-text">{user ? `Welcome, ${user.name}` : "Welcome, Student"}</span>
            <FaBell
              className="notif-icon"
              onClick={() => setActivePage("notifications")}
            />
            <FaUserCircle
              className="profile-icon"
              onClick={() => {
                if (showProfile) {
                  setShowProfile(false);      // closing sidebar
                  setActivePage("dashboard"); // reset main content
                } else {
                  setShowProfile(true);       // opening sidebar
                }
              }}
            />
            <button className="btn btn-logout" onClick={() => setShowLogoutModal(true)}>
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar/Profile */}
      {showProfile && user && (
        <div className="profile-sidebar shadow-lg">
          <div className="profile-header">
            <button
              className="btn-close-profile"
              onClick={() => {
                setShowProfile(false);
                setActivePage("dashboard"); // reset to default view
              }}
            >
              <FaTimes />
            </button>
            {user.photo ? (
              <img src={`http://localhost:5000/${user.photo}`} alt="Profile" className="profile-avatar-img" />
            ) : (
              <FaUserCircle className="profile-avatar" />
            )}
            <h5 className="mt-2">{user.name}</h5>
            <p className="text-muted">{user.email}</p>
            <button className="btn-icon-logout" onClick={() => setShowLogoutModal(true)}>
              <FaSignOutAlt />
            </button>
          </div>
          <div className="profile-links">
            <button className="profile-link" onClick={() => setActivePage("applications")}>
              📄 Applications
            </button>
            <button className="profile-link" onClick={() => setActivePage("my-internships")}>
              💼 My Internships
            </button>
            <button className="profile-link" onClick={() => setActivePage("view-profile")}>
              👤 View Profile
            </button>
            <button className="profile-link" onClick={() => setActivePage("edit-profile")}>
              ✏️ Edit Profile
            </button>
            <button className="profile-link" onClick={() => setActivePage("notifications")}>
              🔔 Notifications
            </button>
            <button className="profile-link text-danger" onClick={() => setShowLogoutModal(true)}>
              🚪 Logout
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="dashboard-content container mt-4">
        {(() => {
          switch (activePage) {
            case "applications":
              return <Applications token={token} />;
            case "my-internships":
              return <MyInternships token={token} />;
            case "view-profile":
              return <ViewProfile token={token} />;
            case "edit-profile":
              return <EditProfile token={token} />;
            case "notifications":
              return <Notifications token={token} />;
            case "dashboard":
            default:
              // Fallback: default dashboard view
              return (
                <>
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
                              <button
                                className={`btn btn-apply ${intern.applied ? "btn-applied" : ""}`}
                                onClick={() => applyToInternship(intern._id)}
                                disabled={intern.applied}
                              >
                                {intern.applied ? "Applied" : "Apply Now"}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No internships found.</p>
                    )}
                  </div>
                </>
              );
          }
        })()}
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="logout-modal">
          <div className="logout-box shadow-lg">
            <h5>Are you sure you want to logout?</h5>
            <div className="d-flex justify-content-between mt-3">
              <button className="btn btn-secondary" onClick={() => setShowLogoutModal(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;
