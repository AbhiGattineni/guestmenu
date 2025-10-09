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
  Alert,
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
  Storefront,
  ErrorOutline,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getUserData,
  setManagerStoreId,
  clearManagerStoreId,
  fetchMenuCategories,
  fetchMenuItems,
  updateMenuItem,
  addCategory,
  toggleCategoryVisibility,
  addMenuItem,
} from "../services/firebaseService";
import EditItemDialog from "../components/EditItemDialog";
import AddCategoryDialog from "../components/AddCategoryDialog";
import AddItemDialog from "../components/AddItemDialog";

// Define the ManagerDashboard component
const ManagerDashboard = () => {
  // --- STATE MANAGEMENT ---
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // New state to track store assignment status: 'verifying', 'assigned', 'unassigned'
  const [storeStatus, setStoreStatus] = useState("verifying");

  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [items, setItems] = useState([]);
  const [loadingData, setLoadingData] = useState(false); // For loading categories/items
  const [editItem, setEditItem] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addCategoryDialogOpen, setAddCategoryDialogOpen] = useState(false);
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false);

  // --- STORE VERIFICATION & DATA FETCHING ---
  // 1. Verify manager's store assignment when the user is available
  useEffect(() => {
    if (!currentUser) {
      setStoreStatus("verifying");
      return;
    }

    const verifyStore = async () => {
      try {
        const userData = await getUserData(currentUser.uid);
        if (userData && userData.storeId) {
          setManagerStoreId(userData.storeId); // Set the storeId for all API calls
          setStoreStatus("assigned");
        } else {
          setStoreStatus("unassigned");
        }
      } catch (error) {
        console.error("Error verifying manager's store:", error);
        setStoreStatus("unassigned");
      }
    };

    verifyStore();
  }, [currentUser]);

  // 2. Load categories only after the store has been assigned
  useEffect(() => {
    if (storeStatus === "assigned") {
      loadCategories();
    }
  }, [storeStatus]);

  // 3. Load items when a category is selected
  useEffect(() => {
    if (storeStatus === "assigned" && selectedCategoryId) {
      loadItems(selectedCategoryId);
    }
  }, [selectedCategoryId, storeStatus]);


  // --- API INTERACTION ---
  const loadCategories = async () => {
    setLoadingData(true);
    try {
      const data = await fetchMenuCategories(true);
      setCategories(data);
      if (data.length > 0) {
        setSelectedCategoryId(data[0].id);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const loadItems = async (categoryId) => {
    setLoadingData(true);
    try {
      const data = await fetchMenuItems(categoryId, true);
      setItems(data);
    } catch (error) {
      console.error("Error loading items:", error);
    } finally {
      setLoadingData(false);
    }
  };

  // --- EVENT HANDLERS ---
  const handleEditClick = (item) => {
    setEditItem(item);
    setEditDialogOpen(true);
  };

  const handleSaveItem = async (updatedItem) => {
    try {
      await updateMenuItem(updatedItem);
      loadItems(selectedCategoryId);
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  const handleAddItem = async (newItem) => {
    try {
      await addMenuItem({ ...newItem, categoryId: selectedCategoryId });
      loadItems(selectedCategoryId);
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedCategoryId(newValue);
  };

  const handleAddCategory = async (categoryData) => {
    try {
      await addCategory(categoryData);
      loadCategories(); // Reload all categories to get the new one
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleToggleCategoryVisibility = async (categoryId) => {
    try {
      await toggleCategoryVisibility(categoryId);
      loadCategories(); // Reload to reflect visibility change
    } catch (error) {
      console.error("Error toggling category visibility:", error);
    }
  };

  const handleLogout = async () => {
    try {
      clearManagerStoreId(); // Clear the store ID on logout
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };


  // --- RENDER LOGIC ---

  // 1. Show loading spinner while verifying store assignment
  if (storeStatus === "verifying") {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Verifying your access...</Typography>
      </Box>
    );
  }

  // 2. Show error message if no store is assigned
  if (storeStatus === "unassigned") {
    return (
      <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 8 }}>
        <ErrorOutline sx={{ fontSize: 60, color: 'error.main' }} />
        <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
          No Store Assigned
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          You have not been assigned to a store. Please contact a super admin to get access to your store's dashboard.
        </Typography>
        <Button variant="contained" onClick={handleLogout} startIcon={<Logout />}>
          Logout
        </Button>
      </Container>
    );
  }

  // 3. Render the full dashboard if store is assigned
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
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
             <Storefront sx={{ color: '#F2C14E', mr: 2, fontSize: 30 }} />
            <Box>
              <Typography variant="h6" sx={{ color: "white" }}>
                Manager Dashboard
              </Typography>
              <Typography variant="caption" sx={{ color: "#F2C14E" }}>
                {currentUser?.email}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: { xs: 0.5, sm: 1.5 } }}>
             <Button
              startIcon={<Visibility />}
              onClick={() => navigate("/")}
              variant="outlined"
              sx={{ color: "white", borderColor: "rgba(242, 193, 78, 0.3)" }}
            >
              View Menu
            </Button>
            <Button onClick={handleLogout} variant="contained" color="error">
              <Logout />
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Category Selection Tabs */}
      <Box sx={{ bgcolor: "white", position: "sticky", top: 80, zIndex: 100, borderBottom: '1px solid #eee' }}>
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
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                       {category.icon && <span style={{ fontSize: '1.2rem' }}>{category.icon}</span>}
                      {category.name}
                      {!category.isActive && <Chip label="Hidden" size="small" sx={{ ml: 1, height: 18 }} />}
                    </Box>
                  }
                  value={category.id}
                  sx={{ opacity: category.isActive ? 1 : 0.6 }}
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
        {loadingData ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress size={60} />
          </Box>
        ) : (
          <>
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
              {selectedCategoryId && categories.find(c => c.id === selectedCategoryId) && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={() => setAddItemDialogOpen(true)}
                  >
                    Add Item
                  </Button>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={categories.find((c) => c.id === selectedCategoryId).isActive}
                        onChange={() => handleToggleCategoryVisibility(selectedCategoryId)}
                      />
                    }
                    label="Category Visible"
                  />
                </Box>
              )}
            </Box>
            
            {items.length > 0 ? (
              <Grid container spacing={3}>
                {items.map((item) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                    <Card sx={{ opacity: item.isActive ? 1 : 0.6, border: item.isActive ? '' : '2px dashed #d32f2f' }}>
                      <CardMedia
                        component="img"
                        height="180"
                        image={item.image}
                        alt={item.name}
                      />
                      {!item.isActive && (
                         <Chip label="Hidden" color="error" size="small" sx={{ position: 'absolute', top: 8, right: 8 }}/>
                      )}
                      <CardContent>
                        <Typography variant="h6" component="div">{item.name}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40 }}>{item.description}</Typography>
                        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip label={`$${item.price.toFixed(2)}`} color="primary" size="small" />
                          {item.isVegetarian && <Grass titleAccess="Vegetarian" color="success" />}
                          {item.isSpicy && <LocalFireDepartment titleAccess="Spicy" color="warning" />}
                        </Box>
                      </CardContent>
                      <CardActions>
                        <Button startIcon={<Edit />} fullWidth variant="outlined" onClick={() => handleEditClick(item)}>
                          Edit
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
                <Typography sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>No items found in this category. Use the "Add Item" button to get started.</Typography>
            )}
          </>
        )}
      </Container>

      {/* Dialogs */}
      <EditItemDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        item={editItem}
        onSave={handleSaveItem}
      />
      <AddCategoryDialog
        open={addCategoryDialogOpen}
        onClose={() => setAddCategoryDialogOpen(false)}
        onSave={handleAddCategory}
      />
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
