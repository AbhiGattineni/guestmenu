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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Close } from "@mui/icons-material";

/**
 * AddCategoryDialog Component
 * Allows managers to add new menu categories
 */
const AddCategoryDialog = ({ open, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "🍽️",
  });
  const [loading, setLoading] = useState(false);

  // Common food category icons
  const iconOptions = [
    { value: "🍽️", label: "🍽️ Plate" },
    { value: "🥗", label: "🥗 Salad" },
    { value: "🍝", label: "🍝 Pasta" },
    { value: "🍰", label: "🍰 Cake" },
    { value: "🥤", label: "🥤 Drink" },
    { value: "🥣", label: "🥣 Bowl" },
    { value: "⭐", label: "⭐ Star" },
    { value: "🍕", label: "🍕 Pizza" },
    { value: "🍔", label: "🍔 Burger" },
    { value: "🍣", label: "🍣 Sushi" },
    { value: "🍜", label: "🍜 Noodles" },
    { value: "🥘", label: "🥘 Stew" },
    { value: "🍖", label: "🍖 Meat" },
    { value: "🐟", label: "🐟 Fish" },
    { value: "🥩", label: "🥩 Steak" },
    { value: "🍲", label: "🍲 Pot" },
    { value: "🥙", label: "🥙 Wrap" },
    { value: "🌮", label: "🌮 Taco" },
    { value: "🍱", label: "🍱 Bento" },
    { value: "🍛", label: "🍛 Curry" },
    { value: "☕", label: "☕ Coffee" },
    { value: "🍷", label: "🍷 Wine" },
    { value: "🍺", label: "🍺 Beer" },
    { value: "🧃", label: "🧃 Juice" },
    { value: "🍨", label: "🍨 Ice Cream" },
    { value: "🧁", label: "🧁 Cupcake" },
    { value: "🍪", label: "🍪 Cookie" },
    { value: "🥖", label: "🥖 Bread" },
    { value: "🥐", label: "🥐 Croissant" },
    { value: "🌶️", label: "🌶️ Spicy" },
  ];

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
      // Reset form
      setFormData({
        name: "",
        description: "",
        icon: "🍽️",
      });
      onClose();
    } catch (error) {
      console.error("Error saving category:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        name: "",
        description: "",
        icon: "🍽️",
      });
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
            Add New Category
          </Typography>
          <IconButton onClick={handleClose} disabled={loading}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create a new menu category to organize your items.
          </Typography>

          <TextField
            fullWidth
            label="Category Name"
            value={formData.name}
            onChange={handleChange("name")}
            required
            disabled={loading}
            sx={{ mb: 2 }}
            placeholder="e.g., Breakfast, Lunch Specials, Drinks"
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
            placeholder="Brief description of this category"
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Category Icon</InputLabel>
            <Select
              value={formData.icon}
              onChange={handleChange("icon")}
              label="Category Icon"
              disabled={loading}
            >
              {iconOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h4">{formData.icon}</Typography>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {formData.name || "Category Name"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formData.description || "Category description"}
                </Typography>
              </Box>
            </Box>
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
              minWidth: 120,
              background: "linear-gradient(135deg, #8C3A2B 0%, #C66F53 100%)",
            }}
          >
            {loading ? <CircularProgress size={24} /> : "Add Category"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddCategoryDialog;
