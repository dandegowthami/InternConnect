import React, { useState } from "react";

function Profile() {
  const [profile, setProfile] = useState({
    fullName: "John Doe",
    email: "student@example.com",
    education: "B.Tech CSE, 2nd Year",
    skills: "React, Python, Django",
    resume: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setProfile({
      ...profile,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile updated successfully & resume sent to recruiters!");
    console.log(profile);
  };

  return (
    <div>
      <h3>My Profile</h3>
      <form onSubmit={handleSubmit} className="profile-form">
        <label>Full Name</label>
        <input
          type="text"
          name="fullName"
          value={profile.fullName}
          onChange={handleChange}
          required
        />

        <label>Email</label>
        <input type="email" name="email" value={profile.email} readOnly />

        <label>Education</label>
        <input
          type="text"
          name="education"
          value={profile.education}
          onChange={handleChange}
        />

        <label>Skills</label>
        <input
          type="text"
          name="skills"
          value={profile.skills}
          onChange={handleChange}
        />

        <label>Upload Resume</label>
        <input type="file" name="resume" onChange={handleChange} />

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}

export default Profile;
