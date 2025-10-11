import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { Close } from "@mui/icons-material";

/**
 * AddSubcategoryDialog Component
 * Dialog for adding a new subheading/subcategory within a category
 */
const AddSubcategoryDialog = ({ open, onClose, onSave, categoryId }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    order: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData({
        name: "",
        description: "",
        order: 0,
      });
    }
  }, [open]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving subcategory:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Add New Subheading
          </Typography>
          <IconButton onClick={handleClose} disabled={loading}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create a subheading to organize items within this category (e.g.,
            "Hot Drinks", "Cold Drinks", "Appetizers", "Main Course")
          </Typography>

          <TextField
            fullWidth
            label="Subheading Name"
            value={formData.name}
            onChange={handleChange("name")}
            required
            disabled={loading}
            sx={{ mb: 2 }}
            placeholder="e.g., Hot Drinks"
            autoFocus
          />

          <TextField
            fullWidth
            label="Description (Optional)"
            value={formData.description}
            onChange={handleChange("description")}
            disabled={loading}
            multiline
            rows={2}
            sx={{ mb: 2 }}
            placeholder="Brief description of this section"
          />

          <TextField
            fullWidth
            label="Display Order"
            type="number"
            value={formData.order}
            onChange={handleChange("order")}
            disabled={loading}
            sx={{ mb: 2 }}
            inputProps={{ min: "0" }}
            helperText="Order in which subheadings will appear (0 = first)"
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !categoryId}
            sx={{
              minWidth: 120,
              background: "linear-gradient(135deg, #8C3A2B 0%, #C66F53 100%)",
            }}
          >
            {loading ? <CircularProgress size={24} /> : "Add Subheading"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddSubcategoryDialog;
