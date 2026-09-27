import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBriefcase, FaListUl } from "react-icons/fa";
import API, { getErrorMessage } from "../api";
import { PageHeader } from "../components/ui";
import { useToast } from "../context/ToastContext";
import { splitList } from "../utils/format";

const TYPES = ["Full-time", "Part-time", "Remote", "Hybrid"];

const EMPTY_FORM = {
  title: "",
  company: "",
  location: "",
  type: "Full-time",
  duration: "",
  stipend: "",
  skills: "",
  description: "",
};

function PostInternship() {
  const navigate = useNavigate();
  const { notify } = useToast();
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await API.post("/recruiter/internships", { ...form, skills: splitList(form.skills) });
      notify("Internship posted successfully.", "success");
      navigate("/recruiter-dashboard");
    } catch (err) {
      notify(getErrorMessage(err, "Failed to post internship."), "error");
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Post an internship"
        subtitle="Describe the role clearly to attract the right candidates."
      />

      <form onSubmit={handleSubmit}>
        <section className="ic-card ic-card-body form-card">
          <h2 className="form-card-title">
            <FaBriefcase aria-hidden="true" /> Role details
          </h2>
          <p className="form-card-subtitle">Fields marked with * are required.</p>

          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="title" className="form-label">
                Internship title *
              </label>
              <input
                id="title"
                name="title"
                className="form-control"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Frontend Developer Intern"
                required
                disabled={saving}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="company" className="form-label">
                Company name *
              </label>
              <input
                id="company"
                name="company"
                className="form-control"
                value={form.company}
                onChange={handleChange}
                placeholder="e.g. TechNova"
                required
                disabled={saving}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="location" className="form-label">
                Location *
              </label>
              <input
                id="location"
                name="location"
                className="form-control"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Bengaluru or Remote"
                required
                disabled={saving}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="type" className="form-label">
                Work type
              </label>
              <select
                id="type"
                name="type"
                className="form-select"
                value={form.type}
                onChange={handleChange}
                disabled={saving}
              >
                {TYPES.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="duration" className="form-label">
                Duration
              </label>
              <input
                id="duration"
                name="duration"
                className="form-control"
                value={form.duration}
                onChange={handleChange}
                placeholder="e.g. 3 months"
                disabled={saving}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="stipend" className="form-label">
                Stipend
              </label>
              <input
                id="stipend"
                name="stipend"
                className="form-control"
                value={form.stipend}
                onChange={handleChange}
                placeholder="e.g. ₹10,000 / month"
                disabled={saving}
              />
            </div>
          </div>
        </section>

        <section className="ic-card ic-card-body form-card">
          <h2 className="form-card-title">
            <FaListUl aria-hidden="true" /> Description &amp; requirements
          </h2>
          <p className="form-card-subtitle">
            Explain responsibilities, requirements and what the intern will learn.
          </p>

          <div className="row g-3">
            <div className="col-12">
              <label htmlFor="skills" className="form-label">
                Required skills
              </label>
              <input
                id="skills"
                name="skills"
                className="form-control"
                value={form.skills}
                onChange={handleChange}
                placeholder="React, CSS, Git (separate with commas)"
                disabled={saving}
              />
            </div>
            <div className="col-12">
              <label htmlFor="description" className="form-label">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={7}
                className="form-control"
                value={form.description}
                onChange={handleChange}
                placeholder="Responsibilities, requirements, perks…"
                required
                disabled={saving}
              />
            </div>
          </div>
        </section>

        <div className="form-footer">
          <button
            type="button"
            className="btn btn-light"
            onClick={() => navigate("/recruiter-dashboard")}
            disabled={saving}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving && <span className="spinner-border spinner-border-sm" aria-hidden="true" />}
            {saving ? "Posting…" : "Publish internship"}
          </button>
        </div>
      </form>
    </>
  );
}

export default PostInternship;
