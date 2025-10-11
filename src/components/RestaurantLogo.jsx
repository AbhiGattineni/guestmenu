import React from "react";
import { Box, Typography, Chip } from "@mui/material";

/**
 * RestaurantLogo Component
 * Displays the restaurant's logo and name at the top of the page
 */
const RestaurantLogo = ({ logo, name, description }) => {
  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: { xs: 1.5, sm: 2 },
        py: { xs: 2.5, sm: 3 },
        px: { xs: 2, sm: 3 },
        background: "linear-gradient(180deg, #FFFFFF 0%, #FFF9F1 100%)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 80% 20%, rgba(200,169,126,0.12), transparent 40%)",
          pointerEvents: "none",
        }}
      />

      {/* Logo and Name Row */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 2, sm: 2.5 },
          zIndex: 1,
        }}
      >
        {/* Logo */}
        {logo && (
          <Box
            sx={{
              width: { xs: 52, sm: 64 },
              height: { xs: 52, sm: 64 },
              borderRadius: "50%",
              overflow: "hidden",
              boxShadow: "0 6px 20px rgba(140, 58, 43, 0.2)",
              border: "3px solid #fff",
              flexShrink: 0,
              background: "#fff",
            }}
          >
            <img
              src={logo}
              alt={`${name} logo`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>
        )}

        {!logo && (
          <Box
            sx={{
              width: { xs: 52, sm: 64 },
              height: { xs: 52, sm: 64 },
              borderRadius: "50%",
              boxShadow: "0 6px 20px rgba(140, 58, 43, 0.2)",
              border: "3px solid #fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #C8A97E 0%, #F2C14E 100%)",
              flexShrink: 0,
            }}
          >
            <Typography
              sx={{
                color: "#2C1A12",
                fontSize: { xs: "1.5rem", sm: "1.75rem" },
                fontWeight: 700,
              }}
            >
              {name?.charAt(0)?.toUpperCase() || "🍽️"}
            </Typography>
          </Box>
        )}

        {/* Store Name */}
        <Typography
          variant="h4"
          component="h1"
          sx={{
            color: "primary.main",
            fontSize: { xs: "1.375rem", sm: "1.875rem", md: "2.125rem" },
            fontWeight: 700,
            lineHeight: 1.2,
            textShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}
        >
          {name}
        </Typography>
      </Box>

      {/* Description */}
      {description && (
        <Typography
          variant="subtitle1"
          sx={{
            color: "text.secondary",
            textAlign: "center",
            maxWidth: 720,
            px: { xs: 1, sm: 2 },
            fontSize: { xs: "0.875rem", sm: "1rem" },
            lineHeight: 1.6,
            zIndex: 1,
          }}
        >
          {description}
        </Typography>
      )}

      {/* Tagline Chip */}
      <Chip
        color="primary"
        variant="filled"
        label="Scan • Order • Enjoy"
        sx={{
          fontWeight: 600,
          fontSize: { xs: "0.75rem", sm: "0.813rem" },
          height: { xs: 28, sm: 32 },
          background: "linear-gradient(135deg, #C8A97E 0%, #F2C14E 100%)",
          color: "#2C1A12",
          zIndex: 1,
          boxShadow: "0 4px 12px rgba(200, 169, 126, 0.3)",
          "& .MuiChip-label": {
            px: { xs: 2, sm: 2.5 },
          },
        }}
      />
    </Box>
  );
};

export default RestaurantLogo;
