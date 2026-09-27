import { useEffect, useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { FaBriefcase, FaCheckCircle, FaFileAlt, FaSearch, FaUpload } from "react-icons/fa";
import API, { getErrorMessage } from "../api";
import InternshipCard from "../components/InternshipCard";
import { EmptyState, Loader, PageHeader } from "../components/ui";
import { useToast } from "../context/ToastContext";

const TYPES = ["Full-time", "Part-time", "Remote", "Hybrid"];

function StudentDashboard() {
  const { user } = useOutletContext();
  const { notify } = useToast();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [applyingId, setApplyingId] = useState(null);

  useEffect(() => {
    API.get("/internships")
      .then(({ data }) => setInternships(Array.isArray(data) ? data : []))
      .catch((err) => setError(getErrorMessage(err, "Unable to load internships. Please try again later.")))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return internships.filter((item) => {
      const matchesType = !type || item.type === type;
      const matchesQuery =
        !query ||
        [item.title, item.company, item.location, item.description, ...(item.skills || [])]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query));
      return matchesType && matchesQuery;
    });
  }, [internships, search, type]);

  const appliedCount = internships.filter((item) => item.applied).length;
  const acceptedCount = internships.filter((item) => item.applicationStatus === "accepted").length;
  const hasResume = Boolean(user?.resume);

  const handleApply = async (id) => {
    setApplyingId(id);
    try {
      const { data } = await API.post(`/applications/${id}/apply`);
      setInternships((current) =>
        current.map((item) =>
          item._id === id
            ? { ...item, applied: true, applicationStatus: "pending", applicationId: data.applicationId }
            : item
        )
      );
      notify("Application submitted successfully.", "success");
    } catch (err) {
      notify(getErrorMessage(err, "Could not submit your application."), "error");
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <>
      <PageHeader
        title="Find your next internship"
        subtitle="Discover opportunities that match your skills and interests."
      />

      <div className="stat-grid">
        <div className="stat-card ic-card">
          <span className="stat-icon">
            <FaBriefcase aria-hidden="true" />
          </span>
          <div>
            <span className="stat-value">{internships.length}</span>
            <span className="stat-label">Open internships</span>
          </div>
        </div>
        <div className="stat-card ic-card">
          <span className="stat-icon info">
            <FaFileAlt aria-hidden="true" />
          </span>
          <div>
            <span className="stat-value">{appliedCount}</span>
            <span className="stat-label">Applications sent</span>
          </div>
        </div>
        <div className="stat-card ic-card">
          <span className="stat-icon success">
            <FaCheckCircle aria-hidden="true" />
          </span>
          <div>
            <span className="stat-value">{acceptedCount}</span>
            <span className="stat-label">Offers received</span>
          </div>
        </div>
      </div>

      {user && !hasResume && (
        <div className="alert alert-warning d-flex align-items-center justify-content-between flex-wrap gap-2">
          <span>Upload your resume to start applying to internships.</span>
          <Link to="/edit-profile" className="btn btn-primary btn-sm">
            <FaUpload aria-hidden="true" /> Upload resume
          </Link>
        </div>
      )}

      <div className="toolbar">
        <div className="input-icon-group">
          <FaSearch className="input-icon" aria-hidden="true" />
          <input
            type="search"
            className="form-control"
            placeholder="Search by title, company, location or skill"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search internships"
          />
        </div>
        <select
          className="form-select"
          value={type}
          onChange={(event) => setType(event.target.value)}
          aria-label="Filter by type"
        >
          <option value="">All types</option>
          {TYPES.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loader label="Loading internships…" />
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="ic-card">
          <EmptyState
            icon={FaSearch}
            title="No internships found"
            message={
              search || type
                ? "Try adjusting your search or filter."
                : "Check back soon for new opportunities."
            }
          />
        </div>
      ) : (
        <div className="internship-grid">
          {filtered.map((internship) => (
            <InternshipCard
              key={internship._id}
              internship={internship}
              detailsTo={`/internships/${internship._id}`}
              action={
                internship.applied ? (
                  <Link to={`/internships/${internship._id}`} className="btn btn-light btn-sm">
                    View details
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => handleApply(internship._id)}
                    disabled={applyingId === internship._id || !hasResume}
                    title={hasResume ? undefined : "Upload your resume first"}
                  >
                    {applyingId === internship._id && (
                      <span className="spinner-border spinner-border-sm" aria-hidden="true" />
                    )}
                    {applyingId === internship._id ? "Applying…" : "Apply now"}
                  </button>
                )
              }
            />
          ))}
        </div>
      )}
    </>
  );
}

export default StudentDashboard;
