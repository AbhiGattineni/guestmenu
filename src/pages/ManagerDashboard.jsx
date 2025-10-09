// Import necessary libraries and components
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
  Chip,
  Tabs,
  Tab,
  AppBar,
  Toolbar,
  Fab,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Logout,
  Edit,
  Grass,
  LocalFireDepartment,
  Visibility,
  VisibilityOff,
  Home,
  Add,
  PhotoLibrary,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  fetchMenuCategories,
  fetchMenuItems,
  updateMenuItem,
  addCategory,
  toggleCategoryVisibility,
  addMenuItem, // Import addMenuItem
} from "../services/firebaseService";
import EditItemDialog from "../components/EditItemDialog";
import AddCategoryDialog from "../components/AddCategoryDialog";
import AddItemDialog from "../components/AddItemDialog"; // Import AddItemDialog

// Define the ManagerDashboard component
const ManagerDashboard = () => {
  // --- STATE MANAGEMENT ---
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addCategoryDialogOpen, setAddCategoryDialogOpen] = useState(false);
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false); // State for AddItemDialog

  // --- DATA FETCHING ---
  // Fetch categories when the component mounts
  useEffect(() => {
    loadCategories();
  }, []);

  // Fetch menu items when a category is selected
  useEffect(() => {
    if (selectedCategoryId) {
      loadItems(selectedCategoryId);
    }
  }, [selectedCategoryId]);

  // --- API INTERACTION ---
  // Load all menu categories
  const loadCategories = async () => {
    try {
      const data = await fetchMenuCategories(true); // true to include hidden
      setCategories(data);
      if (data.length > 0) {
        setSelectedCategoryId(data[0].id);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  // Load menu items for a specific category
  const loadItems = async (categoryId) => {
    setLoading(true);
    try {
      const data = await fetchMenuItems(categoryId, true); // true to include hidden
      setItems(data);
    } catch (error) {
      console.error("Error loading items:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- EVENT HANDLERS ---
  // Handle clicking the edit button for an item
  const handleEditClick = (item) => {
    setEditItem(item);
    setEditDialogOpen(true);
  };

  // Handle saving an updated menu item
  const handleSaveItem = async (updatedItem) => {
    try {
      await updateMenuItem(updatedItem);
      loadItems(selectedCategoryId); // Reload items to reflect changes
      console.log("Item saved successfully:", updatedItem);
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  // Handle adding a new item
  const handleAddItem = async (newItem) => {
    try {
      await addMenuItem({ ...newItem, categoryId: selectedCategoryId });
      loadItems(selectedCategoryId); // Reload items to reflect changes
      console.log("Item added successfully:", newItem);
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  // Handle changing the selected category tab
  const handleTabChange = (event, newValue) => {
    setSelectedCategoryId(newValue);
  };

  // Handle adding a new category
  const handleAddCategory = async (categoryData) => {
    try {
      const newCategory = await addCategory(categoryData);
      setCategories((prev) => [...prev, newCategory]);
      setSelectedCategoryId(newCategory.id); // Auto-select new category
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  // Handle toggling the visibility of a category
  const handleToggleCategoryVisibility = async (categoryId) => {
    try {
      const updatedCategory = await toggleCategoryVisibility(categoryId);
      setCategories((prev) =>
        prev.map((cat) => (cat.id === categoryId ? updatedCategory : cat))
      );
    } catch (error) {
      console.error("Error toggling category visibility:", error);
    }
  };

  // Handle user logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // --- RENDER LOGIC ---
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Top Application Bar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "linear-gradient(135deg, #2C1A12 0%, #3D2817 100%)",
        }}
      >
        <Toolbar sx={{ py: { xs: 1, sm: 1.5 }, px: { xs: 1, sm: 2 } }}>
          {/* Logo and Title */}
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <Box
              sx={{
                width: { xs: 36, sm: 48 },
                height: { xs: 36, sm: 48 },
                borderRadius: 2,
                background: "linear-gradient(135deg, #F2C14E 0%, #C8A97E 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: { xs: 1, sm: 2 },
              }}
            >
              <Typography variant="h4">🍽️</Typography>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ color: "white" }}>
                Manager Dashboard
              </Typography>
              <Typography variant="caption" sx={{ color: "#F2C14E" }}>
                {currentUser?.displayName || currentUser?.email || "Manager"}
              </Typography>
            </Box>
          </Box>
          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: { xs: 0.5, sm: 1.5 } }}>
            <Button
              startIcon={<PhotoLibrary />}
              onClick={() => navigate("/admin/banners")}
              variant="outlined"
              sx={{ color: "white", borderColor: "rgba(242, 193, 78, 0.3)" }}
            >
              Banners
            </Button>
            <Button
              startIcon={<Visibility />}
              onClick={() => navigate("/")}
              variant="outlined"
              sx={{ color: "white", borderColor: "rgba(242, 193, 78, 0.3)" }}
            >
              View Menu
            </Button>
            <Button onClick={handleLogout} variant="contained" color="primary">
              <Logout />
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Category Selection Tabs */}
      <Box sx={{ bgcolor: "white", position: "sticky", top: 80, zIndex: 100 }}>
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              py: 1,
            }}
          >
            <Tabs
              value={selectedCategoryId}
              onChange={handleTabChange}
              variant="scrollable"
            >
              {categories.map((category) => (
                <Tab
                  key={category.id}
                  label={`${category.icon} ${category.name}`}
                  value={category.id}
                  sx={{ opacity: category.isActive ? 1 : 0.5 }}
                />
              ))}
            </Tabs>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setAddCategoryDialogOpen(true)}
            >
              Add Category
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Main Content Grid for Menu Items */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress size={60} />
          </Box>
        ) : (
          <>
            {/* Category-level actions */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h6" color="text.secondary">
                {items.length} items in this category
              </Typography>
              {selectedCategoryId && (
                <Box>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setAddItemDialogOpen(true)}
                    sx={{ mr: 2 }}
                  >
                    Add Item
                  </Button>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={
                          categories.find((c) => c.id === selectedCategoryId)
                            ?.isActive ?? true
                        }
                        onChange={() =>
                          handleToggleCategoryVisibility(selectedCategoryId)
                        }
                      />
                    }
                    label="Category Visible"
                  />
                </Box>
              )}
            </Box>
            {/* Grid of menu items */}
            <Grid container spacing={3}>
              {items.map((item) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                  <Card sx={{ opacity: item.isActive ? 1 : 0.6 }}>
                    <CardMedia
                      component="img"
                      height="180"
                      image={item.image}
                      alt={item.name}
                    />
                    <CardContent>
                      <Typography variant="h6">{item.name}</Typography>
                      <Typography variant="body2">{item.description}</Typography>
                      <Chip label={`$${item.price.toFixed(2)}`} />
                      {item.isVegetarian && <Grass titleAccess="Vegetarian" />}
                      {item.isSpicy && (<LocalFireDepartment titleAccess="Spicy" />)}
                    </CardContent>
                    <CardActions>
                      <Button onClick={() => handleEditClick(item)}>
                        <Edit /> Edit
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Container>

      {/* Floating Action Button to return to menu */}
      <Fab
        color="secondary"
        onClick={() => navigate("/")}
        sx={{ position: "fixed", bottom: 24, right: 24 }}
      >
        <Home />
      </Fab>

      {/* Dialog for Editing an Item */}
      <EditItemDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        item={editItem}
        onSave={handleSaveItem}
      />

      {/* Dialog for Adding a Category */}
      <AddCategoryDialog
        open={addCategoryDialogOpen}
        onClose={() => setAddCategoryDialogOpen(false)}
        onSave={handleAddCategory}
      />

      {/* Dialog for Adding an Item */}
      <AddItemDialog
        open={addItemDialogOpen}
        onClose={() => setAddItemDialogOpen(false)}
        onSave={handleAddItem}
        categoryId={selectedCategoryId}
      />
    </Box>
  );
};

export default ManagerDashboard;
