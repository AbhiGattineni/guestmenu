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
  Card,
  CardContent,
} from "@mui/material";
import { Login, ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * LoginPage Component
 * Dedicated login page for managers
 */
const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        // Navigate to admin panel on successful login
        navigate("/admin");
      } else {
        setError(result.error || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 3,
            background: "white",
            boxShadow: "0 16px 48px rgba(44,26,18,0.12)",
          }}
        >
          {/* Header */}
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
              Manager Login
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Access the admin panel to manage menu items
            </Typography>
          </Box>

          {/* Demo Info Alert */}
          <Alert severity="info" sx={{ mb: 3 }}>
            <strong>Demo Mode:</strong> Use any email and password to login
          </Alert>

          {/* Suggested Credentials Card */}
          <Card
            sx={{
              mb: 3,
              bgcolor: "secondary.light",
              border: "1px solid",
              borderColor: "secondary.main",
            }}
          >
            <CardContent sx={{ py: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, mb: 1, color: "primary.dark" }}
              >
                💡 Suggested Credentials:
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                Email: <strong>manager@restaurant.com</strong>
                <br />
                Password: <strong>admin123</strong>
              </Typography>
            </CardContent>
          </Card>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
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
              placeholder="manager@restaurant.com"
              autoFocus
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
              placeholder="Enter password"
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
                mb: 2,
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Login to Admin Panel"
              )}
            </Button>

            <Button
              variant="outlined"
              fullWidth
              startIcon={<ArrowBack />}
              onClick={() => navigate("/")}
              disabled={loading}
            >
              Back to Menu
            </Button>
          </form>

          {/* Additional Info */}
          <Box sx={{ mt: 4, pt: 3, borderTop: "1px solid #e0e0e0" }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", textAlign: "center" }}
            >
              After login, you can edit menu items, update prices, and manage
              categories
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
