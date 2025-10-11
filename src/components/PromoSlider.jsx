import React, { useState, useEffect } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

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
        maxWidth: "100%", // Full width
        overflow: "hidden",
        borderRadius: 0, // No border radius for flush edge-to-edge look
        boxShadow: "none", // No shadow for cleaner integration
        mb: 0, // No margins
      }}
    >
      {/* Slider Container */}
      <Box
        sx={{
          display: "flex",
          transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {banners.map((banner) => (
          <Box
            key={banner.id}
            sx={{
              minWidth: "100%",
              position: "relative",
              height: { xs: "200px", sm: "340px", md: "400px" },
            }}
          >
            <img
              src={banner.image}
              alt={banner.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.65) 100%)", // Softer gradient
                color: "white",
                p: { xs: 2, sm: 3, md: 4 },
                display: "block",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "1.125rem", sm: "1.5rem", md: "1.75rem" },
                  textShadow: "0 1px 8px rgba(0,0,0,0.4)", // Softer shadow
                  mb: 0.5,
                  letterSpacing: "-0.02em", // Tighter, more professional
                }}
              >
                {banner.title}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  opacity: 0.92,
                  fontSize: { xs: "0.813rem", sm: "0.938rem", md: "1rem" },
                  textShadow: "0 1px 3px rgba(0,0,0,0.3)", // Subtle shadow
                  lineHeight: 1.5,
                }}
              >
                {banner.description}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Navigation Buttons */}
      {banners.length > 1 && (
        <>
          <IconButton
            onClick={handlePrevious}
            sx={{
              position: "absolute",
              left: { xs: 8, sm: 16 },
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: "rgba(255, 255, 255, 0.92)",
              backdropFilter: "blur(4px)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              borderRadius: "6px", // Matches banner style
              border: "1px solid rgba(0,0,0,0.05)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 1)",
                transform: "translateY(-50%) scale(1.05)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              },
              width: { xs: 36, sm: 40 },
              height: { xs: 36, sm: 40 },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <ChevronLeft
              sx={{ fontSize: { xs: 20, sm: 24 }, color: "#2C1A12" }}
            />
          </IconButton>
          <IconButton
            onClick={handleNext}
            sx={{
              position: "absolute",
              right: { xs: 8, sm: 16 },
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: "rgba(255, 255, 255, 0.92)",
              backdropFilter: "blur(4px)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              borderRadius: "6px", // Matches banner style
              border: "1px solid rgba(0,0,0,0.05)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 1)",
                transform: "translateY(-50%) scale(1.05)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              },
              width: { xs: 36, sm: 40 },
              height: { xs: 36, sm: 40 },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <ChevronRight
              sx={{ fontSize: { xs: 20, sm: 24 }, color: "#2C1A12" }}
            />
          </IconButton>
        </>
      )}

      {/* Dots Indicator */}
      {banners.length > 1 && (
        <Box
          sx={{
            position: "absolute",
            bottom: { xs: 12, sm: 16 },
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: { xs: 0.75, sm: 1 },
            backgroundColor: "rgba(0,0,0,0.15)", // More subtle background
            backdropFilter: "blur(4px)",
            borderRadius: "16px", // Less rounded, more refined
            px: 1.5,
            py: 0.75,
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          {banners.map((_, index) => (
            <Box
              key={index}
              onClick={() => setCurrentIndex(index)}
              sx={{
                width:
                  index === currentIndex
                    ? { xs: 24, sm: 28 }
                    : { xs: 8, sm: 10 }, // Active dot is wider
                height: { xs: 8, sm: 10 },
                borderRadius: "8px", // Pill shape instead of circle
                border: "none",
                backgroundColor:
                  index === currentIndex
                    ? "#F2C14E"
                    : "rgba(255, 255, 255, 0.4)",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  backgroundColor:
                    index === currentIndex
                      ? "#FFD966"
                      : "rgba(255, 255, 255, 0.6)",
                },
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default PromoSlider;
