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
  Divider,
} from "@mui/material";
import { ArrowBack, LocalFireDepartment, Grass } from "@mui/icons-material";
import { fetchMenuItems } from "../services/firebaseService";
import { fetchSubcategories } from "../services/subcategoryService";

/**
 * CategoryDetail Component
 * Displays menu items for a selected category with subheadings (subcategories)
 */
const CategoryDetail = ({ category, onBack }) => {
  const [items, setItems] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch items and subcategories in parallel
        const [itemsData, subcategoriesData] = await Promise.all([
          fetchMenuItems(category.id),
          fetchSubcategories(category.id, false), // false = only active subcategories
        ]);
        setItems(itemsData);
        setSubcategories(subcategoriesData);
      } catch (error) {
        console.error("Error loading menu data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      loadData();
    }
  }, [category]);

  // Group items by subcategory
  const groupedItems = React.useMemo(() => {
    const groups = {};

    // Group items by subcategoryId
    items.forEach((item) => {
      const key = item.subcategoryId || "none";
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
    });

    return groups;
  }, [items]);

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

        {/* Menu Items - Organized by Subheadings */}
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
          <Box>
            {/* Render items with subheadings */}
            {subcategories.map((subcategory) => {
              const subcategoryItems = groupedItems[subcategory.id] || [];
              if (subcategoryItems.length === 0) return null;

              return (
                <Box key={subcategory.id} sx={{ mb: { xs: 4, sm: 5 } }}>
                  {/* Subheading Header */}
                  <Box
                    sx={{
                      mb: { xs: 2, sm: 3 },
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          fontSize: { xs: "1.25rem", sm: "1.5rem" },
                          color: "#8C3A2B",
                          mb: subcategory.description ? 0.5 : 0,
                        }}
                      >
                        {subcategory.name}
                      </Typography>
                      {subcategory.description && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontSize: { xs: "0.813rem", sm: "0.875rem" },
                          }}
                        >
                          {subcategory.description}
                        </Typography>
                      )}
                    </Box>
                    <Divider
                      sx={{
                        flexGrow: 1,
                        borderColor: "rgba(140, 58, 43, 0.15)",
                        borderWidth: 1,
                      }}
                    />
                  </Box>

                  {/* Items Grid for this Subheading */}
                  <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
                    {subcategoryItems.map((item) => (
                      <Grid item xs={6} sm={4} md={3} key={item.id}>
                        <Card
                          sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            borderRadius: 2,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                            background: "#FFFFFF",
                            border: "1px solid rgba(200, 169, 126, 0.08)",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            overflow: "hidden",
                            "&:hover": {
                              transform: "translateY(-2px)",
                              boxShadow: "0 6px 16px rgba(140, 58, 43, 0.1)",
                              border: "1px solid rgba(200, 169, 126, 0.2)",
                            },
                          }}
                        >
                          <CardMedia
                            component="img"
                            image={item.image}
                            alt={item.name}
                            sx={{
                              objectFit: "cover",
                              height: { xs: 120, sm: 140 },
                            }}
                          />
                          <CardContent
                            sx={{ flexGrow: 1, p: { xs: 1.25, sm: 1.5 } }}
                          >
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
                                  fontSize: { xs: "0.875rem", sm: "0.938rem" },
                                  lineHeight: 1.3,
                                  mb: 0.5,
                                }}
                              >
                                {item.name}
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: 0.5,
                                  flexShrink: 0,
                                }}
                              >
                                {item.isVegetarian && (
                                  <Grass
                                    sx={{
                                      fontSize: 14,
                                      color: "#4CAF50",
                                    }}
                                    titleAccess="Vegetarian"
                                  />
                                )}
                                {item.isSpicy && (
                                  <LocalFireDepartment
                                    sx={{
                                      fontSize: 14,
                                      color: "#FF5722",
                                    }}
                                    titleAccess="Spicy"
                                  />
                                )}
                              </Box>
                            </Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                mb: 1,
                                lineHeight: 1.4,
                                fontSize: { xs: "0.688rem", sm: "0.75rem" },
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              {item.description}
                            </Typography>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 700,
                                background:
                                  "linear-gradient(135deg, #8C3A2B 0%, #C66F53 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                fontSize: { xs: "0.938rem", sm: "1rem" },
                              }}
                            >
                              ${item.price.toFixed(2)}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              );
            })}

            {/* Render items without subheading (if any) */}
            {groupedItems["none"] && groupedItems["none"].length > 0 && (
              <Box sx={{ mb: { xs: 4, sm: 5 } }}>
                {/* Show "Other Items" header only if there are also subcategories */}
                {subcategories.length > 0 && (
                  <Box
                    sx={{
                      mb: { xs: 2, sm: 3 },
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        fontSize: { xs: "1.25rem", sm: "1.5rem" },
                        color: "#8C3A2B",
                      }}
                    >
                      Other Items
                    </Typography>
                    <Divider
                      sx={{
                        flexGrow: 1,
                        borderColor: "rgba(140, 58, 43, 0.15)",
                        borderWidth: 1,
                      }}
                    />
                  </Box>
                )}

                {/* Items Grid for uncategorized items */}
                <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
                  {groupedItems["none"].map((item) => (
                    <Grid item xs={6} sm={4} md={3} key={item.id}>
                      <Card
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          borderRadius: 2,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                          background: "#FFFFFF",
                          border: "1px solid rgba(200, 169, 126, 0.08)",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          overflow: "hidden",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 6px 16px rgba(140, 58, 43, 0.1)",
                            border: "1px solid rgba(200, 169, 126, 0.2)",
                          },
                        }}
                      >
                        {/* Item Image */}
                        <CardMedia
                          component="img"
                          image={item.image}
                          alt={item.name}
                          sx={{
                            objectFit: "cover",
                            height: { xs: 120, sm: 140 },
                          }}
                        />

                        <CardContent
                          sx={{ flexGrow: 1, p: { xs: 1.25, sm: 1.5 } }}
                        >
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
                                fontSize: { xs: "0.875rem", sm: "0.938rem" },
                                lineHeight: 1.3,
                                mb: 0.5,
                              }}
                            >
                              {item.name}
                            </Typography>
                            <Box
                              sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}
                            >
                              {item.isVegetarian && (
                                <Grass
                                  sx={{
                                    fontSize: 14,
                                    color: "#4CAF50",
                                  }}
                                  titleAccess="Vegetarian"
                                />
                              )}
                              {item.isSpicy && (
                                <LocalFireDepartment
                                  sx={{
                                    fontSize: 14,
                                    color: "#FF5722",
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
                              mb: 1,
                              lineHeight: 1.4,
                              fontSize: { xs: "0.688rem", sm: "0.75rem" },
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
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
                              fontSize: { xs: "0.938rem", sm: "1rem" },
                            }}
                          >
                            ${item.price.toFixed(2)}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default CategoryDetail;
