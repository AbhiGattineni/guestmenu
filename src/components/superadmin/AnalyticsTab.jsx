import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Chip,
  Divider,
  Avatar,
  LinearProgress,
} from "@mui/material";
import {
  Store,
  People,
  Restaurant,
  Category,
  TrendingUp,
  Storefront,
  AdminPanelSettings,
} from "@mui/icons-material";
import { getAnalytics } from "../../services/superAdminService";

/**
 * Analytics Tab
 * Professional analytics dashboard with elegant design
 */
const AnalyticsTab = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = analytics
    ? [
        {
          title: "Total Stores",
          value: analytics.totalStores,
          icon: <Store />,
          color: "#1e3a8a", // Deep blue
          bgColor: "#eff6ff",
          trend: "+12%",
        },
        {
          title: "Total Users",
          value: analytics.totalUsers,
          icon: <People />,
          color: "#0f172a", // Slate
          bgColor: "#f8fafc",
          trend: "+8%",
        },
        {
          title: "Managers",
          value: analytics.totalManagers,
          icon: <AdminPanelSettings />,
          color: "#166534", // Forest green
          bgColor: "#f0fdf4",
          trend: "+5%",
        },
        {
          title: "Categories",
          value: analytics.totalCategories,
          icon: <Category />,
          color: "#ea580c", // Professional orange
          bgColor: "#fff7ed",
          trend: "+15%",
        },
        {
          title: "Menu Items",
          value: analytics.totalMenuItems,
          icon: <Restaurant />,
          color: "#be123c", // Deep red
          bgColor: "#fff1f2",
          trend: "+20%",
        },
        {
          title: "Active Stores",
          value: analytics.activeStores,
          icon: <Storefront />,
          color: "#7c3aed", // Purple
          bgColor: "#faf5ff",
          trend: `${Math.round(
            (analytics.activeStores / analytics.totalStores) * 100
          )}%`,
        },
      ]
    : [];

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress size={60} sx={{ color: "#1e3a8a" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: "100%", overflowX: "hidden" }}>
      {/* Welcome Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#0f172a",
            mb: 1,
            letterSpacing: "-0.02em",
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
          }}
        >
          Analytics Dashboard
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontWeight: 400, fontSize: { xs: "0.875rem", sm: "1rem" } }}
        >
          Monitor your platform's performance and growth metrics
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 5, width: "100%" }}>
        {statsCards.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={4} key={index}>
            <Card
              elevation={0}
              sx={{
                position: "relative",
                overflow: "visible",
                background: "white",
                borderRadius: 2,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                border: "1px solid",
                borderColor: "#e2e8f0",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
                  borderColor: stat.color,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    mb: 2.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      backgroundColor: stat.bgColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: stat.color,
                    }}
                  >
                    {React.cloneElement(stat.icon, { sx: { fontSize: 28 } })}
                  </Box>
                  <Chip
                    icon={<TrendingUp sx={{ fontSize: 16 }} />}
                    label={stat.trend}
                    size="small"
                    sx={{
                      background: "#f0fdf4",
                      color: "#166534",
                      fontWeight: 600,
                      border: "none",
                      height: 28,
                    }}
                  />
                </Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    mb: 0.5,
                    color: "#0f172a",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#64748b",
                    fontWeight: 500,
                    letterSpacing: "0.01em",
                  }}
                >
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Stores Overview Section */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "#e2e8f0",
          width: "100%",
        }}
      >
        <Box
          sx={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            p: { xs: 2, sm: 3 },
            color: "white",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            <Store sx={{ fontSize: { xs: 24, sm: 28 } }} />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                letterSpacing: "-0.01em",
                fontSize: { xs: "1.25rem", sm: "1.5rem" },
              }}
            >
              Stores Overview
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{ opacity: 0.85, fontSize: { xs: "0.813rem", sm: "0.875rem" } }}
          >
            Comprehensive breakdown of all stores in your platform
          </Typography>
        </Box>

        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ width: "100%" }}>
            {analytics?.storesList.map((store, index) => (
              <Grid item xs={12} md={6} lg={4} key={store.id}>
                <Card
                  elevation={0}
                  sx={{
                    border: "1px solid",
                    borderColor: "#e2e8f0",
                    borderRadius: 2,
                    transition: "all 0.3s",
                    "&:hover": {
                      borderColor: "#1e3a8a",
                      boxShadow: "0 8px 16px rgba(0,0,0,0.06)",
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 2.5,
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: "#1e3a8a",
                          fontWeight: 600,
                          width: 44,
                          height: 44,
                          fontSize: "1.1rem",
                        }}
                      >
                        {store.name?.charAt(0)?.toUpperCase() ||
                          store.id.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            fontSize: "1rem",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            color: "#0f172a",
                          }}
                        >
                          {store.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#64748b",
                            fontFamily: "monospace",
                            fontSize: "0.75rem",
                          }}
                        >
                          ID: {store.id}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 1,
                          }}
                        >
                          <Category sx={{ fontSize: 18, color: "#ea580c" }} />
                          <Typography
                            variant="body2"
                            sx={{ color: "#64748b", fontSize: "0.813rem" }}
                          >
                            Categories
                          </Typography>
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 700, color: "#0f172a" }}
                        >
                          {store.categoriesCount}
                        </Typography>
                      </Box>

                      <Divider orientation="vertical" flexItem />

                      <Box sx={{ flex: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 1,
                          }}
                        >
                          <Restaurant sx={{ fontSize: 18, color: "#be123c" }} />
                          <Typography
                            variant="body2"
                            sx={{ color: "#64748b", fontSize: "0.813rem" }}
                          >
                            Items
                          </Typography>
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 700, color: "#0f172a" }}
                        >
                          {store.itemsCount}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Progress bar for items per category ratio */}
                    <Box sx={{ mt: 2.5 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 0.5,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{ color: "#64748b", fontSize: "0.75rem" }}
                        >
                          Items per Category
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 600,
                            color: "#0f172a",
                            fontSize: "0.75rem",
                          }}
                        >
                          {store.categoriesCount > 0
                            ? (
                                store.itemsCount / store.categoriesCount
                              ).toFixed(1)
                            : 0}{" "}
                          avg
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(
                          store.categoriesCount > 0
                            ? (store.itemsCount / store.categoriesCount / 20) *
                                100
                            : 0,
                          100
                        )}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: "#f1f5f9",
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 3,
                            background:
                              "linear-gradient(90deg, #1e3a8a 0%, #3b82f6 100%)",
                          },
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {analytics?.storesList.length === 0 && (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Store sx={{ fontSize: 64, color: "#cbd5e1", mb: 2 }} />
              <Typography
                variant="h6"
                sx={{ color: "#64748b", fontWeight: 600 }}
              >
                No stores yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add your first store to get started
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default AnalyticsTab;
