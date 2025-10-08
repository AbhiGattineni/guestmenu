import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Alert,
} from "@mui/material";
import { Close, Image } from "@mui/icons-material";

/**
 * AddBannerDialog Component
 * Allows managers to add new promotional banners
 */
const AddBannerDialog = ({ open, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);

  // Example high-quality food images from Unsplash
  const exampleImages = [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=400&fit=crop&q=80",
  ];

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleUseExample = (imageUrl) => {
    setFormData((prev) => ({
      ...prev,
      image: imageUrl,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave(formData);
      // Reset form
      setFormData({
        title: "",
        description: "",
        image: "",
      });
      onClose();
    } catch (error) {
      console.error("Error saving banner:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        title: "",
        description: "",
        image: "",
      });
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Add Promotional Banner
          </Typography>
          <IconButton onClick={handleClose} disabled={loading}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create a new promotional banner to showcase special offers, events,
            or featured items on your menu homepage.
          </Typography>

          <Alert severity="info" sx={{ mb: 3 }}>
            <strong>Image Tip:</strong> Use landscape images (1200x400px
            recommended) for best results. Try Unsplash.com for free
            high-quality food photos.
          </Alert>

          <TextField
            fullWidth
            label="Banner Title"
            value={formData.title}
            onChange={handleChange("title")}
            required
            disabled={loading}
            sx={{ mb: 2 }}
            placeholder="e.g., Weekend Special, Happy Hour, New Menu"
            autoFocus
          />

          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={handleChange("description")}
            required
            disabled={loading}
            multiline
            rows={2}
            sx={{ mb: 2 }}
            placeholder="e.g., Get 20% off on all orders above $50"
          />

          <TextField
            fullWidth
            label="Image URL"
            value={formData.image}
            onChange={handleChange("image")}
            required
            disabled={loading}
            sx={{ mb: 2 }}
            placeholder="https://images.unsplash.com/photo-..."
            helperText="Enter a URL for the banner image (1200x400px recommended)"
          />

          {/* Example Images */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Quick Examples (click to use):
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 1,
              }}
            >
              {exampleImages.map((img, index) => (
                <Box
                  key={index}
                  onClick={() => handleUseExample(img)}
                  sx={{
                    cursor: "pointer",
                    borderRadius: 1,
                    overflow: "hidden",
                    border: "2px solid",
                    borderColor:
                      formData.image === img ? "primary.main" : "divider",
                    transition: "all 0.2s",
                    "&:hover": {
                      borderColor: "primary.light",
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  <img
                    src={img}
                    alt={`Example ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "80px",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Box>

          {/* Preview */}
          {formData.image && (
            <Box
              sx={{
                p: 2,
                bgcolor: "background.default",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mb: 1 }}
              >
                Preview:
              </Typography>
              <Box
                sx={{
                  position: "relative",
                  borderRadius: 2,
                  overflow: "hidden",
                  height: 200,
                }}
              >
                <img
                  src={formData.image}
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <Box
                  sx={{
                    display: "none",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    bgcolor: "grey.200",
                    color: "text.secondary",
                  }}
                >
                  <Box sx={{ textAlign: "center" }}>
                    <Image sx={{ fontSize: 48, opacity: 0.5, mb: 1 }} />
                    <Typography variant="body2">Invalid image URL</Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.65) 100%)",
                    color: "white",
                    p: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {formData.title || "Banner Title"}
                  </Typography>
                  <Typography variant="body2">
                    {formData.description || "Banner description"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              minWidth: 120,
              background: "linear-gradient(135deg, #8C3A2B 0%, #C66F53 100%)",
            }}
          >
            {loading ? <CircularProgress size={24} /> : "Add Banner"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddBannerDialog;
