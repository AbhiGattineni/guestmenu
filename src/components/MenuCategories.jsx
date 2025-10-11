import React from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CardActionArea,
} from "@mui/material";

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
        background: "transparent",
        minHeight: "60vh",
        py: { xs: 3, sm: 5 },
        px: { xs: 1.5, sm: 2 },
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: { xs: 3, sm: 4 } }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.75rem", sm: "2.125rem" },
              color: "text.primary",
              mb: 1,
            }}
          >
            Explore Our Menu
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
          >
            Hand-crafted dishes made with seasonal ingredients
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
          {categories.map((category) => (
            <Grid item xs={6} sm={6} md={4} key={category.id}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: { xs: 3, sm: 4 },
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  background:
                    "linear-gradient(135deg, #FFFFFF 0%, #FFFBF7 100%)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  overflow: "hidden",
                  border: "1px solid rgba(200, 169, 126, 0.1)",
                  "&:hover": {
                    transform: "translateY(-4px) scale(1.02)",
                    boxShadow: "0 12px 40px rgba(140, 58, 43, 0.15)",
                    border: "1px solid rgba(200, 169, 126, 0.3)",
                  },
                  "&:active": {
                    transform: "translateY(-2px) scale(1.01)",
                  },
                }}
              >
                <CardActionArea
                  onClick={() => handleCategoryClick(category)}
                  sx={{
                    height: "100%",
                    "&:hover .category-arrow": {
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: { xs: 0.75, sm: 1 },
                      p: { xs: 2, sm: 2.5, md: 3 },
                      position: "relative",
                      minHeight: { xs: 140, sm: 180 },
                    }}
                  >
                    {/* Category Icon */}
                    <Box
                      sx={{
                        fontSize: { xs: "2.5rem", sm: "3rem", md: "3.5rem" },
                        mb: { xs: 0.5, sm: 1 },
                        filter:
                          "drop-shadow(0 2px 8px rgba(140, 58, 43, 0.15))",
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
                        fontSize: { xs: "0.938rem", sm: "1.125rem" },
                        mb: { xs: 0.25, sm: 0.5 },
                        textAlign: "center",
                        color: "text.primary",
                        letterSpacing: 0.2,
                        lineHeight: 1.3,
                      }}
                    >
                      {category.name}
                    </Typography>

                    {/* Category Description */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        textAlign: "center",
                        mb: { xs: 0.75, sm: 1.5 },
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        lineHeight: 1.4,
                        display: { xs: "none", sm: "block" },
                      }}
                    >
                      {category.description}
                    </Typography>
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
