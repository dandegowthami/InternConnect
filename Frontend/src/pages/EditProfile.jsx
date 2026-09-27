import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { FaCamera, FaCheck, FaCode, FaFilePdf, FaGraduationCap, FaUser } from "react-icons/fa";
import API, { fileUrl, getErrorMessage } from "../api";
import { Avatar, Loader, PageHeader } from "../components/ui";
import { useToast } from "../context/ToastContext";
import { splitList } from "../utils/format";

const EDUCATION_LEVELS = ["High School", "Diploma", "Bachelors", "Masters", "PhD", "Other"];
const MAX_PHOTO_SIZE = 5 * 1024 * 1024;
const MAX_RESUME_SIZE = 10 * 1024 * 1024;
const MAX_BIO = 500;

const toForm = (user) => ({
  name: user?.name || "",
  education: user?.education || "",
  yearOfPassing: user?.yearOfPassing || "",
  skills: (user?.skills || []).join(", "),
  interests: (user?.interests || []).join(", "),
  bio: user?.bio || "",
});

function EditProfile() {
  const navigate = useNavigate();
  const { user, refreshUser } = useOutletContext();
  const { notify } = useToast();
  const [form, setForm] = useState(() => toForm(user));
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Load the full profile (the cached user may be missing fields)
  useEffect(() => {
    let active = true;
    refreshUser().then((fresh) => {
      if (active && fresh) setForm(toForm(fresh));
    });
    return () => {
      active = false;
    };
  }, [refreshUser]);

  // Release the object URL used for the photo preview
  useEffect(() => () => photoPreview && URL.revokeObjectURL(photoPreview), [photoPreview]);

  if (!user) return <Loader label="Loading your profile…" page />;

  const isStudent = user.role === "student";
  const currentYear = new Date().getFullYear();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: "" }));
  };

  const handlePhoto = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setErrors((current) => ({ ...current, photo: "Please choose a JPG, PNG or WEBP image." }));
      return;
    }
    if (file.size > MAX_PHOTO_SIZE) {
      setErrors((current) => ({ ...current, photo: "Image must be smaller than 5MB." }));
      return;
    }
    setErrors((current) => ({ ...current, photo: "" }));
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleResume = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.type !== "application/pdf") {
      setErrors((current) => ({ ...current, resume: "Please choose a PDF file." }));
      return;
    }
    if (file.size > MAX_RESUME_SIZE) {
      setErrors((current) => ({ ...current, resume: "Resume must be smaller than 10MB." }));
      return;
    }
    setErrors((current) => ({ ...current, resume: "" }));
    setResumeFile(file);
  };

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = "Name must be at least 2 characters.";
    if (form.yearOfPassing) {
      const year = Number(form.yearOfPassing);
      if (!Number.isInteger(year) || year < 1950 || year > currentYear + 6) {
        next.yearOfPassing = `Enter a year between 1950 and ${currentYear + 6}.`;
      }
    }
    if (form.bio.length > MAX_BIO) next.bio = `Bio must be ${MAX_BIO} characters or fewer.`;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    const data = new FormData();
    data.append("name", form.name.trim());
    data.append("bio", form.bio.trim());
    if (isStudent) {
      data.append("education", form.education);
      data.append("yearOfPassing", form.yearOfPassing);
      data.append("skills", JSON.stringify(splitList(form.skills)));
      data.append("interests", JSON.stringify(splitList(form.interests)));
    } else {
      data.append("skills", JSON.stringify(user.skills || []));
      data.append("interests", JSON.stringify(user.interests || []));
    }
    if (photoFile) data.append("photo", photoFile);
    if (resumeFile) data.append("resume", resumeFile);

    setSaving(true);
    try {
      await API.put("/profile/update", data);
      await refreshUser();
      notify("Profile updated successfully.", "success");
      navigate("/view-profile");
    } catch (err) {
      notify(getErrorMessage(err, "Could not update your profile."), "error");
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Edit profile"
        subtitle="Keep your information up to date so recruiters get the full picture."
      />

      <form onSubmit={handleSubmit} noValidate>
        <section className="ic-card ic-card-body form-card">
          <h2 className="form-card-title">
            <FaUser aria-hidden="true" /> Personal information
          </h2>
          <p className="form-card-subtitle">Your name and photo are visible to recruiters.</p>

          <div className="photo-upload mb-4">
            {photoPreview ? (
              <span className="avatar avatar-xl">
                <img src={photoPreview} alt="New profile preview" />
              </span>
            ) : (
              <Avatar user={user} size="xl" />
            )}
            <div>
              <label className="btn btn-light mb-1">
                <FaCamera aria-hidden="true" /> {user.photo || photoPreview ? "Change photo" : "Upload photo"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhoto}
                  hidden
                  disabled={saving}
                />
              </label>
              <div className="form-text">JPG, PNG or WEBP. Max 5MB.</div>
              {errors.photo && <div className="text-danger small mt-1">{errors.photo}</div>}
            </div>
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="name" className="form-label">
                Full name
              </label>
              <input
                id="name"
                name="name"
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                value={form.name}
                onChange={handleChange}
                disabled={saving}
                required
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>
            <div className="col-md-6">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input id="email" className="form-control" value={user.email} disabled readOnly />
            </div>
            <div className="col-12">
              <label htmlFor="bio" className="form-label">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                className={`form-control ${errors.bio ? "is-invalid" : ""}`}
                value={form.bio}
                onChange={handleChange}
                placeholder={
                  isStudent
                    ? "Tell recruiters about yourself, your goals and what you're passionate about."
                    : "Tell candidates about yourself and the teams you hire for."
                }
                maxLength={MAX_BIO}
                disabled={saving}
              />
              <div className="d-flex justify-content-between">
                {errors.bio ? <div className="text-danger small">{errors.bio}</div> : <span />}
                <span className="form-text">
                  {form.bio.length}/{MAX_BIO}
                </span>
              </div>
            </div>
          </div>
        </section>

        {isStudent && (
          <>
            <section className="ic-card ic-card-body form-card">
              <h2 className="form-card-title">
                <FaGraduationCap aria-hidden="true" /> Education
              </h2>
              <p className="form-card-subtitle">Your current or most recent qualification.</p>
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="education" className="form-label">
                    Education level
                  </label>
                  <select
                    id="education"
                    name="education"
                    className="form-select"
                    value={form.education}
                    onChange={handleChange}
                    disabled={saving}
                  >
                    <option value="">Select education level</option>
                    {EDUCATION_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                    {form.education && !EDUCATION_LEVELS.includes(form.education) && (
                      <option value={form.education}>{form.education}</option>
                    )}
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="yearOfPassing" className="form-label">
                    Year of passing
                  </label>
                  <input
                    id="yearOfPassing"
                    name="yearOfPassing"
                    type="number"
                    min={1950}
                    max={currentYear + 6}
                    className={`form-control ${errors.yearOfPassing ? "is-invalid" : ""}`}
                    value={form.yearOfPassing}
                    onChange={handleChange}
                    placeholder={`e.g. ${currentYear + 1}`}
                    disabled={saving}
                  />
                  {errors.yearOfPassing && <div className="invalid-feedback">{errors.yearOfPassing}</div>}
                </div>
              </div>
            </section>

            <section className="ic-card ic-card-body form-card">
              <h2 className="form-card-title">
                <FaCode aria-hidden="true" /> Skills &amp; interests
              </h2>
              <p className="form-card-subtitle">Separate multiple entries with commas.</p>
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="skills" className="form-label">
                    Skills
                  </label>
                  <input
                    id="skills"
                    name="skills"
                    className="form-control"
                    value={form.skills}
                    onChange={handleChange}
                    placeholder="JavaScript, React, Node.js"
                    disabled={saving}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="interests" className="form-label">
                    Interests
                  </label>
                  <input
                    id="interests"
                    name="interests"
                    className="form-control"
                    value={form.interests}
                    onChange={handleChange}
                    placeholder="Web development, Data science"
                    disabled={saving}
                  />
                </div>
              </div>
            </section>

            <section className="ic-card ic-card-body form-card">
              <h2 className="form-card-title">
                <FaFilePdf aria-hidden="true" /> Resume
              </h2>
              <p className="form-card-subtitle">Your resume is shared with recruiters when you apply.</p>
              <label className="file-drop">
                <input type="file" accept="application/pdf" onChange={handleResume} disabled={saving} />
                <span className="file-drop-icon">
                  <FaFilePdf aria-hidden="true" />
                </span>
                <span>
                  <strong>
                    {resumeFile
                      ? resumeFile.name
                      : user.resume
                        ? "Replace your resume"
                        : "Upload your resume"}
                  </strong>
                  <small>PDF only, up to 10MB</small>
                </span>
              </label>
              {errors.resume && <div className="text-danger small mt-2">{errors.resume}</div>}
              {user.resume && !resumeFile && (
                <div className="file-status">
                  <FaCheck aria-hidden="true" /> Resume on file —{" "}
                  <a href={fileUrl(user.resume)} target="_blank" rel="noopener noreferrer">
                    view current
                  </a>
                </div>
              )}
              {resumeFile && (
                <div className="file-status">
                  <FaCheck aria-hidden="true" /> Ready to upload when you save
                </div>
              )}
            </section>
          </>
        )}

        <div className="form-footer">
          <button
            type="button"
            className="btn btn-light"
            onClick={() => navigate("/view-profile")}
            disabled={saving}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving && <span className="spinner-border spinner-border-sm" aria-hidden="true" />}
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </>
  );
}

export default EditProfile;
