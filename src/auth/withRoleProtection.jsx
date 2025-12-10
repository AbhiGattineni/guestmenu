import React from "react";
import { Navigate } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext"; // Assuming you have an AuthContext

const withRoleProtection = (WrappedComponent, allowedRoles) => {
  return (props) => {
    const { currentUser, userRole, loading } = useAuth(); // Hooks to get user and role

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
      return <Navigate to="/login" replace />;
    }

    // User is logged in but role hasn't loaded yet - wait
    if (currentUser && !userRole) {
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
      return <Navigate to="/unauthorized" replace />;
    }

    // User has correct role - render component
    return <WrappedComponent {...props} />;
  };
};

export default withRoleProtection;
