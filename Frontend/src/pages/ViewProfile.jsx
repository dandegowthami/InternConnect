// src/pages/ViewProfile.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/pages/Profile.css";

function ViewProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/profile/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, []);

  if (!user) return <div className="p-4">Loading...</div>;

  return (
    <div className="container view-profile p-4">
      <div className="row">
        <div className="col-md-4 text-center">
          {user.photo ? (
            <img src={`http://localhost:5000/${user.photo}`} alt="avatar" className="profile-photo" />
          ) : (
            <div className="profile-placeholder">No Photo</div>
          )}
          <h3 className="mt-2">{user.name}</h3>
          <p className="text-muted">{user.email}</p>
          {user.resume && (
            <a href={`http://localhost:5000/${user.resume}`} className="btn btn-outline-primary" download>
              Download Resume
            </a>
          )}
        </div>

        <div className="col-md-8">
          <h4>About</h4>
          <p>{user.bio || "No bio provided."}</p>

          <h5>Education</h5>
          <p>{user.education || "-"}</p>

          <h5>Year of Passing</h5>
          <p>{user.yearOfPassing || "-"}</p>

          <h5>Skills</h5>
          <p>{(user.skills || []).join(", ") || "-"}</p>

          <h5>Interests</h5>
          <p>{(user.interests || []).join(", ") || "-"}</p>
        </div>
      </div>
    </div>
  );
}

export default ViewProfile;
