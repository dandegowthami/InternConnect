const TOKEN_KEY = "token";
const USER_KEY = "user";

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
};

export const saveSession = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const updateStoredUser = (user) => {
  const current = getStoredUser() || {};
  localStorage.setItem(
    USER_KEY,
    JSON.stringify({
      ...current,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      photo: user.photo,
      resume: user.resume,
    })
  );
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const isAuthenticated = () => Boolean(getToken() && getStoredUser());

export const ROLES = ["student", "recruiter", "admin"];

// A session is only usable if it has a token and a recognised role
export const hasValidSession = () => isAuthenticated() && ROLES.includes(getStoredUser()?.role);

export const dashboardPathFor = (role) => {
  if (role === "recruiter") return "/recruiter-dashboard";
  if (role === "admin") return "/admin-dashboard";
  if (role === "student") return "/student-dashboard";
  return "/login";
};

// Ends the session and returns to the home page. replace() keeps the dashboard
// out of browser history, so Back cannot reopen it.
export const logout = () => {
  clearSession();
  window.location.replace("/");
};
