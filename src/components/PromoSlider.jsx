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
        maxWidth: "1400px",
        margin: "0 auto",
        overflow: "hidden",
        backgroundColor: "transparent",
      }}
    >
      {/* Slider Container */}
      <Box
        sx={{
          display: "flex",
          transition: "transform 0.5s ease-in-out",
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {banners.map((banner) => (
          <Box
            key={banner.id}
            sx={{
              minWidth: "100%",
              position: "relative",
              height: { xs: "220px", sm: "360px", md: "420px" },
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
                  "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.65) 100%)",
                color: "white",
                p: { xs: 2, sm: 3 },
                display: "block",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  textShadow: "0 2px 8px rgba(0,0,0,0.4)",
                }}
              >
                {banner.title}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.95 }}>
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
              left: { xs: 6, sm: 16 },
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 1)",
              },
              width: { xs: 36, sm: 48 },
              height: { xs: 36, sm: 48 },
            }}
          >
            <ChevronLeft />
          </IconButton>
          <IconButton
            onClick={handleNext}
            sx={{
              position: "absolute",
              right: { xs: 6, sm: 16 },
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 1)",
              },
              width: { xs: 36, sm: 48 },
              height: { xs: 36, sm: 48 },
            }}
          >
            <ChevronRight />
          </IconButton>
        </>
      )}

      {/* Dots Indicator */}
      {banners.length > 1 && (
        <Box
          sx={{
            position: "absolute",
            bottom: 18,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 1.2,
          }}
        >
          {banners.map((_, index) => (
            <Box
              key={index}
              onClick={() => setCurrentIndex(index)}
              sx={{
                width: { xs: 9, sm: 11 },
                height: { xs: 9, sm: 11 },
                borderRadius: "999px",
                border: "1px solid rgba(255,255,255,0.6)",
                backgroundColor:
                  index === currentIndex
                    ? "#F2C14E"
                    : "rgba(255, 255, 255, 0.35)",
                boxShadow:
                  index === currentIndex
                    ? "0 0 0 4px rgba(242,193,78,0.25)"
                    : "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default PromoSlider;
