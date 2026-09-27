import { Navigate, useLocation } from "react-router-dom";
import { clearSession, dashboardPathFor, getStoredUser, hasValidSession } from "../utils/auth";

// Guards a route by login state and, optionally, by role(s)
function ProtectedRoute({ children, roles }) {
  const location = useLocation();

  if (!hasValidSession()) {
    // Drop incomplete or corrupted sessions so login starts clean
    clearSession();
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  const { role } = getStoredUser();
  if (roles && !roles.includes(role)) {
    return <Navigate to={dashboardPathFor(role)} replace />;
  }

  return children;
}

export default ProtectedRoute;
