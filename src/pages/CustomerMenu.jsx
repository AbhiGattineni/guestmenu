import React, { useState, useEffect } from "react";
import {
  Box,
  CircularProgress,
  Container,
  Typography,
  Fab,
} from "@mui/material";
import { Login, AdminPanelSettings } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import RestaurantLogo from "../components/RestaurantLogo";
import PromoSlider from "../components/PromoSlider";
import MenuCategories from "../components/MenuCategories";
import { useAuth } from "../context/AuthContext";
import {
  fetchRestaurantInfo,
  fetchBanners,
  fetchMenuCategories,
} from "../services/firebaseService";

/**
 * CustomerMenu Component
 * Customer-facing menu page that displays when user scans the QR code
 */
const CustomerMenu = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [restaurantInfo, setRestaurantInfo] = useState(null);
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);

  // Fetch all data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all data in parallel
        const [restaurantData, bannersData, categoriesData] = await Promise.all(
          [fetchRestaurantInfo(), fetchBanners(), fetchMenuCategories()]
        );

        setRestaurantInfo(restaurantData);
        setBanners(bannersData);
        setCategories(categoriesData);
      } catch (err) {
        console.error("Error fetching data:", err);
        // Show specific error message if store doesn't exist
        if (err.message && err.message.includes("does not exist")) {
          setError(err.message);
        } else {
          setError("Failed to load menu. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Handle category click
  const handleCategoryClick = (category) => {
    // Encode the category name for URL
    const encodedCategoryName = encodeURIComponent(category.name);
    navigate(`/category/${encodedCategoryName}`);
  };

  // Loading state with premium animation
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)",
            animation: "pulse 2s ease-in-out infinite",
          },
        }}
      >
        <Box sx={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          {/* Animated Logo/Icon */}
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "20px",
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(20px)",
              border: "2px solid rgba(255,255,255,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 3,
              animation: "float 3s ease-in-out infinite",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            <Typography sx={{ fontSize: "2.5rem" }}>🍽️</Typography>
          </Box>

          {/* Circular Progress */}
          <CircularProgress
            size={70}
            thickness={3}
            sx={{
              color: "#fff",
              mb: 3,
              "& .MuiCircularProgress-circle": {
                strokeLinecap: "round",
              },
            }}
          />

          {/* Loading Text */}
          <Typography
            variant="h6"
            sx={{
              color: "#fff",
              fontWeight: 600,
              fontSize: "1.25rem",
              mb: 1,
              textShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            Loading Menu
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255,255,255,0.8)",
              fontWeight: 400,
              fontSize: "0.938rem",
            }}
          >
            Preparing something delicious...
          </Typography>
        </Box>

        {/* Float Animation */}
        <style>
          {`
            @keyframes float {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-20px) rotate(5deg); }
            }
          `}
        </style>
      </Box>
    );
  }

  // Error state with modern design
  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          position: "relative",
          overflow: "hidden",
          px: { xs: 3, sm: 4 },
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)",
          },
        }}
      >
        <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
          <Box
            sx={{
              backgroundColor: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(20px)",
              borderRadius: "32px",
              p: { xs: 4, sm: 5 },
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.8)",
              border: "1px solid rgba(255,255,255,0.5)",
              textAlign: "center",
            }}
          >
            {/* Error Icon */}
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
                boxShadow: "0 10px 30px rgba(240,147,251,0.4)",
              }}
            >
              <Typography sx={{ fontSize: "2.5rem" }}>⚠️</Typography>
            </Box>

            {/* Error Title */}
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontSize: { xs: "1.5rem", sm: "1.75rem" },
                fontWeight: 800,
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 2,
                letterSpacing: "-0.02em",
              }}
            >
              Oops! Something went wrong
            </Typography>

            {/* Error Message */}
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: "1rem", sm: "1.125rem" },
                color: "rgba(0,0,0,0.7)",
                lineHeight: 1.7,
                fontWeight: 500,
                mb: 3,
              }}
            >
              {error}
            </Typography>

            {/* Action Button */}
            <Box
              component="button"
              onClick={() => (window.location.href = "/")}
              sx={{
                mt: 2,
                px: 4,
                py: 1.5,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                color: "#fff",
                border: "none",
                fontSize: "1rem",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 8px 24px rgba(240,147,251,0.4)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 32px rgba(240,147,251,0.5)",
                },
                "&:active": {
                  transform: "translateY(0)",
                },
              }}
            >
              Return Home
            </Box>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#fff",
        pb: { xs: 10, sm: 12 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Restaurant Logo Section */}
      {restaurantInfo && (
        <RestaurantLogo
          logo={restaurantInfo.logo}
          name={restaurantInfo.name}
          description={restaurantInfo.description}
        />
      )}

      {/* Promotional Banners Slider */}
      <PromoSlider banners={banners} />

      {/* Menu Categories */}
      <MenuCategories
        categories={categories}
        onCategoryClick={handleCategoryClick}
      />

      {/* Ultra Modern Floating Action Button - Manager Access */}
      <Box
        sx={{
          position: "fixed",
          bottom: { xs: 24, sm: 32 },
          right: { xs: 24, sm: 32 },
          zIndex: 1000,
        }}
      >
        {isAuthenticated ? (
          <Fab
            size="large"
            onClick={() => navigate("/admin")}
            sx={{
              width: { xs: 64, sm: 72 },
              height: { xs: 64, sm: 72 },
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              backdropFilter: "blur(20px)",
              boxShadow:
                "0 12px 40px rgba(102,126,234,0.4), 0 0 0 4px rgba(255,255,255,0.9), 0 0 0 6px rgba(102,126,234,0.2)",
              border: "2px solid rgba(255,255,255,0.5)",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                transform: "scale(1.1) rotate(5deg)",
                boxShadow:
                  "0 20px 60px rgba(102,126,234,0.5), 0 0 0 6px rgba(255,255,255,0.9), 0 0 0 8px rgba(102,126,234,0.3)",
              },
              "&:active": {
                transform: "scale(1) rotate(0deg)",
              },
              "&::before": {
                content: '""',
                position: "absolute",
                inset: -6,
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, rgba(102,126,234,0.3), rgba(118,75,162,0.3))",
                animation: "pulse 2s ease-in-out infinite",
                zIndex: -1,
              },
              "@keyframes pulse": {
                "0%, 100%": {
                  opacity: 1,
                  transform: "scale(1)",
                },
                "50%": {
                  opacity: 0.7,
                  transform: "scale(1.15)",
                },
              },
            }}
            title="Go to Admin Panel"
          >
            <AdminPanelSettings
              sx={{ fontSize: { xs: "1.75rem", sm: "2rem" }, color: "#fff" }}
            />
          </Fab>
        ) : (
          <Fab
            size="large"
            onClick={() => navigate("/login")}
            sx={{
              width: { xs: 64, sm: 72 },
              height: { xs: 64, sm: 72 },
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              backdropFilter: "blur(20px)",
              boxShadow:
                "0 12px 40px rgba(102,126,234,0.4), 0 0 0 4px rgba(255,255,255,0.9), 0 0 0 6px rgba(102,126,234,0.2)",
              border: "2px solid rgba(255,255,255,0.5)",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                transform: "scale(1.1) rotate(-5deg)",
                boxShadow:
                  "0 20px 60px rgba(102,126,234,0.5), 0 0 0 6px rgba(255,255,255,0.9), 0 0 0 8px rgba(102,126,234,0.3)",
              },
              "&:active": {
                transform: "scale(1) rotate(0deg)",
              },
              "&::before": {
                content: '""',
                position: "absolute",
                inset: -6,
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, rgba(102,126,234,0.3), rgba(118,75,162,0.3))",
                animation: "pulse 2s ease-in-out infinite",
                zIndex: -1,
              },
              "@keyframes pulse": {
                "0%, 100%": {
                  opacity: 1,
                  transform: "scale(1)",
                },
                "50%": {
                  opacity: 0.7,
                  transform: "scale(1.15)",
                },
              },
            }}
            title="Manager Login"
          >
            <Login
              sx={{ fontSize: { xs: "1.75rem", sm: "2rem" }, color: "#fff" }}
            />
          </Fab>
        )}
      </Box>

      {/* Premium Footer */}
      <Box
        sx={{
          position: "relative",
          background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
          color: "#fff",
          py: { xs: 4, sm: 5 },
          px: { xs: 3, sm: 4 },
          textAlign: "center",
          mt: { xs: 6, sm: 8 },
          borderRadius: { xs: 0, sm: "32px 32px 0 0" },
          boxShadow: "0 -10px 40px rgba(0,0,0,0.1)",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background:
              "linear-gradient(90deg, #667eea 0%, #764ba2 50%, #667eea 100%)",
          },
        }}
      >
        <Typography
          variant="body1"
          sx={{
            letterSpacing: 0.5,
            fontSize: { xs: "0.875rem", sm: "1rem" },
            fontWeight: 500,
            mb: 1,
          }}
        >
          © 2025 {restaurantInfo?.name || "Restaurant"}. All rights reserved.
        </Typography>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            opacity: 0.7,
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            fontWeight: 400,
          }}
        >
          Powered by{" "}
          <span
            style={{
              fontWeight: 600,
              background: "linear-gradient(90deg, #667eea, #764ba2)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Guest Menu
          </span>{" "}
          ✨
        </Typography>
      </Box>
    </Box>
  );
};

export default CustomerMenu;
