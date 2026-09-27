import { Navigate } from "react-router-dom";
import { dashboardPathFor, getStoredUser, hasValidSession } from "../utils/auth";

// Login/register pages: signed-in users are sent straight to their dashboard
function GuestRoute({ children }) {
  if (hasValidSession()) {
    return <Navigate to={dashboardPathFor(getStoredUser().role)} replace />;
  }
  return children;
}

export default GuestRoute;
