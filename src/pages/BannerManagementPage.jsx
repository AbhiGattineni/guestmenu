import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
  Alert,
} from "@mui/material";
import { ArrowBack, Add, Delete, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  fetchBanners,
  addBanner,
  deleteBanner,
} from "../services/firebaseService";
import AddBannerDialog from "../components/AddBannerDialog";

/**
 * BannerManagementPage Component
 * Dedicated page for managing promotional banners
 */
const BannerManagementPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Load banners
  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    setLoading(true);
    try {
      const data = await fetchBanners();
      setBanners(data);
    } catch (error) {
      console.error("Error loading banners:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBanner = async (bannerData) => {
    try {
      const newBanner = await addBanner(bannerData);
      setBanners((prev) => [...prev, newBanner]);
      console.log("Banner added successfully:", newBanner);
    } catch (error) {
      console.error("Error adding banner:", error);
    }
  };

  const handleDeleteBanner = async (bannerId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this banner? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeletingId(bannerId);
    try {
      await deleteBanner(bannerId);
      setBanners((prev) => prev.filter((banner) => banner.id !== bannerId));
      console.log("Banner deleted successfully");
    } catch (error) {
      console.error("Error deleting banner:", error);
      alert("Failed to delete banner. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* App Bar */}
      <AppBar
        position="sticky"
        sx={{
          background: "linear-gradient(135deg, #F2C14E 0%, #C8A97E 100%)",
          color: "#2C1A12",
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            onClick={() => navigate("/admin")}
            sx={{ mr: 2, color: "#2C1A12" }}
          >
            <ArrowBack />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              🎪 Banner Management
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Manage promotional banners for the homepage slider
            </Typography>
          </Box>
          <Button
            startIcon={<Visibility />}
            onClick={() => navigate("/")}
            sx={{
              color: "#2C1A12",
              borderColor: "rgba(44,26,18,0.3)",
              mr: 2,
              "&:hover": {
                borderColor: "#2C1A12",
                bgcolor: "rgba(44,26,18,0.05)",
              },
            }}
            variant="outlined"
          >
            View Menu
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setAddDialogOpen(true)}
            sx={{
              bgcolor: "primary.main",
              color: "white",
              "&:hover": {
                bgcolor: "primary.dark",
              },
            }}
          >
            Add Banner
          </Button>
        </Toolbar>
      </AppBar>

      {/* Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          <strong>Tip:</strong> Banners appear in a sliding carousel on the
          customer homepage. They auto-advance every 5 seconds. Add compelling
          images and clear calls-to-action for best results.
        </Alert>

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 8,
            }}
          >
            <CircularProgress size={60} />
          </Box>
        ) : (
          <>
            <Typography
              variant="h6"
              sx={{ mb: 3, color: "text.secondary", fontWeight: 500 }}
            >
              {banners.length} active banner{banners.length !== 1 ? "s" : ""}
            </Typography>

            {banners.length === 0 ? (
              <Box
                sx={{
                  textAlign: "center",
                  py: 8,
                  px: 2,
                }}
              >
                <Typography variant="h5" color="text.secondary" gutterBottom>
                  No banners yet
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Create your first promotional banner to showcase special
                  offers on your menu homepage
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setAddDialogOpen(true)}
                  size="large"
                >
                  Add Your First Banner
                </Button>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {banners.map((banner) => (
                  <Grid item xs={12} md={6} key={banner.id}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 12px 32px rgba(44,26,18,0.12)",
                        },
                      }}
                    >
                      <Box sx={{ position: "relative" }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={banner.image}
                          alt={banner.title}
                          sx={{ objectFit: "cover" }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background:
                              "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.75) 100%)",
                            color: "white",
                            p: 2,
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 700, mb: 0.5 }}
                          >
                            {banner.title}
                          </Typography>
                          <Typography variant="body2">
                            {banner.description}
                          </Typography>
                        </Box>
                      </Box>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block", mb: 1 }}
                        >
                          Banner ID: {banner.id}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {banner.image}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ px: 2, pb: 2 }}>
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<Delete />}
                          onClick={() => handleDeleteBanner(banner.id)}
                          disabled={deletingId === banner.id}
                          fullWidth
                        >
                          {deletingId === banner.id ? (
                            <CircularProgress size={20} />
                          ) : (
                            "Delete"
                          )}
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </Container>

      {/* Add Banner Dialog */}
      <AddBannerDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSave={handleAddBanner}
      />
    </Box>
  );
};

export default BannerManagementPage;
