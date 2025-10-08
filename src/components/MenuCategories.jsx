import React from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CardActionArea,
  Chip,
} from "@mui/material";
import { ChevronRight } from "@mui/icons-material";

/**
 * MenuCategories Component
 * Displays a grid of menu categories that users can tap to view items
 */
const MenuCategories = ({ categories, onCategoryClick }) => {
  const handleCategoryClick = (category) => {
    if (onCategoryClick) {
      onCategoryClick(category);
    }
  };

  if (!categories || categories.length === 0) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="body1" color="text.secondary" textAlign="center">
          No menu categories available at the moment.
        </Typography>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        background:
          "linear-gradient(180deg, #FAF7F2 0%, #FFF 40%, #FAF7F2 100%)",
        minHeight: "60vh",
        py: { xs: 4, sm: 6 },
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: { xs: 3, sm: 5 } }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 700,
              color: "text.primary",
            }}
          >
            Explore Our Menu
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Hand-crafted dishes made with seasonal ingredients
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category.id}>
              <Card
                sx={{
                  height: "100%",
                  transition: "all 0.35s ease",
                  overflow: "hidden",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 16px 36px rgba(44,26,18,0.18)",
                  },
                }}
              >
                <CardActionArea
                  onClick={() => handleCategoryClick(category)}
                  sx={{ height: "100%" }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                      p: { xs: 2.5, sm: 3 },
                      position: "relative",
                    }}
                  >
                    {/* Category Icon */}
                    <Box
                      sx={{
                        fontSize: { xs: "3rem", sm: "3.5rem" },
                        mb: 1.5,
                      }}
                    >
                      {category.icon}
                    </Box>

                    {/* Category Name */}
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        fontWeight: 700,
                        mb: 0.5,
                        textAlign: "center",
                        color: "text.primary",
                        letterSpacing: 0.3,
                      }}
                    >
                      {category.name}
                    </Typography>

                    {/* Category Description */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ textAlign: "center", mb: 2 }}
                    >
                      {category.description}
                    </Typography>

                    {/* Item Count Badge */}
                    {category.itemCount && (
                      <Chip
                        label={`${category.itemCount} items`}
                        size="small"
                        sx={{
                          bgcolor: "#C8A97E",
                          color: "#2C1A12",
                          fontWeight: 600,
                        }}
                      />
                    )}

                    {/* Arrow Icon */}
                    <ChevronRight
                      sx={{
                        position: "absolute",
                        right: 14,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#C8A97E",
                        fontSize: "1.6rem",
                        opacity: 0.9,
                      }}
                    />
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default MenuCategories;
