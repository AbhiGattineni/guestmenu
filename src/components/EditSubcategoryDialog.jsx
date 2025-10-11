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
  FormControlLabel,
  Switch,
} from "@mui/material";
import { Close } from "@mui/icons-material";

/**
 * EditSubcategoryDialog Component
 * Dialog for editing an existing subheading/subcategory
 */
const EditSubcategoryDialog = ({ open, onClose, subcategory, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    order: 0,
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (subcategory) {
      setFormData({
        name: subcategory.name || "",
        description: subcategory.description || "",
        order: subcategory.order || 0,
        isActive:
          subcategory.isActive !== undefined ? subcategory.isActive : true,
      });
    }
  }, [subcategory]);

  const handleChange = (field) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({ ...subcategory, ...formData });
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
            Edit Subheading
          </Typography>
          <IconButton onClick={handleClose} disabled={loading}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            fullWidth
            label="Subheading Name"
            value={formData.name}
            onChange={handleChange("name")}
            required
            disabled={loading}
            sx={{ mb: 2 }}
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

          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={handleChange("isActive")}
                disabled={loading}
              />
            }
            label="Subheading Visible to Customers"
            sx={{ mb: 2 }}
          />
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
            {loading ? <CircularProgress size={24} /> : "Save Changes"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditSubcategoryDialog;
