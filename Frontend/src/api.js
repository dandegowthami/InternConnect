import axios from "axios";
import { clearSession, getToken } from "./utils/auth";

// Backend origin; override with VITE_API_URL in Frontend/.env
export const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

const API = axios.create({ baseURL: `${API_BASE_URL}/api` });

// Attach the JWT to every request
API.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// An expired or invalid session sends the user back to login
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && getToken()) {
      clearSession();
      window.location.assign("/login?expired=true");
    }
    return Promise.reject(error);
  }
);

// Builds an absolute URL for files served from /uploads
export const fileUrl = (storedPath) => {
  if (!storedPath) return "";
  if (/^https?:\/\//.test(storedPath)) return storedPath;
  return `${API_BASE_URL}${storedPath.startsWith("/") ? "" : "/"}${storedPath}`;
};

export const getErrorMessage = (error, fallback = "Something went wrong. Please try again.") => {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.request && !error.response) return "Unable to reach the server. Please check your connection.";
  return fallback;
};

export default API;
