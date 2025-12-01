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
import { ArrowForward, TrendingUp } from "@mui/icons-material";

/**
 * MenuCategories Component - Ultra Modern Design
 * Premium category cards with glassmorphism and smooth animations
 */
const MenuCategories = ({ categories, onCategoryClick }) => {
  const handleCategoryClick = (category) => {
    if (onCategoryClick) {
      onCategoryClick(category);
    }
  };

  if (!categories || categories.length === 0) {
    return (
      <Container sx={{ py: 8 }}>
        <Box
          sx={{
            textAlign: "center",
            p: 6,
            borderRadius: "24px",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,250,245,0.9) 100%)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.3)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
          }}
        >
          <Typography
            sx={{
              fontSize: "4rem",
              mb: 2,
              filter: "grayscale(1)",
              opacity: 0.5,
            }}
          >
            🍽️
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "rgba(0,0,0,0.6)",
              mb: 1,
            }}
          >
            No Categories Available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Check back soon for our delicious menu items
          </Typography>
        </Box>
      </Container>
    );
  }

  // Color palettes for category cards
  const gradients = [
    { from: "#667eea", to: "#764ba2", shadow: "rgba(102,126,234,0.3)" },
    { from: "#f093fb", to: "#f5576c", shadow: "rgba(240,147,251,0.3)" },
    { from: "#4facfe", to: "#00f2fe", shadow: "rgba(79,172,254,0.3)" },
    { from: "#43e97b", to: "#38f9d7", shadow: "rgba(67,233,123,0.3)" },
    { from: "#fa709a", to: "#fee140", shadow: "rgba(250,112,154,0.3)" },
    { from: "#30cfd0", to: "#330867", shadow: "rgba(48,207,208,0.3)" },
  ];

  return (
    <Box
      sx={{
        background:
          "linear-gradient(180deg, #fffaf5 0%, #fff 50%, #f8f9ff 100%)",
        minHeight: "70vh",
        py: { xs: 5, sm: 7, md: 9 },
        px: { xs: 2, sm: 3 },
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "300px",
          background:
            "radial-gradient(circle at top center, rgba(102,126,234,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        {/* Premium Header Section */}
        <Box
          sx={{
            textAlign: "center",
            mb: { xs: 5, sm: 6 },
            position: "relative",
          }}
        >
          {/* Trending Badge */}
          <Chip
            icon={
              <TrendingUp
                sx={{ fontSize: "1rem", color: "#667eea !important" }}
              />
            }
            label="Popular Choices"
            sx={{
              mb: 3,
              background:
                "linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(102,126,234,0.2)",
              color: "#667eea",
              fontWeight: 700,
              fontSize: "0.813rem",
              height: 32,
              boxShadow: "0 4px 12px rgba(102,126,234,0.15)",
            }}
          />

          {/* Main Heading with Gradient */}
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2rem", sm: "2.75rem", md: "3.25rem" },
              background: "linear-gradient(135deg, #1a1a1a 0%, #667eea 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2,
              letterSpacing: "-0.03em",
              lineHeight: 1.2,
            }}
          >
            Explore Our Menu
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: "1rem", sm: "1.125rem" },
              color: "rgba(0,0,0,0.6)",
              fontWeight: 500,
              maxWidth: "600px",
              mx: "auto",
              lineHeight: 1.7,
            }}
          >
            Handcrafted dishes made with passion & premium ingredients
          </Typography>

          {/* Decorative Line */}
          <Box
            sx={{
              width: "80px",
              height: "4px",
              background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "2px",
              mx: "auto",
              mt: 3,
              boxShadow: "0 4px 12px rgba(102,126,234,0.3)",
            }}
          />
        </Box>

        {/* Premium Category Grid */}
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {categories.map((category, index) => {
            const gradient = gradients[index % gradients.length];
            return (
              <Grid item xs={6} sm={6} md={4} key={category.id}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: "24px",
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)",
                    backdropFilter: "blur(20px) saturate(180%)",
                    border: "1px solid rgba(255,255,255,0.5)",
                    boxShadow: `0 10px 40px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)`,
                    transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                    overflow: "hidden",
                    position: "relative",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "5px",
                      background: `linear-gradient(90deg, ${gradient.from} 0%, ${gradient.to} 100%)`,
                      opacity: 0,
                      transition: "opacity 0.3s",
                    },
                    "&:hover": {
                      transform: "translateY(-12px) scale(1.02)",
                      boxShadow: `0 20px 60px ${gradient.shadow}, 0 0 0 1px ${gradient.from}40`,
                      "&::before": {
                        opacity: 1,
                      },
                      "& .category-icon": {
                        transform: "scale(1.2) rotate(10deg)",
                        filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.2))",
                      },
                      "& .category-arrow": {
                        opacity: 1,
                        transform: "translateX(0)",
                      },
                      "& .category-bg": {
                        opacity: 1,
                        transform: "scale(1.1) rotate(10deg)",
                      },
                    },
                    "&:active": {
                      transform: "translateY(-8px) scale(0.99)",
                    },
                  }}
                >
                  <CardActionArea
                    onClick={() => handleCategoryClick(category)}
                    sx={{ height: "100%", position: "relative" }}
                  >
                    {/* Background Gradient Blob */}
                    <Box
                      className="category-bg"
                      sx={{
                        position: "absolute",
                        top: -50,
                        right: -50,
                        width: "150px",
                        height: "150px",
                        borderRadius: "50%",
                        background: `linear-gradient(135deg, ${gradient.from}15 0%, ${gradient.to}15 100%)`,
                        opacity: 0,
                        transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    />

                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: { xs: 1.5, sm: 2 },
                        p: { xs: 3, sm: 3.5, md: 4 },
                        position: "relative",
                        minHeight: { xs: 180, sm: 220 },
                      }}
                    >
                      {/* Category Icon with Animation */}
                      <Box
                        className="category-icon"
                        sx={{
                          fontSize: { xs: "3.5rem", sm: "4rem", md: "4.5rem" },
                          mb: { xs: 1, sm: 1.5 },
                          transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                          filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.1))",
                        }}
                      >
                        {category.icon}
                      </Box>

                      {/* Category Name with Gradient on Hover */}
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                          fontWeight: 700,
                          fontSize: { xs: "1.063rem", sm: "1.25rem" },
                          textAlign: "center",
                          color: "#1a1a1a",
                          letterSpacing: "-0.01em",
                          lineHeight: 1.3,
                          mb: { xs: 0.5, sm: 1 },
                        }}
                      >
                        {category.name}
                      </Typography>

                      {/* Category Description */}
                      {category.description && (
                        <Typography
                          variant="body2"
                          sx={{
                            textAlign: "center",
                            fontSize: { xs: "0.813rem", sm: "0.938rem" },
                            lineHeight: 1.5,
                            color: "rgba(0,0,0,0.6)",
                            display: { xs: "none", sm: "block" },
                            fontWeight: 400,
                          }}
                        >
                          {category.description}
                        </Typography>
                      )}

                      {/* Arrow Icon - Appears on Hover */}
                      <Box
                        className="category-arrow"
                        sx={{
                          position: "absolute",
                          bottom: 16,
                          right: 16,
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background: `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%)`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: 0,
                          transform: "translateX(-10px)",
                          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                          boxShadow: `0 4px 12px ${gradient.shadow}`,
                        }}
                      >
                        <ArrowForward
                          sx={{ fontSize: "1rem", color: "#fff" }}
                        />
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};

export default MenuCategories;
