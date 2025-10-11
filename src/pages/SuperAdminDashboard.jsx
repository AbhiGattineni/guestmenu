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
      {value === index && (
        <Box sx={{ py: { xs: 2, sm: 2.5, md: 3 } }}>{children}</Box>
      )}
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
      navigate("/");
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
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        overflowX: "hidden",
        width: "100%",
      }}
    >
      {/* App Bar */}
      <AppBar
        position="sticky"
        elevation={2}
        sx={{
          background: "linear-gradient(135deg, #2C1A12 0%, #3D2817 100%)",
          borderBottom: "1px solid rgba(242, 193, 78, 0.1)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          width: "100%",
          maxWidth: "100vw",
        }}
      >
        <Toolbar
          sx={{
            py: { xs: 1, sm: 1.5 },
            px: { xs: 1, sm: 2, md: 3 },
            minHeight: { xs: 56, sm: 64 },
          }}
        >
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
          <Box
            sx={{
              display: "flex",
              gap: { xs: 0.5, sm: 1, md: 1.5 },
              alignItems: "center",
            }}
          >
            <Button
              startIcon={
                <Logout
                  sx={{
                    display: { xs: "none", sm: "block" },
                    fontSize: { xs: 18, sm: 20 },
                  }}
                />
              }
              onClick={handleLogout}
              variant="contained"
              size="small"
              sx={{
                background: "linear-gradient(135deg, #8C3A2B 0%, #6B2C20 100%)",
                color: "white",
                px: { xs: 0, sm: 1.5, md: 2.5 },
                minWidth: { xs: 32, sm: "auto" },
                width: { xs: 32, sm: "auto" },
                height: { xs: 32, sm: 36, md: 40 },
                borderRadius: { xs: 1.5, sm: 2 },
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                boxShadow: "0 2px 8px rgba(140, 58, 43, 0.3)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #6B2C20 0%, #8C3A2B 100%)",
                  boxShadow: "0 3px 12px rgba(140, 58, 43, 0.4)",
                },
              }}
            >
              <Logout
                sx={{ display: { xs: "block", sm: "none" }, fontSize: 18 }}
              />
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
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "rgba(255,255,255,0.1)",
            width: "100%",
            overflowX: "hidden",
          }}
        >
          <Container
            maxWidth="xl"
            sx={{
              px: { xs: 1, sm: 2, md: 3 },
              maxWidth: "100%",
              overflowX: "hidden",
            }}
          >
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              textColor="inherit"
              indicatorColor="secondary"
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                width: "100%",
                "& .MuiTab-root": {
                  color: "rgba(255,255,255,0.7)",
                  fontWeight: 600,
                  minHeight: { xs: 48, sm: 56, md: 64 },
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  px: { xs: 1, sm: 2 },
                  minWidth: { xs: 48, sm: 120 },
                  "&.Mui-selected": {
                    color: "#F2C14E",
                  },
                  "& svg": {
                    fontSize: { xs: 18, sm: 20, md: 24 },
                  },
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#F2C14E",
                  height: 3,
                  borderRadius: "2px 2px 0 0",
                },
                "& .MuiTabs-scroller": {
                  overflowX: "auto !important",
                },
              }}
            >
              {tabs.map((tab, index) => (
                <Tab
                  key={index}
                  icon={tab.icon}
                  label={isMobile ? null : tab.label}
                  iconPosition="start"
                />
              ))}
            </Tabs>
          </Container>
        </Box>
      </AppBar>

      {/* Tab Content */}
      <Container
        maxWidth="xl"
        disableGutters
        sx={{
          px: { xs: 1.5, sm: 2, md: 3 },
          width: "100%",
          maxWidth: "100vw",
          overflowX: "hidden",
        }}
      >
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
