import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Button,
} from "@mui/material";
import { ArrowBack, LocalFireDepartment, Grass } from "@mui/icons-material";
import { fetchMenuItems } from "../services/firebaseService";

/**
 * CategoryDetail Component
 * Displays menu items for a selected category
 */
const CategoryDetail = ({ category, onBack }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      try {
        const data = await fetchMenuItems(category.id);
        setItems(data);
      } catch (error) {
        console.error("Error loading menu items:", error);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      loadItems();
    }
  }, [category]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        background:
          "linear-gradient(180deg, #FAF7F2 0%, #FFF 40%, #FAF7F2 100%)",
        minHeight: "60vh",
        py: { xs: 3, sm: 4 },
      }}
    >
      <Container maxWidth="lg">
        {/* Header with Back Button */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={onBack}
            sx={{
              mb: 2,
              color: "text.primary",
              "&:hover": { bgcolor: "rgba(140,58,43,0.08)" },
            }}
          >
            Back to Menu
          </Button>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            <Typography variant="h3" sx={{ fontSize: "2.5rem" }}>
              {category.icon}
            </Typography>
            <Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "text.primary" }}
              >
                {category.name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {category.description}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Menu Items Grid */}
        {items.length === 0 ? (
          <Typography variant="body1" color="text.secondary" textAlign="center">
            No items available in this category.
          </Typography>
        ) : (
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {items.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 12px 28px rgba(44,26,18,0.15)",
                    },
                  }}
                >
                  {/* Item Image */}
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.image}
                    alt={item.name}
                    sx={{ objectFit: "cover" }}
                  />

                  <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                    {/* Item Name and Badges */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: "text.primary",
                          fontSize: "1.1rem",
                        }}
                      >
                        {item.name}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        {item.isVegetarian && (
                          <Grass
                            sx={{ fontSize: 18, color: "#4CAF50" }}
                            titleAccess="Vegetarian"
                          />
                        )}
                        {item.isSpicy && (
                          <LocalFireDepartment
                            sx={{ fontSize: 18, color: "#FF5722" }}
                            titleAccess="Spicy"
                          />
                        )}
                      </Box>
                    </Box>

                    {/* Item Description */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2, lineHeight: 1.6 }}
                    >
                      {item.description}
                    </Typography>

                    {/* Price */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: "primary.main",
                        fontSize: "1.25rem",
                      }}
                    >
                      ${item.price.toFixed(2)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default CategoryDetail;
