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
  Checkbox,
  Switch,
  Divider,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Close, Visibility, VisibilityOff } from "@mui/icons-material";
import ImageUploadField from "./ImageUploadField";

/**
 * EditItemDialog Component
 * Allows managers to edit menu item details
 */
const EditItemDialog = ({
  open,
  onClose,
  item,
  onSave,
  onUpload,
  subcategories = [],
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    isVegetarian: false,
    isSpicy: false,
    isActive: true,
    subcategoryId: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || "",
        description: item.description || "",
        price: item.price || "",
        image: item.image || "",
        isVegetarian: item.isVegetarian || false,
        isSpicy: item.isSpicy || false,
        isActive: item.isActive !== undefined ? item.isActive : true,
        subcategoryId: item.subcategoryId || "",
      });
    }
  }, [item]);

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
      const updatedItem = {
        ...item,
        ...formData,
        price: parseFloat(formData.price),
      };
      await onSave(updatedItem);
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
            Edit Menu Item
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
            label="Item Name"
            value={formData.name}
            onChange={handleChange("name")}
            required
            disabled={loading}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={handleChange("description")}
            required
            disabled={loading}
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Price"
            type="number"
            value={formData.price}
            onChange={handleChange("price")}
            required
            disabled={loading}
            inputProps={{ step: "0.01", min: "0" }}
            sx={{ mb: 2 }}
          />

          {subcategories.length > 0 && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Subheading (Optional)</InputLabel>
              <Select
                value={formData.subcategoryId}
                onChange={handleChange("subcategoryId")}
                label="Subheading (Optional)"
                disabled={loading}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {subcategories.map((sub) => (
                  <MenuItem key={sub.id} value={sub.id}>
                    {sub.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <ImageUploadField
            label="Item Image"
            value={formData.image}
            onChange={(imageUrl) =>
              setFormData((prev) => ({ ...prev, image: imageUrl }))
            }
            onUpload={onUpload}
            folder="items"
            disabled={loading}
            helperText="Upload an image or paste an image URL"
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isVegetarian}
                  onChange={handleChange("isVegetarian")}
                  disabled={loading}
                />
              }
              label="Vegetarian"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isSpicy}
                  onChange={handleChange("isSpicy")}
                  disabled={loading}
                />
              }
              label="Spicy"
            />
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Visibility Control */}
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: formData.isActive
                ? "rgba(76, 175, 80, 0.08)"
                : "rgba(211, 47, 47, 0.08)",
              border: "1px solid",
              borderColor: formData.isActive
                ? "rgba(76, 175, 80, 0.3)"
                : "rgba(211, 47, 47, 0.3)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                {formData.isActive ? (
                  <Visibility sx={{ color: "#4CAF50", fontSize: 28 }} />
                ) : (
                  <VisibilityOff sx={{ color: "#d32f2f", fontSize: 28 }} />
                )}
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {formData.isActive
                      ? "Item Visible to Customers"
                      : "Item Hidden from Customers"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formData.isActive
                      ? "Customers can see and order this item"
                      : "This item won't appear on the customer menu"}
                  </Typography>
                </Box>
              </Box>
              <Switch
                checked={formData.isActive}
                onChange={handleChange("isActive")}
                disabled={loading}
                color={formData.isActive ? "success" : "default"}
              />
            </Box>
            {!formData.isActive && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                <strong>Note:</strong> This item is currently hidden. Toggle the
                switch to make it visible to customers.
              </Alert>
            )}
          </Box>
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
              minWidth: 100,
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

export default EditItemDialog;
