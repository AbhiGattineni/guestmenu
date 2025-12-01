import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import { RestaurantMenu, Verified } from "@mui/icons-material";

/**
 * RestaurantLogo Component - Ultra Modern Design
 * Premium glassmorphic header with smooth animations
 */
const RestaurantLogo = ({ logo, name, description }) => {
  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: "blur(20px) saturate(180%)",
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,250,245,0.95) 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.3)",
        boxShadow:
          "0 8px 32px rgba(0,0,0,0.06), inset 0 -1px 0 rgba(255,255,255,0.5)",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
          transform: "translateX(-100%)",
          animation: "shimmer 3s infinite",
        },
        "@keyframes shimmer": {
          "100%": { transform: "translateX(100%)" },
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: { xs: 2, sm: 2.5 },
          px: { xs: 2.5, sm: 3.5, md: 5 },
          maxWidth: "1400px",
          mx: "auto",
        }}
      >
        {/* Left: Logo and Name with Glow Effect */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 2, sm: 2.5 },
            flex: 1,
            minWidth: 0,
          }}
        >
          {/* Animated Logo Container */}
          {logo ? (
            <Box
              sx={{
                position: "relative",
                width: { xs: 56, sm: 64, md: 72 },
                height: { xs: 56, sm: 64, md: 72 },
                borderRadius: "18px",
                overflow: "hidden",
                boxShadow:
                  "0 10px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.8)",
                flexShrink: 0,
                background: "#fff",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  transform: "translateY(-4px) rotate(-2deg) scale(1.05)",
                  boxShadow:
                    "0 20px 60px rgba(140, 58, 43, 0.25), 0 0 0 2px rgba(140, 58, 43, 0.3)",
                },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(135deg, transparent, rgba(255,255,255,0.4))",
                  opacity: 0,
                  transition: "opacity 0.3s",
                },
                "&:hover::after": {
                  opacity: 1,
                },
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
                position: "relative",
                width: { xs: 56, sm: 64, md: 72 },
                height: { xs: 56, sm: 64, md: 72 },
                borderRadius: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  "linear-gradient(135deg, #FF6B6B 0%, #FFE66D 50%, #4ECDC4 100%)",
                flexShrink: 0,
                boxShadow: "0 10px 40px rgba(255,107,107,0.3)",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  transform: "translateY(-4px) rotate(2deg) scale(1.05)",
                  boxShadow: "0 20px 60px rgba(255,107,107,0.4)",
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  inset: "-2px",
                  borderRadius: "20px",
                  padding: "2px",
                  background:
                    "linear-gradient(45deg, #FF6B6B, #FFE66D, #4ECDC4, #FF6B6B)",
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                  animation: "rotate 3s linear infinite",
                },
                "@keyframes rotate": {
                  "100%": { transform: "rotate(360deg)" },
                },
              }}
            >
              <RestaurantMenu
                sx={{
                  fontSize: { xs: "2rem", sm: "2.5rem" },
                  color: "#fff",
                  filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
                }}
              />
            </Box>
          )}

          {/* Store Name with Gradient and Glow */}
          <Box sx={{ minWidth: 0, overflow: "hidden" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="h5"
                component="h1"
                sx={{
                  background:
                    "linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
                  fontWeight: 800,
                  lineHeight: 1.2,
                  letterSpacing: "-0.02em",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  textShadow: "0 2px 10px rgba(0,0,0,0.05)",
                }}
              >
                {name}
              </Typography>
              <Verified
                sx={{
                  color: "#4ECDC4",
                  fontSize: { xs: "1rem", sm: "1.25rem" },
                  filter: "drop-shadow(0 2px 4px rgba(78,205,196,0.3))",
                  display: { xs: "none", sm: "block" },
                }}
              />
            </Box>
            {description && (
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(0,0,0,0.6)",
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  lineHeight: 1.4,
                  display: { xs: "none", sm: "block" },
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontWeight: 500,
                  letterSpacing: "0.01em",
                }}
              >
                {description}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Right: Premium Badge with Animation */}
        <Box sx={{ display: { xs: "none", md: "block" }, ml: 3 }}>
          <Chip
            label="✨ Order Now"
            sx={{
              fontWeight: 700,
              fontSize: "0.813rem",
              height: 38,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              borderRadius: "12px",
              px: 1.5,
              boxShadow:
                "0 8px 24px rgba(102,126,234,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
              border: "1px solid rgba(255,255,255,0.2)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              cursor: "pointer",
              "&:hover": {
                transform: "translateY(-2px) scale(1.05)",
                boxShadow: "0 12px 32px rgba(102,126,234,0.5)",
                background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
              },
              "& .MuiChip-label": {
                px: 1.5,
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default RestaurantLogo;
