import { Suspense, useEffect, useRef } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import SmoothScroll from "./components/SmoothScroll";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Team from "./pages/Team";
import ProblemStatement from "./pages/ProblemStatement";
import Guidelines from "./pages/Guidelines";
import FAQPage from "./pages/FAQPage";
import ExternalRegistration from "./pages/ExternalRegistration";
import SingularityOverlay from "./components/singularity-transition/SingularityOverlay";
import { lazy } from "react";

const AdminLogin = lazy(() => import("./admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./admin/AdminDashboard"));

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default function App() {
  const { pathname } = useLocation();
  const showNavbar = !pathname.startsWith("/admin");
  const isHomePage = pathname === "/";

  return (
    <SmoothScroll>
      {/* Global cinematic transition overlay — above everything */}
      <SingularityOverlay />

      <Suspense
        fallback={
          <div className="min-h-screen bg-bg flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        {showNavbar && <Navbar />}
        <div className={showNavbar && !isHomePage ? "pt-16 md:pt-20" : ""}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/problem-statement" element={<ProblemStatement />} />
            <Route path="/team" element={<Team />} />
            <Route path="/guidelines" element={<Guidelines />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/external-registration" element={<ExternalRegistration />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Suspense>
    </SmoothScroll>
  );
}
