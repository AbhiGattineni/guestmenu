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

const AddItemDialog = ({ open, onClose, onSave, categoryId }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData({
        name: "",
        description: "",
        price: "",
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
      console.error("Error saving item:", error);
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
            Add New Item
          </Typography>
          <IconButton onClick={handleClose} disabled={loading}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Add a new item to the selected category.
          </Typography>

          <TextField
            fullWidth
            label="Item Name"
            value={formData.name}
            onChange={handleChange("name")}
            required
            disabled={loading}
            sx={{ mb: 2 }}
            placeholder="e.g., Classic Burger"
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
            placeholder="Brief description of the item"
          />

          <TextField
            fullWidth
            label="Price"
            value={formData.price}
            onChange={handleChange("price")}
            required
            disabled={loading}
            type="number"
            sx={{ mb: 2 }}
            placeholder="e.g., 9.99"
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
            {loading ? <CircularProgress size={24} /> : "Add Item"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddItemDialog;
