import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  CircularProgress,
  Chip,
  Tabs,
  Tab,
} from "@mui/material";
import { Close, Edit, Grass, LocalFireDepartment, Add } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import {
  fetchMenuCategories,
  fetchMenuItems,
  updateMenuItem,
  addMenuItem,
} from "../services/firebaseService";
import EditItemDialog from "./EditItemDialog";
import AddItemDialog from "./AddItemDialog";

const AdminPanel = ({ open, onClose }) => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false);

  useEffect(() => {
    if (open) {
      loadCategories();
    }
  }, [open]);

  useEffect(() => {
    if (selectedCategoryId) {
      loadItems(selectedCategoryId);
    }
  }, [selectedCategoryId]);

  const loadCategories = async () => {
    try {
      const data = await fetchMenuCategories();
      setCategories(data);
      if (data.length > 0) {
        setSelectedCategoryId(data[0].id);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const loadItems = async (categoryId) => {
    setLoading(true);
    try {
      const data = await fetchMenuItems(categoryId);
      setItems(data);
    } catch (error) {
      console.error("Error loading items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (item) => {
    setEditItem(item);
    setEditDialogOpen(true);
  };

  const handleSaveItem = async (updatedItem) => {
    try {
      await updateMenuItem(updatedItem);
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === updatedItem.id ? updatedItem : item
        )
      );
      console.log("Item saved successfully:", updatedItem);
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  const handleAddItem = async (newItem) => {
    try {
      const itemWithCategoryId = { ...newItem, categoryId: selectedCategoryId };
      const addedItem = await addMenuItem(itemWithCategoryId);
      setItems((prevItems) => [...prevItems, addedItem]);
      console.log("Item added successfully:", addedItem);
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedCategoryId(newValue);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth fullScreen>
        <DialogTitle
          sx={{
            borderBottom: "1px solid rgba(0,0,0,0.1)",
            bgcolor: "background.default",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Admin Panel
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Welcome, {user?.name} - Manage menu items
              </Typography>
            </Box>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 0, bgcolor: "background.default" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "white" }}>
            <Tabs
              value={selectedCategoryId}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ px: 2 }}
            >
              {categories.map((category) => (
                <Tab
                  key={category.id}
                  label={`${category.icon} ${category.name}`}
                  value={category.id}
                />
              ))}
            </Tabs>
          </Box>

          <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 3, display: "flex", justifyContent: "flex-end" }}>
              <Button
                startIcon={<Add />}
                variant="contained"
                onClick={() => setAddItemDialogOpen(true)}
                sx={{
                  background: "linear-gradient(135deg, #8C3A2B 0%, #C66F53 100%)",
                }}
              >
                Add Item
              </Button>
            </Box>

            {loading ? (
              <Box
                sx={{ display: "flex", justifyContent: "center", py: 8 }}
              >
                <CircularProgress size={60} />
              </Box>
            ) : (
              <Grid container spacing={3}>
                {items.map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item.id}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="180"
                        image={item.image}
                        alt={item.name}
                        sx={{ objectFit: "cover" }}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 1,
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 700, fontSize: "1rem" }}
                          >
                            {item.name}
                          </Typography>
                          <Box sx={{ display: "flex", gap: 0.5 }}>
                            {item.isVegetarian && (
                              <Grass
                                sx={{ fontSize: 18, color: "#4CAF50" }}
                                titleAccess="Vegetarian"
                              />
                            )}
                            {item.isSpicy && (
                              <LocalFireDepartment
                                sx={{ fontSize: 18, color: "#FF5722" }}
                                titleAccess="Spicy"
                              />
                            )}
                          </Box>
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 2 }}
                        >
                          {item.description}
                        </Typography>
                        <Chip
                          label={`$${item.price.toFixed(2)}`}
                          color="primary"
                          size="small"
                        />
                      </CardContent>
                      <CardActions sx={{ px: 2, pb: 2 }}>
                        <Button
                          startIcon={<Edit />}
                          variant="outlined"
                          fullWidth
                          onClick={() => handleEditClick(item)}
                        >
                          Edit
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </DialogContent>
      </Dialog>

      <EditItemDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        item={editItem}
        onSave={handleSaveItem}
      />

      <AddItemDialog
        open={addItemDialogOpen}
        onClose={() => setAddItemDialogOpen(false)}
        onSave={handleAddItem}
        categoryId={selectedCategoryId}
      />
    </>
  );
};

export default AdminPanel;
