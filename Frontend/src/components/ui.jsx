import { Link } from "react-router-dom";
import { fileUrl } from "../api";
import { initials } from "../utils/format";

export function Logo({ to = "/", light = false }) {
  return (
    <Link to={to} className={`brand-logo ${light ? "brand-logo-light" : ""}`} aria-label="InternConnect home">
      <span className="brand-mark">IC</span>
      <span className="brand-name">InternConnect</span>
    </Link>
  );
}

export function Loader({ label = "Loading…", page = false }) {
  return (
    <div className={`loader ${page ? "loader-page" : ""}`} role="status">
      <div className="spinner-border" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="empty-state">
      {Icon && (
        <div className="empty-state-icon">
          <Icon aria-hidden="true" />
        </div>
      )}
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {action}
    </div>
  );
}

export function StatusBadge({ status }) {
  const value = (status || "pending").toLowerCase();
  const known = ["pending", "accepted", "rejected"].includes(value);
  return <span className={`status-badge ${known ? `status-${value}` : "status-neutral"}`}>{value}</span>;
}

export function Avatar({ user, size = "", className = "" }) {
  const sizeClass = size ? `avatar-${size}` : "";
  return (
    <span className={`avatar ${sizeClass} ${className}`}>
      {user?.photo ? <img src={fileUrl(user.photo)} alt={user.name || "Profile"} /> : initials(user?.name)}
    </span>
  );
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {actions && <div className="page-header-actions">{actions}</div>}
    </div>
  );
}
