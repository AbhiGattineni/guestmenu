import React from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import CustomerMenu from "./pages/CustomerMenu";
import LoginPage from "./pages/LoginPage";
import ManagerDashboard from "./pages/ManagerDashboard";
import BannerManagementPage from "./pages/BannerManagementPage";
import SuperAdminDashboard from "./pages/SuperAdminDashboard.jsx";
import UnauthorizedPage from "./pages/UnauthorizedPage.jsx";
import withRoleProtection from "./auth/withRoleProtection.jsx";

const ProtectedManagerDashboard = withRoleProtection(ManagerDashboard, ['manager']);
const ProtectedSuperAdminDashboard = withRoleProtection(SuperAdminDashboard, ['superadmin']);

// Create a premium F&B themed palette and typography
const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#8C3A2B" }, // warm terracotta
    secondary: { main: "#F2C14E" }, // saffron gold
    background: { default: "#FAF7F2", paper: "#FFFFFF" },
    text: { primary: "#2C1A12", secondary: "#5A4940" },
  },
  typography: {
    fontFamily: [
      "Poppins",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h1: {
      fontFamily: "Playfair Display, serif",
      fontWeight: 700,
      letterSpacing: 0.2,
    },
    h2: {
      fontFamily: "Playfair Display, serif",
      fontWeight: 700,
      letterSpacing: 0.2,
    },
    h3: { fontFamily: "Playfair Display, serif", fontWeight: 700 },
    h4: { fontFamily: "Playfair Display, serif", fontWeight: 600 },
    button: { fontWeight: 600 },
  },
  shape: { borderRadius: 14 },
  shadows: [
    "none",
    "0px 2px 8px rgba(44,26,18,0.06)",
    "0px 4px 12px rgba(44,26,18,0.08)",
    "0px 8px 20px rgba(44,26,18,0.10)",
    ...Array(21).fill("0px 8px 24px rgba(44,26,18,0.10)"),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage:
            "radial-gradient(ellipse at top right, rgba(242,193,78,0.12), transparent 40%), radial-gradient(ellipse at bottom left, rgba(140,58,43,0.10), transparent 45%)",
        },
        "*::-webkit-scrollbar": { width: 10, height: 10 },
        "*::-webkit-scrollbar-thumb": {
          background: "#C8A97E",
          borderRadius: 8,
        },
        "*::-webkit-scrollbar-track": { background: "transparent" },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", borderRadius: 999, paddingInline: 18 },
        containedPrimary: {
          background: "linear-gradient(135deg, #8C3A2B 0%, #C66F53 100%)",
          boxShadow: "0 6px 18px rgba(140,58,43,0.25)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: "1px solid rgba(44,26,18,0.06)",
          boxShadow: "0 8px 24px rgba(44,26,18,0.08)",
          backgroundImage:
            "radial-gradient(circle at 20% 0%, rgba(242,193,78,0.08), transparent 40%)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 999, fontWeight: 600 },
        colorPrimary: { backgroundColor: "#C8A97E", color: "#2C1A12" },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Customer Routes */}
            <Route path="/" element={<CustomerMenu />} />

            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Protected Routes */}
            <Route path="/manager-dashboard" element={<ProtectedManagerDashboard />} />
            <Route path="/superadmin-dashboard" element={<ProtectedSuperAdminDashboard />} />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
