// src/pages/EditProfile.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/pages/Profile.css";
import { useNavigate } from "react-router-dom";

function EditProfile() {
  const [form, setForm] = useState({
    name: "",
    education: "",
    yearOfPassing: "",
    skills: "",
    interests: "",
    bio: "",
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/profile/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const u = res.data.user;
        setForm({
          name: u.name || "",
          education: u.education || "",
          yearOfPassing: u.yearOfPassing || "",
          skills: (u.skills || []).join(", "),
          interests: (u.interests || []).join(", "),
          bio: u.bio || "",
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, []);

  const educations = ["High School", "Diploma", "Bachelors", "Masters", "PhD", "Other"];

  const handleFile = (e, setter) => setter(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("education", form.education);
      fd.append("yearOfPassing", form.yearOfPassing);
      fd.append("skills", form.skills);
      fd.append("interests", form.interests);
      fd.append("bio", form.bio);
      if (photoFile) fd.append("photo", photoFile);
      if (resumeFile) fd.append("resume", resumeFile);

      const res = await axios.put("http://localhost:5000/api/profile/update", fd, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      alert("Profile updated");
      navigate("/view-profile");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <div className="container edit-profile p-4">
      <h3>Edit Profile</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Full name</label>
          <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        </div>

        <div className="mb-3">
          <label>Education</label>
          <select className="form-select" value={form.education} onChange={e => setForm({ ...form, education: e.target.value })}>
            <option value="">Select</option>
            {educations.map((ed) => <option key={ed} value={ed}>{ed}</option>)}
          </select>
        </div>

        <div className="mb-3">
          <label>Year of passing</label>
          <input className="form-control" value={form.yearOfPassing} onChange={e => setForm({ ...form, yearOfPassing: e.target.value })} />
        </div>

        <div className="mb-3">
          <label>Skills (comma separated)</label>
          <input className="form-control" value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} />
        </div>

        <div className="mb-3">
          <label>Interests (comma separated)</label>
          <input className="form-control" value={form.interests} onChange={e => setForm({ ...form, interests: e.target.value })} />
        </div>

        <div className="mb-3">
          <label>Bio</label>
          <textarea className="form-control" rows="3" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })}></textarea>
        </div>

        <div className="mb-3">
          <label>Profile Photo (jpg/png)</label>
          <input type="file" accept="image/*" onChange={e => handleFile(e, setPhotoFile)} className="form-control" />
        </div>

        <div className="mb-3">
          <label>Resume (pdf)</label>
          <input type="file" accept=".pdf" onChange={e => handleFile(e, setResumeFile)} className="form-control" />
        </div>

        <button className="btn btn-primary">Save</button>
      </form>
    </div>
  );
}

export default EditProfile;
