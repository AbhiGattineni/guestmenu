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
        gap: 1,
        py: { xs: 3, sm: 4 },
        background: "linear-gradient(180deg, #FFFFFF 0%, #FFF9F1 100%)",
        borderBottom: "1px solid rgba(44,26,18,0.06)",
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

      <Box
        sx={{
          width: { xs: 96, sm: 120 },
          height: { xs: 96, sm: 120 },
          borderRadius: "50%",
          overflow: "hidden",
          boxShadow: "0 10px 28px rgba(44,26,18,0.18)",
          border: "3px solid #C8A97E",
          mb: 1,
        }}
      >
        <img
          src={logo}
          alt={`${name} logo`}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Box>

      <Typography
        variant="h3"
        component="h1"
        sx={{
          textAlign: "center",
          color: "primary.main",
          fontSize: { xs: "1.75rem", sm: "2.25rem" },
          lineHeight: 1.2,
        }}
      >
        {name}
      </Typography>

      {description && (
        <Typography
          variant="subtitle1"
          sx={{
            color: "text.secondary",
            textAlign: "center",
            maxWidth: 720,
            px: 2,
          }}
        >
          {description}
        </Typography>
      )}

      <Chip
        color="primary"
        variant="filled"
        label="Scan • Order • Enjoy"
        sx={{
          mt: 1,
          fontWeight: 600,
          backgroundColor: "#C8A97E",
          color: "#2C1A12",
        }}
      />
    </Box>
  );
};

export default RestaurantLogo;
