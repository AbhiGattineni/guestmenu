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
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={60} thickness={4} sx={{ color: "#8C3A2B" }} />
          <Typography
            variant="body2"
            sx={{ mt: 2, color: "#757575", fontWeight: 500 }}
          >
            Loading menu items...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        background: "transparent",
        minHeight: "60vh",
        py: { xs: 2.5, sm: 4 },
        px: { xs: 1.5, sm: 2 },
      }}
    >
      <Container maxWidth="lg">
        {/* Header with Back Button */}
        <Box sx={{ mb: { xs: 3, sm: 4 } }}>
          <Button
            startIcon={<ArrowBack sx={{ fontSize: { xs: 20, sm: 24 } }} />}
            onClick={onBack}
            sx={{
              mb: 2,
              color: "text.primary",
              fontWeight: 600,
              fontSize: { xs: "0.875rem", sm: "1rem" },
              px: { xs: 1.5, sm: 2 },
              py: { xs: 0.75, sm: 1 },
              borderRadius: 2,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                bgcolor: "rgba(140,58,43,0.08)",
                transform: "translateX(-4px)",
              },
            }}
          >
            Back to Menu
          </Button>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1.5, sm: 2 },
              mb: 1,
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: "2rem", sm: "2.5rem" },
                filter: "drop-shadow(0 2px 8px rgba(140, 58, 43, 0.15))",
              }}
            >
              {category.icon}
            </Typography>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "1.5rem", sm: "2.125rem" },
                  color: "text.primary",
                  lineHeight: 1.2,
                }}
              >
                {category.name}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  display: { xs: "none", sm: "block" },
                }}
              >
                {category.description}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Menu Items Grid */}
        {items.length === 0 ? (
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ fontSize: { xs: "0.875rem", sm: "1rem" }, py: 4 }}
          >
            No items available in this category.
          </Typography>
        ) : (
          <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
            {items.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: { xs: 3, sm: 4 },
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    background:
                      "linear-gradient(135deg, #FFFFFF 0%, #FFFBF7 100%)",
                    border: "1px solid rgba(200, 169, 126, 0.1)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    overflow: "hidden",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 12px 40px rgba(140, 58, 43, 0.15)",
                      border: "1px solid rgba(200, 169, 126, 0.3)",
                    },
                    "&:active": {
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  {/* Item Image */}
                  <CardMedia
                    component="img"
                    height={200}
                    image={item.image}
                    alt={item.name}
                    sx={{
                      objectFit: "cover",
                      height: { xs: 180, sm: 200 },
                    }}
                  />

                  <CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 2.5 } }}>
                    {/* Item Name and Badges */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 1,
                        gap: 1,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: "text.primary",
                          fontSize: { xs: "1rem", sm: "1.1rem" },
                          lineHeight: 1.3,
                        }}
                      >
                        {item.name}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}>
                        {item.isVegetarian && (
                          <Grass
                            sx={{
                              fontSize: { xs: 16, sm: 18 },
                              color: "#4CAF50",
                              filter:
                                "drop-shadow(0 1px 2px rgba(76, 175, 80, 0.3))",
                            }}
                            titleAccess="Vegetarian"
                          />
                        )}
                        {item.isSpicy && (
                          <LocalFireDepartment
                            sx={{
                              fontSize: { xs: 16, sm: 18 },
                              color: "#FF5722",
                              filter:
                                "drop-shadow(0 1px 2px rgba(255, 87, 34, 0.3))",
                            }}
                            titleAccess="Spicy"
                          />
                        )}
                      </Box>
                    </Box>

                    {/* Item Description */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        lineHeight: 1.6,
                        fontSize: { xs: "0.813rem", sm: "0.875rem" },
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {item.description}
                    </Typography>

                    {/* Price */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        background:
                          "linear-gradient(135deg, #8C3A2B 0%, #C66F53 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        fontSize: { xs: "1.125rem", sm: "1.25rem" },
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
