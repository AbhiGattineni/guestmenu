import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Login } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { login, currentUser, userRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Wait for auth to finish loading before making redirect decisions
    if (authLoading) {
      console.log("⏳ LoginPage: Auth still loading...");
      return;
    }

    // Only redirect if user is logged in and role is loaded
    // Don't redirect to unauthorized - let withRoleProtection handle that
    if (currentUser && userRole) {
      console.log("🔄 LoginPage: Redirecting user with role:", userRole);
      if (userRole === "manager") {
        console.log("➡️ Navigating to: /manager-dashboard");
        navigate("/manager-dashboard", { replace: true });
      } else if (userRole === "superadmin") {
        console.log("➡️ Navigating to: /superadmin-dashboard");
        navigate("/superadmin-dashboard", { replace: true });
      } else {
        console.log("⚠️ Unknown role, navigating to: /unauthorized");
        navigate("/unauthorized", { replace: true });
      }
    }
  }, [currentUser, userRole, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError("Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  // Show loading screen while auth is initializing
  if (authLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #FDF7F0 0%, #FAEEDD 50%, #F5E6D3 100%)",
          gap: 2,
        }}
      >
        <CircularProgress size={60} sx={{ color: "primary.main" }} />
        <Typography variant="h6" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #FDF7F0 0%, #FAEEDD 50%, #F5E6D3 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 3,
            background: "white",
            boxShadow: "0 16px 48px rgba(44,26,18,0.12)",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #8C3A2B 0%, #C66F53 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px auto",
                boxShadow: "0 8px 24px rgba(140,58,43,0.3)",
              }}
            >
              <Login sx={{ fontSize: 40, color: "white" }} />
            </Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "primary.dark", mb: 1 }}
            >
              Login
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
