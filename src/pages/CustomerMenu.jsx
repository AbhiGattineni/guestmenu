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
import CategoryDetail from "../components/CategoryDetail";
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
  const [selectedCategory, setSelectedCategory] = useState(null);

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
    setSelectedCategory(category);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle back to categories
  const handleBackToCategories = () => {
    setSelectedCategory(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Loading state
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #FFF8F0 0%, #F7F1EA 100%)",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={60} thickness={4} sx={{ color: "#8C3A2B" }} />
          <Typography
            variant="body2"
            sx={{ mt: 2, color: "#757575", fontWeight: 500 }}
          >
            Loading menu...
          </Typography>
        </Box>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          textAlign: "center",
          px: { xs: 2, sm: 3 },
        }}
      >
        <Box
          sx={{
            backgroundColor: "#fff",
            borderRadius: 4,
            p: { xs: 3, sm: 4 },
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          }}
        >
          <Typography
            variant="h5"
            color="error"
            gutterBottom
            sx={{
              fontSize: { xs: "1.25rem", sm: "1.5rem" },
              fontWeight: 700,
            }}
          >
            Oops! Something went wrong
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
          >
            {error}
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #FFF8F0 0%, #F7F1EA 100%)",
        pb: { xs: 8, sm: 10 },
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

      {/* Promotional Banners Slider - Only show on main view */}
      {!selectedCategory && <PromoSlider banners={banners} />}

      {/* Conditional Rendering: Categories or Category Detail */}
      {selectedCategory ? (
        <CategoryDetail
          category={selectedCategory}
          onBack={handleBackToCategories}
        />
      ) : (
        <MenuCategories
          categories={categories}
          onCategoryClick={handleCategoryClick}
        />
      )}

      {/* Floating Action Buttons - Manager Access */}
      <Box
        sx={{
          position: "fixed",
          bottom: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
          display: "flex",
          flexDirection: "column",
          gap: 2,
          zIndex: 1000,
        }}
      >
        {isAuthenticated ? (
          <Fab
            color="primary"
            size="medium"
            onClick={() => navigate("/admin")}
            sx={{
              background: "linear-gradient(135deg, #8C3A2B 0%, #C66F53 100%)",
              boxShadow: "0 8px 24px rgba(140, 58, 43, 0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #A0442F 0%, #D87F5D 100%)",
                boxShadow: "0 12px 32px rgba(140, 58, 43, 0.4)",
                transform: "scale(1.05)",
              },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
            title="Go to Admin Panel"
          >
            <AdminPanelSettings />
          </Fab>
        ) : (
          <Fab
            color="primary"
            size="medium"
            onClick={() => navigate("/login")}
            sx={{
              background: "linear-gradient(135deg, #8C3A2B 0%, #C66F53 100%)",
              boxShadow: "0 8px 24px rgba(140, 58, 43, 0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #A0442F 0%, #D87F5D 100%)",
                boxShadow: "0 12px 32px rgba(140, 58, 43, 0.4)",
                transform: "scale(1.05)",
              },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
            title="Manager Login"
          >
            <Login />
          </Fab>
        )}
      </Box>

      {/* Footer */}
      <Box
        sx={{
          bgcolor: "#2C1A12",
          color: "#F7F1EA",
          py: { xs: 3, sm: 4 },
          px: { xs: 2, sm: 3 },
          textAlign: "center",
          mt: { xs: 4, sm: 6 },
          borderRadius: { xs: 0, sm: "24px 24px 0 0" },
        }}
      >
        <Typography
          variant="body2"
          sx={{
            letterSpacing: 0.3,
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
          }}
        >
          © 2025 {restaurantInfo?.name || "Restaurant"}. All rights reserved.
        </Typography>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            mt: 1,
            opacity: 0.9,
            fontSize: { xs: "0.625rem", sm: "0.75rem" },
          }}
        >
          Powered by MenuScanner
        </Typography>
      </Box>
    </Box>
  );
};

export default CustomerMenu;
