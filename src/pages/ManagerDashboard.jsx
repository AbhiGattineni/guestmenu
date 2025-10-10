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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from "@mui/material";
import {
  Logout,
  Edit,
  Delete,
  Grass,
  LocalFireDepartment,
  Visibility,
  VisibilityOff,
  Home,
  Add,
  PhotoLibrary,
  Storefront,
  ErrorOutline,
  Restaurant,
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
  deleteCategory,
  deleteMenuItem,
  fetchBanners,
  addBanner,
  updateBanner,
  deleteBanner,
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
  const [deleteItemDialogOpen, setDeleteItemDialogOpen] = useState(false);
  const [deleteCategoryDialogOpen, setDeleteCategoryDialogOpen] =
    useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Banner management states
  const [viewMode, setViewMode] = useState("menu"); // "menu" or "banners"
  const [banners, setBanners] = useState([]);
  const [bannerDialogOpen, setBannerDialogOpen] = useState(false);
  const [editBanner, setEditBanner] = useState(null);
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const [deleteBannerDialogOpen, setDeleteBannerDialogOpen] = useState(false);
  const [bannerForm, setBannerForm] = useState({
    title: "",
    description: "",
    image: "",
  });

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

  // Banner loading
  useEffect(() => {
    if (storeStatus === "assigned" && viewMode === "banners") {
      loadBanners();
    }
  }, [viewMode, storeStatus]);

  const loadBanners = async () => {
    setLoadingData(true);
    try {
      const data = await fetchBanners();
      setBanners(data);
    } catch (error) {
      console.error("Error loading banners:", error);
    } finally {
      setLoadingData(false);
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

  const handleDeleteItemClick = (item) => {
    setItemToDelete(item);
    setDeleteItemDialogOpen(true);
  };

  const handleConfirmDeleteItem = async () => {
    try {
      await deleteMenuItem(itemToDelete.id);
      setDeleteItemDialogOpen(false);
      setItemToDelete(null);
      loadItems(selectedCategoryId); // Reload items
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleDeleteCategoryClick = (category) => {
    setCategoryToDelete(category);
    setDeleteCategoryDialogOpen(true);
  };

  const handleConfirmDeleteCategory = async () => {
    try {
      await deleteCategory(categoryToDelete.id);
      setDeleteCategoryDialogOpen(false);
      setCategoryToDelete(null);
      loadCategories(); // Reload categories
      setSelectedCategoryId(null); // Clear selection
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  // Banner handlers
  const handleAddBanner = () => {
    setEditBanner(null);
    setBannerForm({ title: "", description: "", image: "" });
    setBannerDialogOpen(true);
  };

  const handleEditBanner = (banner) => {
    setEditBanner(banner);
    setBannerForm({
      title: banner.title || "",
      description: banner.description || "",
      image: banner.image || "",
    });
    setBannerDialogOpen(true);
  };

  const handleSaveBanner = async () => {
    try {
      if (editBanner) {
        await updateBanner(editBanner.id, bannerForm);
      } else {
        await addBanner(bannerForm);
      }
      setBannerDialogOpen(false);
      loadBanners();
    } catch (error) {
      console.error("Error saving banner:", error);
    }
  };

  const handleDeleteBannerClick = (banner) => {
    setBannerToDelete(banner);
    setDeleteBannerDialogOpen(true);
  };

  const handleConfirmDeleteBanner = async () => {
    try {
      await deleteBanner(bannerToDelete.id);
      setDeleteBannerDialogOpen(false);
      setBannerToDelete(null);
      loadBanners();
    } catch (error) {
      console.error("Error deleting banner:", error);
    }
  };

  // --- RENDER LOGIC ---

  // 1. Show loading spinner while verifying store assignment
  if (storeStatus === "verifying") {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Verifying your access...</Typography>
      </Box>
    );
  }

  // 2. Show error message if no store is assigned
  if (storeStatus === "unassigned") {
    return (
      <Container maxWidth="sm" sx={{ textAlign: "center", mt: 8 }}>
        <ErrorOutline sx={{ fontSize: 60, color: "error.main" }} />
        <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
          No Store Assigned
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          You have not been assigned to a store. Please contact a super admin to
          get access to your store's dashboard.
        </Typography>
        <Button
          variant="contained"
          onClick={handleLogout}
          startIcon={<Logout />}
        >
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
            <Storefront sx={{ color: "#F2C14E", mr: 2, fontSize: 30 }} />
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
              startIcon={<Restaurant />}
              onClick={() => setViewMode("menu")}
              variant={viewMode === "menu" ? "contained" : "outlined"}
              sx={{
                color: viewMode === "menu" ? "#2C1A12" : "white",
                bgcolor: viewMode === "menu" ? "#F2C14E" : "transparent",
                borderColor: "rgba(242, 193, 78, 0.3)",
                display: { xs: "none", sm: "flex" },
              }}
            >
              Menu
            </Button>
            <Button
              startIcon={<PhotoLibrary />}
              onClick={() => setViewMode("banners")}
              variant={viewMode === "banners" ? "contained" : "outlined"}
              sx={{
                color: viewMode === "banners" ? "#2C1A12" : "white",
                bgcolor: viewMode === "banners" ? "#F2C14E" : "transparent",
                borderColor: "rgba(242, 193, 78, 0.3)",
                display: { xs: "none", sm: "flex" },
              }}
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
            <Button onClick={handleLogout} variant="contained" color="error">
              <Logout />
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Menu Management View */}
      {viewMode === "menu" && (
        <>
          {/* Category Selection Tabs */}
          <Box
            sx={{
              bgcolor: "white",
              position: "sticky",
              top: 80,
              zIndex: 100,
              borderBottom: "1px solid #eee",
            }}
          >
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
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          {category.icon && (
                            <span style={{ fontSize: "1.2rem" }}>
                              {category.icon}
                            </span>
                          )}
                          {category.name}
                          {!category.isActive && (
                            <Chip
                              label="Hidden"
                              size="small"
                              sx={{ ml: 1, height: 18 }}
                            />
                          )}
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
                  {selectedCategoryId &&
                    categories.find((c) => c.id === selectedCategoryId) && (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<Add />}
                          onClick={() => setAddItemDialogOpen(true)}
                        >
                          Add Item
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<Delete />}
                          onClick={() =>
                            handleDeleteCategoryClick(
                              categories.find(
                                (c) => c.id === selectedCategoryId
                              )
                            )
                          }
                        >
                          Delete Category
                        </Button>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={
                                categories.find(
                                  (c) => c.id === selectedCategoryId
                                ).isActive
                              }
                              onChange={() =>
                                handleToggleCategoryVisibility(
                                  selectedCategoryId
                                )
                              }
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
                        <Card
                          sx={{
                            opacity: item.isActive ? 1 : 0.6,
                            border: item.isActive ? "" : "2px dashed #d32f2f",
                          }}
                        >
                          <CardMedia
                            component="img"
                            height="180"
                            image={item.image}
                            alt={item.name}
                          />
                          {!item.isActive && (
                            <Chip
                              label="Hidden"
                              color="error"
                              size="small"
                              sx={{ position: "absolute", top: 8, right: 8 }}
                            />
                          )}
                          <CardContent>
                            <Typography variant="h6" component="div">
                              {item.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ minHeight: 40 }}
                            >
                              {item.description}
                            </Typography>
                            <Box
                              sx={{
                                mt: 1,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Chip
                                label={`$${item.price.toFixed(2)}`}
                                color="primary"
                                size="small"
                              />
                              {item.isVegetarian && (
                                <Grass
                                  titleAccess="Vegetarian"
                                  color="success"
                                />
                              )}
                              {item.isSpicy && (
                                <LocalFireDepartment
                                  titleAccess="Spicy"
                                  color="warning"
                                />
                              )}
                            </Box>
                          </CardContent>
                          <CardActions sx={{ display: "flex", gap: 1 }}>
                            <Button
                              startIcon={<Edit />}
                              fullWidth
                              variant="outlined"
                              onClick={() => handleEditClick(item)}
                            >
                              Edit
                            </Button>
                            <Button
                              startIcon={<Delete />}
                              fullWidth
                              variant="outlined"
                              color="error"
                              onClick={() => handleDeleteItemClick(item)}
                            >
                              Delete
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography
                    sx={{ textAlign: "center", py: 6, color: "text.secondary" }}
                  >
                    No items found in this category. Use the "Add Item" button
                    to get started.
                  </Typography>
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

          {/* Delete Item Confirmation Dialog */}
          <Dialog
            open={deleteItemDialogOpen}
            onClose={() => setDeleteItemDialogOpen(false)}
          >
            <DialogTitle>Delete Item</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete "{itemToDelete?.name}"? This
                action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setDeleteItemDialogOpen(false)}
                color="primary"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDeleteItem}
                color="error"
                variant="contained"
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          {/* Delete Category Confirmation Dialog */}
          <Dialog
            open={deleteCategoryDialogOpen}
            onClose={() => setDeleteCategoryDialogOpen(false)}
          >
            <DialogTitle>Delete Category</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete the category "
                {categoryToDelete?.name}"? Note: This will not automatically
                delete items in this category. Please delete or move items
                before deleting the category.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setDeleteCategoryDialogOpen(false)}
                color="primary"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDeleteCategory}
                color="error"
                variant="contained"
              >
                Delete Category
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}

      {/* Banner Management View */}
      {viewMode === "banners" && (
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Banner Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddBanner}
              sx={{
                background: "linear-gradient(135deg, #8C3A2B 0%, #C66F53 100%)",
              }}
            >
              Add Banner
            </Button>
          </Box>

          <Alert severity="info" sx={{ mb: 3 }}>
            Banners appear in a sliding carousel on your store's homepage. Add
            eye-catching images to promote special offers and deals.
          </Alert>

          {loadingData ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress size={60} />
            </Box>
          ) : banners.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <PhotoLibrary
                sx={{ fontSize: 80, color: "text.secondary", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No banners yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Create your first promotional banner to showcase special offers
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddBanner}
                sx={{
                  background:
                    "linear-gradient(135deg, #8C3A2B 0%, #C66F53 100%)",
                }}
              >
                Add Your First Banner
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {banners.map((banner) => (
                <Grid item xs={12} md={6} key={banner.id}>
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
                    <CardActions>
                      <Button
                        startIcon={<Edit />}
                        onClick={() => handleEditBanner(banner)}
                        fullWidth
                        variant="outlined"
                      >
                        Edit
                      </Button>
                      <Button
                        startIcon={<Delete />}
                        onClick={() => handleDeleteBannerClick(banner)}
                        fullWidth
                        variant="outlined"
                        color="error"
                      >
                        Delete
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Banner Dialog */}
          <Dialog
            open={bannerDialogOpen}
            onClose={() => setBannerDialogOpen(false)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              {editBanner ? "Edit Banner" : "Add Banner"}
            </DialogTitle>
            <DialogContent>
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
              >
                <TextField
                  label="Banner Title"
                  value={bannerForm.title}
                  onChange={(e) =>
                    setBannerForm({ ...bannerForm, title: e.target.value })
                  }
                  fullWidth
                  required
                />
                <TextField
                  label="Description"
                  value={bannerForm.description}
                  onChange={(e) =>
                    setBannerForm({
                      ...bannerForm,
                      description: e.target.value,
                    })
                  }
                  fullWidth
                  multiline
                  rows={2}
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
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setBannerDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveBanner} variant="contained">
                {editBanner ? "Update" : "Add"}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Delete Banner Dialog */}
          <Dialog
            open={deleteBannerDialogOpen}
            onClose={() => setDeleteBannerDialogOpen(false)}
          >
            <DialogTitle>Delete Banner</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete "{bannerToDelete?.title}"? This
                action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteBannerDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDeleteBanner}
                color="error"
                variant="contained"
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      )}
    </Box>
  );
};

export default ManagerDashboard;
