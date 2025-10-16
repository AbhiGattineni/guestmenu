import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { fetchMenuCategories } from "../services/firebaseService";
import CategoryDetail from "../components/CategoryDetail";

/**
 * CategoryDetailPage Component
 * Displays menu items for a specific category using URL parameters
 * Handles proper browser history navigation
 */
const CategoryDetailPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const loadCategory = async () => {
      try {
        setLoading(true);
        setError(null);

        // Decode the category name from URL
        const decodedCategoryName = decodeURIComponent(categoryName);

        // Fetch all categories to find the one with matching name
        const categories = await fetchMenuCategories();
        const foundCategory = categories.find(
          (cat) => cat.name === decodedCategoryName
        );

        if (foundCategory) {
          setCategory(foundCategory);
        } else {
          setError("Category not found");
        }
      } catch (err) {
        console.error("Error loading category:", err);
        setError("Failed to load category. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (categoryName) {
      loadCategory();
    }
  }, [categoryName]);

  // Handle back to categories
  const handleBackToCategories = () => {
    navigate("/");
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
            Loading category...
          </Typography>
        </Box>
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
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {error}
          </Typography>
          <button
            onClick={handleBackToCategories}
            style={{
              background: "linear-gradient(135deg, #8C3A2B 0%, #C66F53 100%)",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "25px",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Back to Menu
          </button>
        </Box>
      </Container>
    );
  }

  // If no category found, show error
  if (!category) {
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
            Category not found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            The category you're looking for doesn't exist.
          </Typography>
          <button
            onClick={handleBackToCategories}
            style={{
              background: "linear-gradient(135deg, #8C3A2B 0%, #C66F53 100%)",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "25px",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Back to Menu
          </button>
        </Box>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #FFF8F0 0%, #F7F1EA 100%)",
      }}
    >
      <CategoryDetail category={category} onBack={handleBackToCategories} />
    </Box>
  );
};

export default CategoryDetailPage;
