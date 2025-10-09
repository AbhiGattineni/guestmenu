import React from "react";
import { Navigate } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext"; // Assuming you have an AuthContext

const withRoleProtection = (WrappedComponent, allowedRoles) => {
  return (props) => {
    const { currentUser, userRole, loading } = useAuth(); // Hooks to get user and role

    console.log("🔒 withRoleProtection check:", {
      user: currentUser?.email,
      userRole,
      allowedRoles,
      loading,
      isAllowed: allowedRoles.includes(userRole),
    });

    // Show loading while auth state is being determined
    if (loading) {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            backgroundColor: "background.default",
            gap: 2,
          }}
        >
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            Loading...
          </Typography>
        </Box>
      );
    }

    // Not logged in - redirect to login
    if (!currentUser) {
      console.log("❌ No user logged in, redirecting to /login");
      return <Navigate to="/login" replace />;
    }

    // User is logged in but role hasn't loaded yet - wait
    if (currentUser && !userRole) {
      console.log("⏳ User logged in but role not loaded yet, waiting...");
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            backgroundColor: "background.default",
            gap: 2,
          }}
        >
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            Loading your profile...
          </Typography>
        </Box>
      );
    }

    // User has role but not in allowed roles
    if (!allowedRoles.includes(userRole)) {
      console.log(
        "🚫 Access denied! User role:",
        userRole,
        "Allowed roles:",
        allowedRoles
      );
      return <Navigate to="/unauthorized" replace />;
    }

    // User has correct role - render component
    console.log("✅ Access granted! Rendering component for role:", userRole);
    return <WrappedComponent {...props} />;
  };
};

export default withRoleProtection;
