// src/components/ProfileSidebar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

export default function ProfileSidebar({ user, onClose, onLogout }) {
  return (
    <div className="profile-sidebar shadow-lg">
      <div className="profile-header text-center">
        {user?.photo ? <img src={`http://localhost:5000/${user.photo}`} className="profile-avatar-img" alt="u" /> : <FaUserCircle className="profile-avatar" />}
        <h5 className="mt-2">{user?.name}</h5>
        <p className="text-muted small">{user?.email}</p>
      </div>
      <div className="profile-links">
        <Link to="/applications" className="profile-link" onClick={onClose}>📄 Applications</Link>
        <Link to="/my-internships" className="profile-link" onClick={onClose}>💼 My Internships</Link>
        <Link to="/view-profile" className="profile-link" onClick={onClose}>👤 View Profile</Link>
        <Link to="/edit-profile" className="profile-link" onClick={onClose}>✏️ Edit Profile</Link>
        <Link to="/notifications" className="profile-link" onClick={onClose}>🔔 Notifications</Link>
        <button className="profile-link text-danger" onClick={() => { onClose(); onLogout(); }}>🚪 Logout</button>
      </div>
    </div>
  );
}
