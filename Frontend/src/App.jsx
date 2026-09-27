import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import PublicLayout from "./components/PublicLayout";
import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import { Loader } from "./components/ui";
import { dashboardPathFor, getStoredUser } from "./utils/auth";

// Pages are code-split so each route downloads only what it needs
const Home = lazy(() => import("./pages/Home"));
const Features = lazy(() => import("./pages/Features"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Companies = lazy(() => import("./pages/Companies"));
const Opportunities = lazy(() => import("./pages/Opportunities"));
const NotFound = lazy(() => import("./pages/NotFound"));

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));

const StudentDashboard = lazy(() => import("./pages/StudentDashboard"));
const Applications = lazy(() => import("./pages/Applications"));
const MyInternships = lazy(() => import("./pages/MyInternships"));
const InternshipDetail = lazy(() => import("./pages/InternshipDetail"));
const RecruiterDashboard = lazy(() => import("./pages/RecruiterDashboard"));
const PostInternship = lazy(() => import("./pages/PostInternship"));
const InternshipApplicants = lazy(() => import("./pages/InternshipApplicants"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const ViewProfile = lazy(() => import("./pages/ViewProfile"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const Notifications = lazy(() => import("./pages/Notifications"));

// Scroll to the top whenever the route changes
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function DashboardRedirect() {
  return <Navigate to={dashboardPathFor(getStoredUser()?.role)} replace />;
}

const only = (roles, page) => <ProtectedRoute roles={roles}>{page}</ProtectedRoute>;

function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<Loader page />}>
        <Routes>
          {/* Public website */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/internships" element={<Opportunities />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Authentication */}
          <Route
            path="/login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <Register />
              </GuestRoute>
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />

          {/* Signed-in area */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardRedirect />} />
            <Route path="/internships/:id" element={<InternshipDetail />} />
            <Route path="/view-profile" element={<ViewProfile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/notifications" element={<Notifications />} />

            <Route path="/student-dashboard" element={only(["student"], <StudentDashboard />)} />
            <Route path="/applications" element={only(["student"], <Applications />)} />
            <Route path="/my-internships" element={only(["student"], <MyInternships />)} />

            <Route path="/recruiter-dashboard" element={only(["recruiter"], <RecruiterDashboard />)} />
            <Route path="/recruiter/post-internship" element={only(["recruiter"], <PostInternship />)} />
            <Route
              path="/recruiter/internships/:id/applicants"
              element={only(["recruiter"], <InternshipApplicants />)}
            />

            <Route path="/admin-dashboard" element={only(["admin"], <AdminDashboard />)} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
