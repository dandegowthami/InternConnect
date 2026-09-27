import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaBriefcase } from "react-icons/fa";
import API, { getErrorMessage } from "../api";
import InternshipCard from "../components/InternshipCard";
import { EmptyState, Loader } from "../components/ui";
import { hasValidSession } from "../utils/auth";
import "../styles/public.css";
import "../styles/dashboard.css";

const TYPES = ["Full-time", "Part-time", "Remote", "Hybrid"];

function Opportunities() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const signedIn = hasValidSession();

  useEffect(() => {
    API.get("/internships/public")
      .then(({ data }) => setInternships(Array.isArray(data) ? data : []))
      .catch((err) => setError(getErrorMessage(err, "Unable to load internships right now.")))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return internships.filter((item) => {
      const matchesType = !type || item.type === type;
      const matchesQuery =
        !query ||
        [item.title, item.company, item.location, ...(item.skills || [])]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query));
      return matchesType && matchesQuery;
    });
  }, [internships, search, type]);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Internships</span>
          <h1>Explore opportunities</h1>
          <p>Browse the latest internships from companies hiring on InternConnect.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="listing-toolbar">
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
                icon={FaBriefcase}
                title="No internships found"
                message={
                  search || type
                    ? "Try a different search or filter."
                    : "New opportunities are posted regularly — check back soon."
                }
              />
            </div>
          ) : (
            <>
              <p className="listing-count">
                Showing {filtered.length} of {internships.length} internships
              </p>
              <div className="internship-grid">
                {filtered.map((internship) => (
                  <InternshipCard
                    key={internship._id}
                    internship={internship}
                    action={
                      <Link
                        to={signedIn ? `/internships/${internship._id}` : "/login"}
                        state={signedIn ? undefined : { from: `/internships/${internship._id}` }}
                        className="btn btn-primary btn-sm"
                      >
                        {signedIn ? "View & apply" : "Sign in to apply"}
                      </Link>
                    }
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

export default Opportunities;
