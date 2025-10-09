import React from "react";
import { Typography, Container, Button, Box } from "@mui/material";
import { Logout, Home } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <Container sx={{ textAlign: "center", mt: "20%" }}>
      <Typography variant="h3" color="error" gutterBottom>
        Not Authorized
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        You do not have permission to view this page.
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Please contact an administrator to get access.
      </Typography>
      <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
        <Button
          variant="outlined"
          startIcon={<Home />}
          onClick={() => navigate("/")}
        >
          Go to Home
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<Logout />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default UnauthorizedPage;
