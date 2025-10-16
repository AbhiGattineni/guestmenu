import React, { useState, useEffect, useRef } from "react";
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
  Chip,
  Paper,
  Fab,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import {
  ArrowBack,
  LocalFireDepartment,
  Grass,
  KeyboardArrowUp,
  FilterList,
  Clear,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { fetchMenuItems } from "../services/firebaseService";
import { fetchSubcategories } from "../services/subcategoryService";

/**
 * CategoryDetail Component
 * Displays menu items for a selected category with subheadings (subcategories)
 */
const CategoryDetail = ({ category, onBack }) => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Handle back navigation - use onBack if provided, otherwise navigate to home
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate("/");
    }
  };

  // Handle filter selection
  const handleFilterSelect = (filterId) => {
    if (selectedFilter === filterId) {
      // If clicking the same filter, clear it
      setSelectedFilter(null);
    } else {
      // Set new filter
      setSelectedFilter(filterId);
    }
    // Scroll to top when filtering
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Clear all filters
  const clearFilter = () => {
    setSelectedFilter(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  // Add scroll listener to show back to top button
  useEffect(() => {
    const handleScroll = () => {
      // Show back to top button when scrolled down
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Group items by subcategory and apply filtering
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

    // If a filter is selected, only return that group
    if (selectedFilter) {
      return { [selectedFilter]: groups[selectedFilter] || [] };
    }

    return groups;
  }, [items, selectedFilter]);

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
            onClick={handleBack}
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

        {/* Filter Section */}
        {subcategories.length > 1 && (
          <Box sx={{ mb: 3 }}>
            {/* Filter Header */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1.5,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <FilterList
                  sx={{
                    color: "#8C3A2B",
                    fontSize: { xs: 18, sm: 20 },
                  }}
                />
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    color: "#8C3A2B",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  Filter
                </Typography>
              </Box>

              {selectedFilter && (
                <Button
                  startIcon={<Clear />}
                  onClick={clearFilter}
                  size="small"
                  sx={{
                    color: "#757575",
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    fontWeight: 500,
                    textTransform: "none",
                    borderRadius: 2,
                    px: 1.5,
                    py: 0.5,
                    minWidth: "auto",
                    "&:hover": {
                      background: "rgba(140, 58, 43, 0.08)",
                      color: "#8C3A2B",
                    },
                  }}
                >
                  Clear
                </Button>
              )}
            </Box>

            {/* Horizontal Scrollable Filter Buttons */}
            <Box
              sx={{
                display: "flex",
                gap: 1,
                overflowX: "auto",
                pb: 1,
                px: 0.5,
                "&::-webkit-scrollbar": {
                  height: 4,
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "rgba(140, 58, 43, 0.3)",
                  borderRadius: 2,
                },
                "&::-webkit-scrollbar-track": {
                  background: "rgba(140, 58, 43, 0.1)",
                  borderRadius: 2,
                },
              }}
            >
              {/* All Items Button */}
              <Button
                variant={!selectedFilter ? "contained" : "outlined"}
                onClick={clearFilter}
                sx={{
                  flexShrink: 0,
                  px: 2,
                  py: 0.75,
                  borderRadius: 3,
                  fontWeight: 600,
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  textTransform: "none",
                  minWidth: "auto",
                  whiteSpace: "nowrap",
                  ...(!selectedFilter
                    ? {
                        background:
                          "linear-gradient(135deg, #8C3A2B 0%, #C66F53 100%)",
                        color: "white",
                        boxShadow: "0 2px 8px rgba(140, 58, 43, 0.3)",
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #A0442F 0%, #D87F5D 100%)",
                          boxShadow: "0 4px 12px rgba(140, 58, 43, 0.4)",
                        },
                      }
                    : {
                        borderColor: "rgba(140, 58, 43, 0.3)",
                        color: "#8C3A2B",
                        "&:hover": {
                          borderColor: "#8C3A2B",
                          background: "rgba(140, 58, 43, 0.05)",
                        },
                      }),
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                All Items
              </Button>

              {/* Subcategory Filter Buttons */}
              {subcategories.map((subcategory) => {
                const subcategoryItems = groupedItems[subcategory.id] || [];
                if (subcategoryItems.length === 0) return null;

                return (
                  <Button
                    key={subcategory.id}
                    variant={
                      selectedFilter === subcategory.id
                        ? "contained"
                        : "outlined"
                    }
                    onClick={() => handleFilterSelect(subcategory.id)}
                    sx={{
                      flexShrink: 0,
                      px: 2,
                      py: 0.75,
                      borderRadius: 3,
                      fontWeight: 600,
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      textTransform: "none",
                      minWidth: "auto",
                      whiteSpace: "nowrap",
                      ...(selectedFilter === subcategory.id
                        ? {
                            background:
                              "linear-gradient(135deg, #8C3A2B 0%, #C66F53 100%)",
                            color: "white",
                            boxShadow: "0 2px 8px rgba(140, 58, 43, 0.3)",
                            "&:hover": {
                              background:
                                "linear-gradient(135deg, #A0442F 0%, #D87F5D 100%)",
                              boxShadow: "0 4px 12px rgba(140, 58, 43, 0.4)",
                            },
                          }
                        : {
                            borderColor: "rgba(140, 58, 43, 0.3)",
                            color: "#8C3A2B",
                            "&:hover": {
                              borderColor: "#8C3A2B",
                              background: "rgba(140, 58, 43, 0.05)",
                            },
                          }),
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    {subcategory.name}
                  </Button>
                );
              })}

              {/* Other Items Button */}
              {groupedItems["none"] && groupedItems["none"].length > 0 && (
                <Button
                  variant={selectedFilter === "none" ? "contained" : "outlined"}
                  onClick={() => handleFilterSelect("none")}
                  sx={{
                    flexShrink: 0,
                    px: 2,
                    py: 0.75,
                    borderRadius: 3,
                    fontWeight: 600,
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    textTransform: "none",
                    minWidth: "auto",
                    whiteSpace: "nowrap",
                    ...(selectedFilter === "none"
                      ? {
                          background:
                            "linear-gradient(135deg, #8C3A2B 0%, #C66F53 100%)",
                          color: "white",
                          boxShadow: "0 2px 8px rgba(140, 58, 43, 0.3)",
                          "&:hover": {
                            background:
                              "linear-gradient(135deg, #A0442F 0%, #D87F5D 100%)",
                            boxShadow: "0 4px 12px rgba(140, 58, 43, 0.4)",
                          },
                        }
                      : {
                          borderColor: "rgba(140, 58, 43, 0.3)",
                          color: "#8C3A2B",
                          "&:hover": {
                            borderColor: "#8C3A2B",
                            background: "rgba(140, 58, 43, 0.05)",
                          },
                        }),
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  Other Items
                </Button>
              )}
            </Box>
          </Box>
        )}

        {/* Filter Status Message */}
        {selectedFilter && (
          <Box
            sx={{
              mb: 3,
              p: 2,
              borderRadius: 2,
              background:
                "linear-gradient(135deg, rgba(140, 58, 43, 0.1) 0%, rgba(198, 111, 83, 0.1) 100%)",
              border: "1px solid rgba(140, 58, 43, 0.2)",
              textAlign: "center",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                color: "#8C3A2B",
                fontSize: { xs: "0.875rem", sm: "1rem" },
              }}
            >
              {selectedFilter === "none"
                ? "Showing: Other Items"
                : `Showing: ${
                    subcategories.find((sub) => sub.id === selectedFilter)
                      ?.name || "Selected Items"
                  }`}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#757575",
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                mt: 0.5,
              }}
            >
              Click "Show All" to view all items
            </Typography>
          </Box>
        )}

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

      {/* Back to Top Button */}
      {showBackToTop && (
        <Fab
          color="primary"
          size="medium"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          sx={{
            position: "fixed",
            bottom: { xs: 16, sm: 24 },
            right: { xs: 16, sm: 24 },
            zIndex: 1000,
            background: "linear-gradient(135deg, #8C3A2B 0%, #C66F53 100%)",
            boxShadow: "0 8px 24px rgba(140, 58, 43, 0.3)",
            "&:hover": {
              background: "linear-gradient(135deg, #A0442F 0%, #D87F5D 100%)",
              boxShadow: "0 12px 32px rgba(140, 58, 43, 0.4)",
              transform: "scale(1.05)",
            },
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          title="Back to top"
        >
          <KeyboardArrowUp />
        </Fab>
      )}
    </Box>
  );
};

export default CategoryDetail;
