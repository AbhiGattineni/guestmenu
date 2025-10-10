import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Tabs,
  Tab,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Dashboard,
  People,
  Store,
  Restaurant,
  Image,
  Logout,
  Home,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Import tab components
import AnalyticsTab from "../components/superadmin/AnalyticsTab";
import UsersTab from "../components/superadmin/UsersTab";
import StoresTab from "../components/superadmin/StoresTab";
import BannersTab from "../components/superadmin/BannersTab";
import MenuTab from "../components/superadmin/MenuTab";

/**
 * TabPanel Component
 */
function TabPanel({ children, value, index }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

/**
 * Super Admin Dashboard
 * Comprehensive dashboard with Analytics, User Management, Store Management, and Menu Management
 */
const SuperAdminDashboard = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const tabs = [
    { label: "Analytics", icon: <Dashboard />, component: <AnalyticsTab /> },
    { label: "Users", icon: <People />, component: <UsersTab /> },
    { label: "Stores", icon: <Store />, component: <StoresTab /> },
    { label: "Banners", icon: <Image />, component: <BannersTab /> },
    { label: "Menu", icon: <Restaurant />, component: <MenuTab /> },
  ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* App Bar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "linear-gradient(135deg, #2C1A12 0%, #3D2817 100%)",
          borderBottom: "1px solid rgba(242, 193, 78, 0.1)",
        }}
      >
        <Toolbar sx={{ py: { xs: 1, sm: 1.5 }, px: { xs: 1, sm: 2 } }}>
          {/* Left side - Title */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
              minWidth: 0,
            }}
          >
            <Dashboard
              sx={{
                color: "#F2C14E",
                mr: { xs: 1, sm: 2 },
                fontSize: { xs: 28, sm: 36 },
                flexShrink: 0,
              }}
            />
            <Box sx={{ minWidth: 0, overflow: "hidden" }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "white",
                  fontSize: { xs: "0.875rem", sm: "1.25rem" },
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                <Box
                  component="span"
                  sx={{ display: { xs: "none", md: "inline" } }}
                >
                  Super Admin Dashboard
                </Box>
                <Box
                  component="span"
                  sx={{ display: { xs: "inline", md: "none" } }}
                >
                  Admin
                </Box>
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "#F2C14E",
                  display: { xs: "none", sm: "block" },
                }}
              >
                {currentUser?.email}
              </Typography>
            </Box>
          </Box>

          {/* Right side - Buttons */}
          <Box sx={{ display: "flex", gap: { xs: 0.5, sm: 1.5 } }}>
            <Button
              startIcon={<Home sx={{ display: { xs: "none", sm: "block" } }} />}
              onClick={() => navigate("/")}
              variant="outlined"
              sx={{
                color: "white",
                borderColor: "rgba(242, 193, 78, 0.3)",
                px: { xs: 1, sm: 2.5 },
                minWidth: { xs: "auto", sm: "auto" },
                "&:hover": {
                  borderColor: "#F2C14E",
                  bgcolor: "rgba(242, 193, 78, 0.08)",
                },
              }}
            >
              <Home sx={{ display: { xs: "block", sm: "none" } }} />
              <Box
                component="span"
                sx={{ display: { xs: "none", sm: "inline" } }}
              >
                Home
              </Box>
            </Button>
            <Button
              startIcon={
                <Logout sx={{ display: { xs: "none", sm: "block" } }} />
              }
              onClick={handleLogout}
              variant="contained"
              sx={{
                background: "linear-gradient(135deg, #8C3A2B 0%, #6B2C20 100%)",
                color: "white",
                px: { xs: 1, sm: 2.5 },
                minWidth: { xs: "auto", sm: "auto" },
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #6B2C20 0%, #8C3A2B 100%)",
                },
              }}
            >
              <Logout sx={{ display: { xs: "block", sm: "none" } }} />
              <Box
                component="span"
                sx={{ display: { xs: "none", sm: "inline" } }}
              >
                Logout
              </Box>
            </Button>
          </Box>
        </Toolbar>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "rgba(255,255,255,0.1)" }}>
          <Container maxWidth="xl">
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              textColor="inherit"
              indicatorColor="secondary"
              variant={isMobile ? "scrollable" : "standard"}
              scrollButtons="auto"
              sx={{
                "& .MuiTab-root": {
                  color: "rgba(255,255,255,0.7)",
                  fontWeight: 600,
                  minHeight: { xs: 56, sm: 64 },
                  "&.Mui-selected": {
                    color: "#F2C14E",
                  },
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#F2C14E",
                  height: 3,
                },
              }}
            >
              {tabs.map((tab, index) => (
                <Tab
                  key={index}
                  icon={tab.icon}
                  label={isMobile ? null : tab.label}
                  iconPosition="start"
                  sx={{ minWidth: isMobile ? "auto" : 120 }}
                />
              ))}
            </Tabs>
          </Container>
        </Box>
      </AppBar>

      {/* Tab Content */}
      <Container maxWidth="xl">
        {tabs.map((tab, index) => (
          <TabPanel key={index} value={currentTab} index={index}>
            {tab.component}
          </TabPanel>
        ))}
      </Container>
    </Box>
  );
};

export default SuperAdminDashboard;
