import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { getDoc, doc, getFirestore } from "firebase/firestore";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import OnboardingPage from "./pages/OnboardingPage";

// User Dashboard Pages
import DashboardPage from "./pages/DashboardPage";
import MenuBuilderPage from "./pages/MenuBuilderPage";
import SubmissionsPage from "./pages/SubmissionsPage";
import SettingsPage from "./pages/SettingsPage";

// Guest Pages
import PublicMenuPage from "./pages/PublicMenuPage";
import GuestSubmissionPage from "./pages/GuestSubmissionPage";

// Admin Pages
import SuperAdminDashboard from "./pages/SuperAdminDashboard";

// Error Pages
import NotFoundPage from "./pages/NotFoundPage";

// Loading Component
const LoadingScreen = () => (
  <div className="flex items-center justify-center h-screen bg-gray-100">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, isEmailVerified } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isEmailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

// Public Route Component (redirects to dashboard if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, isSuperAdminUser } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    // Redirect super admin to super admin dashboard
    if (isSuperAdminUser) {
      return <Navigate to="/super-admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Subdomain detection and routing component
const SubdomainHandler = () => {
  const [subdomain, setSubdomain] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const detectSubdomain = async () => {
      const hostname = window.location.hostname;
      const parts = hostname.split(".");

      // Check if we're on a subdomain (not main domain)
      // localhost: abhiguest.localhost
      // production: abhiguest.guestmenu.com

      let detectedSubdomain = null;

      if (hostname.includes(".localhost")) {
        // Development: abhiguest.localhost
        const subdomainPart = parts[0];
        if (
          subdomainPart &&
          subdomainPart !== "localhost" &&
          subdomainPart !== "www"
        ) {
          detectedSubdomain = subdomainPart;
        }
      } else if (parts.length >= 3) {
        // Production: abhiguest.guestmenu.com
        const subdomainPart = parts[0];
        if (subdomainPart && subdomainPart !== "www") {
          detectedSubdomain = subdomainPart;
        }
      }

      if (detectedSubdomain) {
        setSubdomain(detectedSubdomain);

        // Fetch userId from subdomain
        try {
          const db = getFirestore();
          const subdomainDoc = await getDoc(
            doc(db, "subdomains", detectedSubdomain)
          );

          if (subdomainDoc.exists()) {
            setUserId(subdomainDoc.data().userId);
          }
        } catch (error) {
          console.error("Error fetching subdomain data:", error);
        }
      }

      setLoading(false);
    };

    detectSubdomain();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  // If subdomain detected, show public menu (even if userId is null for 404)
  if (subdomain) {
    return <PublicMenuPage subdomain={subdomain} userId={userId} />;
  }

  // Otherwise, show regular app routes
  return <AppRoutes />;
};

const AppRoutes = () => {
  const { isAuthenticated, isEmailVerified, loading, isSuperAdminUser } =
    useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {/* Home Route */}
      <Route path="/" element={<HomePage />} />

      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        }
      />

      {/* Email Verification Route */}
      <Route
        path="/verify-email"
        element={
          isAuthenticated ? <EmailVerificationPage /> : <Navigate to="/login" />
        }
      />

      {/* Onboarding Route */}
      <Route
        path="/onboarding"
        element={
          isAuthenticated && isEmailVerified ? (
            <OnboardingPage />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* Super Admin Route */}
      <Route
        path="/super-admin"
        element={
          isAuthenticated && isEmailVerified ? (
            <SuperAdminDashboard />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Protected User Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/menu/:menuId"
        element={
          <ProtectedRoute>
            <MenuBuilderPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/submissions/:menuId"
        element={
          <ProtectedRoute>
            <SubmissionsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      {/* Guest Routes (Public) */}
      <Route path="/menu/:subdomain" element={<PublicMenuPage />} />
      <Route path="/menu/:subdomain/submit" element={<GuestSubmissionPage />} />

      {/* Dashboard Route (authenticated users) */}
      <Route
        path="/dashboard-redirect"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <SubdomainHandler />
      </AuthProvider>
    </Router>
  );
}

export default App;
