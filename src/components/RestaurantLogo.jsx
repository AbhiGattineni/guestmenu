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
        alignItems: "center",
        justifyContent: "space-between",
        py: { xs: 2, sm: 2.5 },
        px: { xs: 2, sm: 3, md: 4 },
        background: "linear-gradient(135deg, #FFFFFF 0%, #FFFBF7 100%)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      {/* Left: Logo and Name */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 1.5, sm: 2 },
          flex: 1,
          minWidth: 0,
        }}
      >
        {/* Logo */}
        {logo ? (
          <Box
            sx={{
              width: { xs: 48, sm: 56 },
              height: { xs: 48, sm: 56 },
              borderRadius: "8px", // Subtle rounded square - professional
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              border: "1px solid rgba(0,0,0,0.06)",
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
        ) : (
          <Box
            sx={{
              width: { xs: 48, sm: 56 },
              height: { xs: 48, sm: 56 },
              borderRadius: "8px", // Subtle rounded square
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              border: "1px solid rgba(0,0,0,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #8C3A2B 0%, #C66F53 100%)",
              flexShrink: 0,
            }}
          >
            <Typography
              sx={{
                color: "#fff",
                fontSize: { xs: "1.375rem", sm: "1.625rem" },
                fontWeight: 700,
              }}
            >
              {name?.charAt(0)?.toUpperCase() || "🍽️"}
            </Typography>
          </Box>
        )}

        {/* Store Name and Description */}
        <Box sx={{ minWidth: 0, overflow: "hidden" }}>
          <Typography
            variant="h5"
            component="h1"
            sx={{
              color: "#2C1A12",
              fontSize: { xs: "1.125rem", sm: "1.375rem", md: "1.5rem" },
              fontWeight: 700,
              lineHeight: 1.2,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {name}
          </Typography>
          {description && (
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontSize: { xs: "0.75rem", sm: "0.813rem" },
                lineHeight: 1.4,
                display: { xs: "none", sm: "block" },
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {description}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Right: Tagline Badge */}
      <Box sx={{ display: { xs: "none", md: "block" }, ml: 2 }}>
        <Chip
          label="Scan • Order • Enjoy"
          sx={{
            fontWeight: 600,
            fontSize: "0.75rem",
            height: 28,
            background: "linear-gradient(135deg, #8C3A2B 0%, #C66F53 100%)",
            color: "#fff",
            borderRadius: "6px",
            boxShadow: "0 2px 6px rgba(140, 58, 43, 0.2)",
            "& .MuiChip-label": {
              px: 2,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default RestaurantLogo;
