import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Grid,
} from "@mui/material";
import { Add, Edit, Delete, Image as ImageIcon } from "@mui/icons-material";
import {
  getAllStores,
  getStoreBanners,
  createStoreBanner,
  updateStoreBanner,
  deleteStoreBanner,
} from "../../services/superAdminService";

/**
 * Banners Tab
 * Manage promotional banners across all stores
 */
const BannersTab = () => {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [bannerForm, setBannerForm] = useState({
    id: "",
    title: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    if (selectedStore) {
      fetchBanners();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStore]);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const data = await getAllStores();
      setStores(data);
      if (data.length > 0) {
        setSelectedStore(data[0].id);
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
      setError("Failed to load stores");
    } finally {
      setLoading(false);
    }
  };

  const fetchBanners = async () => {
    if (!selectedStore) return;

    try {
      setLoading(true);
      const data = await getStoreBanners(selectedStore);
      setBanners(data);
    } catch (error) {
      console.error("Error fetching banners:", error);
      setError("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBanner = async () => {
    try {
      setError("");
      if (!bannerForm.title || !bannerForm.image) {
        setError("Title and image URL are required");
        return;
      }

      await createStoreBanner(selectedStore, {
        title: bannerForm.title,
        description: bannerForm.description,
        image: bannerForm.image,
      });

      setSuccess("Banner created successfully!");
      setOpenDialog(false);
      resetForm();
      fetchBanners();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Failed to create banner");
    }
  };

  const handleUpdateBanner = async () => {
    try {
      setError("");
      if (!bannerForm.title || !bannerForm.image) {
        setError("Title and image URL are required");
        return;
      }

      await updateStoreBanner(selectedStore, bannerForm.id, {
        title: bannerForm.title,
        description: bannerForm.description,
        image: bannerForm.image,
      });

      setSuccess("Banner updated successfully!");
      setOpenDialog(false);
      resetForm();
      fetchBanners();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Failed to update banner");
    }
  };

  const handleDeleteBanner = async () => {
    try {
      await deleteStoreBanner(selectedStore, bannerToDelete.id);
      setSuccess("Banner deleted successfully!");
      setDeleteDialogOpen(false);
      setBannerToDelete(null);
      fetchBanners();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Failed to delete banner");
    }
  };

  const resetForm = () => {
    setBannerForm({
      id: "",
      title: "",
      description: "",
      image: "",
    });
    setIsEdit(false);
  };

  const openEditDialog = (banner) => {
    setBannerForm({
      id: banner.id,
      title: banner.title || "",
      description: banner.description || "",
      image: banner.image || "",
    });
    setIsEdit(true);
    setOpenDialog(true);
  };

  if (loading && !selectedStore) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: "100%", overflowX: "hidden" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Banner Management
        </Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Select Store</InputLabel>
          <Select
            value={selectedStore}
            label="Select Store"
            onChange={(e) => setSelectedStore(e.target.value)}
          >
            {stores.map((store) => (
              <MenuItem key={store.id} value={store.id}>
                {store.name || store.id}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      {/* Add Banner Button */}
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => {
          resetForm();
          setError("");
          setOpenDialog(true);
        }}
        sx={{ mb: 3 }}
      >
        Add Banner
      </Button>

      {/* Banners Grid */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      ) : banners.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <ImageIcon sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No banners yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create promotional banners to showcase on the store homepage
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ width: "100%" }}>
          {banners.map((banner) => (
            <Grid item xs={12} md={6} lg={4} key={banner.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={banner.image}
                  alt={banner.title}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    {banner.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {banner.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Button
                    size="small"
                    startIcon={<Edit />}
                    onClick={() => openEditDialog(banner)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => {
                      setBannerToDelete(banner);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{isEdit ? "Edit Banner" : "Create Banner"}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Banner Title"
              value={bannerForm.title}
              onChange={(e) =>
                setBannerForm({ ...bannerForm, title: e.target.value })
              }
              fullWidth
              required
              placeholder="e.g., Summer Special Offer"
            />
            <TextField
              label="Description"
              value={bannerForm.description}
              onChange={(e) =>
                setBannerForm({ ...bannerForm, description: e.target.value })
              }
              fullWidth
              multiline
              rows={2}
              placeholder="Brief description or tagline"
            />
            <TextField
              label="Image URL"
              value={bannerForm.image}
              onChange={(e) =>
                setBannerForm({ ...bannerForm, image: e.target.value })
              }
              fullWidth
              required
              placeholder="https://example.com/banner.jpg"
            />
            {bannerForm.image && (
              <Box
                sx={{
                  width: "100%",
                  height: 200,
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <img
                  src={bannerForm.image}
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </Box>
            )}
            {error && (
              <Alert severity="error" onClose={() => setError("")}>
                {error}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={isEdit ? handleUpdateBanner : handleCreateBanner}
            variant="contained"
          >
            {isEdit ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Banner</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "
            <strong>{bannerToDelete?.title}</strong>"? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteBanner}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BannersTab;
