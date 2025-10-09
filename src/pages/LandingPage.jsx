import React, { useState, useEffect } from "react";
import {
  Box,
  CircularProgress,
  Container,
  Typography,
  Button,
  Fab,
} from "@mui/material";
import { Login, Logout, AdminPanelSettings } from "@mui/icons-material";
import RestaurantLogo from "../components/RestaurantLogo";
import PromoSlider from "../components/PromoSlider";
import MenuCategories from "../components/MenuCategories";
import CategoryDetail from "../components/CategoryDetail";
import LoginModal from "../components/LoginModal";
import AdminPanel from "../components/AdminPanel";
import { useAuth } from "../context/AuthContext";
import {
  fetchRestaurantInfo,
  fetchBanners,
  fetchMenuCategories,
} from "../services/firebaseService";

/**
 * LandingPage Component
 * Main landing page that displays when user scans the QR code
 * Shows restaurant logo, promotional banners, and menu categories
 */
const LandingPage = () => {
  const { isAuthenticated, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [restaurantInfo, setRestaurantInfo] = useState(null);
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);

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
        setError("Failed to load menu. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Handle category click
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    // Scroll to top when showing category details
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle back to categories
  const handleBackToCategories = () => {
    setSelectedCategory(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    setAdminPanelOpen(false);
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
          backgroundColor: "#f5f5f5",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          textAlign: "center",
        }}
      >
        <Box>
          <Typography variant="h5" color="error" gutterBottom>
            Oops! Something went wrong
          </Typography>
          <Typography variant="body1" color="text.secondary">
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
        backgroundColor: "background.default",
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

      {/* Floating Action Buttons */}
      <Box
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          zIndex: 1000,
        }}
      >
        {isAuthenticated ? (
          <>
            <Fab
              color="primary"
              onClick={() => setAdminPanelOpen(true)}
              sx={{
                background: "linear-gradient(135deg, #8C3A2B 0%, #C66F53 100%)",
              }}
            >
              <AdminPanelSettings />
            </Fab>
            <Fab
              onClick={handleLogout}
              sx={{
                bgcolor: "text.secondary",
                "&:hover": { bgcolor: "text.primary" },
              }}
            >
              <Logout />
            </Fab>
          </>
        ) : (
          <Fab
            color="primary"
            onClick={() => setLoginModalOpen(true)}
            sx={{
              background: "linear-gradient(135deg, #8C3A2B 0%, #C66F53 100%)",
            }}
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
          py: 4,
          textAlign: "center",
          mt: 6,
        }}
      >
        <Typography variant="body2" sx={{ letterSpacing: 0.3 }}>
          © 2025 {restaurantInfo?.name || "Restaurant"}. All rights reserved.
        </Typography>
        <Typography
          variant="caption"
          sx={{ display: "block", mt: 1, opacity: 0.9 }}
        >
          Powered by MenuScanner
        </Typography>
      </Box>

      {/* Login Modal */}
      <LoginModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />

      {/* Admin Panel */}
      <AdminPanel
        open={adminPanelOpen}
        onClose={() => setAdminPanelOpen(false)}
      />
    </Box>
  );
};

export default LandingPage;
