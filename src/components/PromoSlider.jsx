import React, { useState, useEffect } from "react";
import { Box, IconButton, Typography, Chip } from "@mui/material";
import { ChevronLeft, ChevronRight, LocalOffer } from "@mui/icons-material";

/**
 * PromoSlider Component
 * Displays promotional banners in a sliding carousel
 */
const PromoSlider = ({ banners }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance slider every 5 seconds
  useEffect(() => {
    if (!banners || banners.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [banners]);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === banners.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
        borderRadius: 0,
        mb: 0,
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "100px",
          background:
            "linear-gradient(to bottom, transparent, rgba(255,250,245,0.3))",
          pointerEvents: "none",
          zIndex: 1,
        },
      }}
    >
      {/* Slider Container with Parallax Effect */}
      <Box
        sx={{
          display: "flex",
          transition: "transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {banners.map((banner, index) => (
          <Box
            key={banner.id}
            sx={{
              minWidth: "100%",
              position: "relative",
              height: { xs: "280px", sm: "400px", md: "500px" },
              transition: "all 0.8s ease",
              transform: index === currentIndex ? "scale(1)" : "scale(0.95)",
              opacity: index === currentIndex ? 1 : 0.7,
            }}
          >
            {/* Image with Ken Burns Effect */}
            <Box
              sx={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)",
                  zIndex: 1,
                },
              }}
            >
              <img
                src={banner.image}
                alt={banner.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  animation:
                    index === currentIndex
                      ? "kenBurns 10s ease-out infinite alternate"
                      : "none",
                }}
              />
            </Box>

            {/* Premium Overlay with Glassmorphism */}
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)",
                backdropFilter: "blur(10px) saturate(150%)",
                color: "white",
                p: { xs: 3, sm: 4, md: 5 },
                zIndex: 2,
              }}
            >
              {/* Promotional Badge */}
              <Chip
                icon={
                  <LocalOffer
                    sx={{ fontSize: "0.9rem", color: "#FFD700 !important" }}
                  />
                }
                label="SPECIAL OFFER"
                sx={{
                  mb: 2,
                  background:
                    "linear-gradient(135deg, rgba(255,215,0,0.2) 0%, rgba(255,165,0,0.2) 100%)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,215,0,0.3)",
                  color: "#FFD700",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  height: 28,
                  boxShadow: "0 4px 12px rgba(255,215,0,0.2)",
                  "& .MuiChip-icon": {
                    color: "#FFD700",
                  },
                }}
              />

              {/* Title with Gradient */}
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                  textShadow: "0 4px 12px rgba(0,0,0,0.5)",
                  mb: 1,
                  letterSpacing: "-0.03em",
                  background: "linear-gradient(135deg, #fff 0%, #f0f0f0 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  lineHeight: 1.2,
                }}
              >
                {banner.title}
              </Typography>

              {/* Description with Better Typography */}
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "0.938rem", sm: "1.063rem", md: "1.125rem" },
                  textShadow: "0 2px 6px rgba(0,0,0,0.4)",
                  lineHeight: 1.6,
                  maxWidth: "600px",
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.95)",
                }}
              >
                {banner.description}
              </Typography>
            </Box>

            {/* Decorative Corner Element */}
            <Box
              sx={{
                position: "absolute",
                top: 20,
                right: 20,
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2,
                animation: "float 3s ease-in-out infinite",
              }}
            >
              <Typography sx={{ fontSize: "1.5rem" }}>✨</Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Ken Burns Animation */}
      <style>
        {`
          @keyframes kenBurns {
            0% { transform: scale(1) translateX(0); }
            100% { transform: scale(1.1) translateX(-20px); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(5deg); }
          }
        `}
      </style>

      {/* Modern Floating Navigation Buttons */}
      {banners.length > 1 && (
        <>
          <IconButton
            onClick={handlePrevious}
            sx={{
              position: "absolute",
              left: { xs: 12, sm: 24 },
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 3,
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)",
              backdropFilter: "blur(20px) saturate(180%)",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.8)",
              border: "1px solid rgba(255,255,255,0.5)",
              borderRadius: "16px",
              width: { xs: 44, sm: 52 },
              height: { xs: 44, sm: 52 },
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                transform: "translateY(-50%) scale(1.1) translateX(-4px)",
                boxShadow: "0 12px 48px rgba(102,126,234,0.4)",
                "& svg": {
                  color: "#fff",
                },
              },
              "&:active": {
                transform: "translateY(-50%) scale(0.95)",
              },
            }}
          >
            <ChevronLeft
              sx={{
                fontSize: { xs: 24, sm: 28 },
                color: "#2a2a2a",
                transition: "color 0.3s",
              }}
            />
          </IconButton>
          <IconButton
            onClick={handleNext}
            sx={{
              position: "absolute",
              right: { xs: 12, sm: 24 },
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 3,
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)",
              backdropFilter: "blur(20px) saturate(180%)",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.8)",
              border: "1px solid rgba(255,255,255,0.5)",
              borderRadius: "16px",
              width: { xs: 44, sm: 52 },
              height: { xs: 44, sm: 52 },
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                transform: "translateY(-50%) scale(1.1) translateX(4px)",
                boxShadow: "0 12px 48px rgba(102,126,234,0.4)",
                "& svg": {
                  color: "#fff",
                },
              },
              "&:active": {
                transform: "translateY(-50%) scale(0.95)",
              },
            }}
          >
            <ChevronRight
              sx={{
                fontSize: { xs: 24, sm: 28 },
                color: "#2a2a2a",
                transition: "color 0.3s",
              }}
            />
          </IconButton>
        </>
      )}

      {/* Premium Dots Indicator with Progress Animation */}
      {banners.length > 1 && (
        <Box
          sx={{
            position: "absolute",
            bottom: { xs: 20, sm: 28 },
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: { xs: 1, sm: 1.5 },
            backgroundColor: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(20px) saturate(180%)",
            borderRadius: "24px",
            px: 2,
            py: 1.25,
            border: "1px solid rgba(255,255,255,0.2)",
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
            zIndex: 3,
          }}
        >
          {banners.map((_, index) => (
            <Box
              key={index}
              onClick={() => setCurrentIndex(index)}
              sx={{
                position: "relative",
                width:
                  index === currentIndex
                    ? { xs: 32, sm: 40 }
                    : { xs: 10, sm: 12 },
                height: { xs: 10, sm: 12 },
                borderRadius: "10px",
                cursor: "pointer",
                transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                overflow: "hidden",
                background:
                  index === currentIndex
                    ? "linear-gradient(90deg, #667eea 0%, #764ba2 100%)"
                    : "rgba(255, 255, 255, 0.3)",
                boxShadow:
                  index === currentIndex
                    ? "0 4px 12px rgba(102,126,234,0.5)"
                    : "none",
                "&:hover": {
                  background:
                    index === currentIndex
                      ? "linear-gradient(90deg, #764ba2 0%, #667eea 100%)"
                      : "rgba(255, 255, 255, 0.5)",
                  transform: "scale(1.1)",
                },
                "&::after":
                  index === currentIndex
                    ? {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                          "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                        animation: "shimmerDot 2s infinite",
                      }
                    : {},
              }}
            />
          ))}
        </Box>
      )}

      {/* Dot Shimmer Animation */}
      <style>
        {`
          @keyframes shimmerDot {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}
      </style>
    </Box>
  );
};

export default PromoSlider;
