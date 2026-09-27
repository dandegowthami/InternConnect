import { Link } from "react-router-dom";
import { FaBriefcase, FaCheck, FaClock, FaMapMarkerAlt, FaRupeeSign } from "react-icons/fa";
import { formatDate, truncate } from "../utils/format";

// Card used by the student dashboard and the public opportunities page
function InternshipCard({ internship, detailsTo, action }) {
  const {
    title,
    company,
    location,
    duration,
    stipend,
    type,
    skills = [],
    description,
    createdAt,
  } = internship;

  return (
    <article className="internship-card ic-card ic-card-hover">
      <div className="internship-card-head">
        <span className="company-logo" aria-hidden="true">
          {(company || "C").charAt(0).toUpperCase()}
        </span>
        <div className="internship-card-title">
          <h3>{detailsTo ? <Link to={detailsTo}>{title || "Untitled internship"}</Link> : title}</h3>
          <p>{company || "Unknown company"}</p>
        </div>
        {internship.applied && (
          <span className="status-badge status-accepted" title="You have applied">
            <FaCheck aria-hidden="true" /> Applied
          </span>
        )}
      </div>

      <ul className="internship-meta">
        {location && (
          <li>
            <FaMapMarkerAlt aria-hidden="true" /> {location}
          </li>
        )}
        {type && (
          <li>
            <FaBriefcase aria-hidden="true" /> {type}
          </li>
        )}
        {duration && (
          <li>
            <FaClock aria-hidden="true" /> {duration}
          </li>
        )}
        {stipend && (
          <li>
            <FaRupeeSign aria-hidden="true" /> {stipend}
          </li>
        )}
      </ul>

      <p className="internship-description">{truncate(description || "No description provided.", 150)}</p>

      {skills.length > 0 && (
        <div className="chip-list mb-3">
          {skills.slice(0, 4).map((skill, index) => (
            <span key={`${skill}-${index}`} className="chip">
              {skill}
            </span>
          ))}
          {skills.length > 4 && <span className="chip chip-muted">+{skills.length - 4}</span>}
        </div>
      )}

      <div className="internship-card-footer">
        <span className="posted-date">Posted {formatDate(createdAt)}</span>
        {action}
      </div>
    </article>
  );
}

export default InternshipCard;
