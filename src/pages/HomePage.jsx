import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  Divider,
  Link as MuiLink,
} from "@mui/material";
import {
  Restaurant,
  QrCode2,
  Smartphone,
  Dashboard,
  Speed,
  Security,
  Email,
  Phone,
  BusinessCenter,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

/**
 * HomePage Component
 * Landing page shown when no store subdomain is specified
 * Explains the app and how to onboard
 */
const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <QrCode2 sx={{ fontSize: 48 }} />,
      title: "QR Code Menu",
      description:
        "Customers scan and browse your menu instantly - no app download needed",
    },
    {
      icon: <Smartphone sx={{ fontSize: 48 }} />,
      title: "Mobile First",
      description:
        "Beautiful, responsive design that works perfectly on any device",
    },
    {
      icon: <Dashboard sx={{ fontSize: 48 }} />,
      title: "Easy Management",
      description:
        "Update menu items, prices, and photos in real-time from anywhere",
    },
    {
      icon: <Speed sx={{ fontSize: 48 }} />,
      title: "Lightning Fast",
      description:
        "Instant loading and seamless browsing experience for your customers",
    },
    {
      icon: <Security sx={{ fontSize: 48 }} />,
      title: "Secure & Reliable",
      description:
        "Built on Firebase with enterprise-grade security and 99.9% uptime",
    },
    {
      icon: <Restaurant sx={{ fontSize: 48 }} />,
      title: "Multi-Restaurant",
      description: "Perfect for single restaurants or multi-location chains",
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Hero Section */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #2C1A12 0%, #3D2817 50%, #8C3A2B 100%)",
          color: "white",
          py: { xs: 8, md: 12 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 20% 50%, rgba(242, 193, 78, 0.1), transparent 50%)",
          }}
        />
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ textAlign: "center", maxWidth: 800, mx: "auto" }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                fontWeight: 800,
                mb: 2,
                fontFamily: "Playfair Display, serif",
              }}
            >
              MenuScanner
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: "1.25rem", md: "1.5rem" },
                mb: 4,
                color: "#F2C14E",
                fontWeight: 600,
              }}
            >
              Digital QR Code Menu for Modern Restaurants
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: "1rem", md: "1.125rem" },
                mb: 4,
                opacity: 0.9,
                lineHeight: 1.8,
              }}
            >
              Transform your restaurant with touchless digital menus. Let
              customers scan, browse, and order from their phones. Update your
              menu in real-time with our powerful dashboard.
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<BusinessCenter />}
                sx={{
                  bgcolor: "#F2C14E",
                  color: "#2C1A12",
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  "&:hover": {
                    bgcolor: "#C8A97E",
                  },
                }}
                href="#contact"
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: "white",
                  color: "white",
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  "&:hover": {
                    borderColor: "#F2C14E",
                    bgcolor: "rgba(242, 193, 78, 0.1)",
                  },
                }}
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography
          variant="h2"
          sx={{
            textAlign: "center",
            mb: 6,
            fontSize: { xs: "2rem", md: "2.75rem" },
            fontWeight: 700,
            fontFamily: "Playfair Display, serif",
            color: "primary.main",
          }}
        >
          Why MenuScanner?
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 40px rgba(44,26,18,0.15)",
                  },
                }}
              >
                <CardContent sx={{ textAlign: "center", p: 4 }}>
                  <Box sx={{ color: "primary.main", mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, mb: 1.5, color: "primary.main" }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Box sx={{ bgcolor: "#FFF9F1", py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              textAlign: "center",
              mb: 6,
              fontSize: { xs: "2rem", md: "2.75rem" },
              fontWeight: 700,
              fontFamily: "Playfair Display, serif",
              color: "primary.main",
            }}
          >
            How It Works
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: "center" }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2rem",
                    fontWeight: 700,
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  1
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Sign Up
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Contact us to create your restaurant account and get started
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: "center" }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2rem",
                    fontWeight: 700,
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  2
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Upload Menu
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Add your menu items, prices, photos, and customize your
                  branding
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: "center" }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2rem",
                    fontWeight: 700,
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  3
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Share QR Code
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Print your QR code on tables and let customers scan to view
                  the menu
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Contact Section */}
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }} id="contact">
        <Card
          sx={{
            background: "linear-gradient(135deg, #2C1A12 0%, #3D2817 100%)",
            color: "white",
            p: { xs: 4, md: 6 },
          }}
        >
          <Typography
            variant="h3"
            sx={{
              textAlign: "center",
              mb: 3,
              fontSize: { xs: "1.75rem", md: "2.5rem" },
              fontWeight: 700,
              fontFamily: "Playfair Display, serif",
            }}
          >
            Ready to Get Started?
          </Typography>
          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              mb: 4,
              fontSize: "1.125rem",
              opacity: 0.9,
            }}
          >
            Contact us today to set up your restaurant's digital menu
          </Typography>
          <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)", mb: 4 }} />
          <Stack spacing={3}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Email sx={{ fontSize: 32, color: "#F2C14E" }} />
              <Box>
                <Typography variant="subtitle2" sx={{ opacity: 0.7, mb: 0.5 }}>
                  Email
                </Typography>
                <MuiLink
                  href="mailto:contact@menuscanner.com"
                  sx={{
                    color: "#F2C14E",
                    fontSize: "1.125rem",
                    fontWeight: 600,
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  contact@menuscanner.com
                </MuiLink>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Phone sx={{ fontSize: 32, color: "#F2C14E" }} />
              <Box>
                <Typography variant="subtitle2" sx={{ opacity: 0.7, mb: 0.5 }}>
                  Phone
                </Typography>
                <MuiLink
                  href="tel:+1234567890"
                  sx={{
                    color: "#F2C14E",
                    fontSize: "1.125rem",
                    fontWeight: 600,
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  +1 (234) 567-890
                </MuiLink>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <BusinessCenter sx={{ fontSize: 32, color: "#F2C14E" }} />
              <Box>
                <Typography variant="subtitle2" sx={{ opacity: 0.7, mb: 0.5 }}>
                  Business Hours
                </Typography>
                <Typography sx={{ fontSize: "1.125rem", fontWeight: 600 }}>
                  Monday - Friday: 9:00 AM - 6:00 PM
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Card>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          bgcolor: "#2C1A12",
          color: "white",
          py: 4,
          mt: "auto",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="body2"
            sx={{ textAlign: "center", opacity: 0.7 }}
          >
            © {new Date().getFullYear()} MenuScanner. All rights reserved.
          </Typography>
          <Typography
            variant="body2"
            sx={{ textAlign: "center", mt: 1, opacity: 0.7 }}
          >
            Powered by Firebase & React
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
