import React, { useState } from "react";

function ProfileForm({ student, setStudent }) {
  const [formData, setFormData] = useState(student);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = e => {
    setFormData({ ...formData, resume: e.target.files[0] });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setStudent(formData);
    alert("Profile updated successfully!");
  };

  return (
    <form onSubmit={handleSubmit} className="profile-form p-4 bg-light rounded shadow-sm">
      <div className="mb-3">
        <label className="form-label">Education</label>
        <input type="text" className="form-control" name="education" value={formData.education} onChange={handleChange} />
      </div>

      <div className="mb-3">
        <label className="form-label">Passing Year</label>
        <input type="number" className="form-control" name="passedYear" value={formData.passedYear} onChange={handleChange} />
      </div>

      <div className="mb-3">
        <label className="form-label">Resume</label>
        <input type="file" className="form-control" name="resume" onChange={handleFileChange} />
        {formData.resume && <p className="mt-2">Selected File: {formData.resume.name}</p>}
      </div>

      <div className="mb-3">
        <label className="form-label">Interested Domains (comma separated)</label>
        <input type="text" className="form-control" name="domains" value={formData.domains.join(", ")} onChange={e => setFormData({ ...formData, domains: e.target.value.split(",").map(d => d.trim()) })} />
      </div>

      <div className="mb-3">
        <label className="form-label">Skills (comma separated)</label>
        <input type="text" className="form-control" name="skills" value={formData.skills.join(", ")} onChange={e => setFormData({ ...formData, skills: e.target.value.split(",").map(s => s.trim()) })} />
      </div>

      <button type="submit" className="btn btn-primary">Update Profile</button>
    </form>
  );
}

export default ProfileForm;
