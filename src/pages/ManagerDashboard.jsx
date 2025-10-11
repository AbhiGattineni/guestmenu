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
import ImageUploadField from "../components/ImageUploadField";
import { uploadImage, deleteImage } from "../services/imageUploadService";

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
        // If image was changed, delete old image from Storage
        if (editBanner.image && editBanner.image !== bannerForm.image) {
          await deleteImage(editBanner.image);
        }
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
      // Delete image from Firebase Storage if it's a Firebase Storage URL
      if (bannerToDelete?.image) {
        await deleteImage(bannerToDelete.image);
      }
      // Delete banner from Firestore
      await deleteBanner(bannerToDelete.id);
      setDeleteBannerDialogOpen(false);
      setBannerToDelete(null);
      loadBanners();
    } catch (error) {
      console.error("Error deleting banner:", error);
    }
  };

  // Image upload handler
  const handleImageUpload = async (file, folder) => {
    const userData = await getUserData(currentUser.uid);
    const clientId = userData.storeId || "demo-restaurant";
    return await uploadImage(file, folder, clientId);
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
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F5F5F7",
        overflowX: "hidden",
        width: "100%",
      }}
    >
      {/* Top Application Bar */}
      <AppBar
        position="sticky"
        elevation={2}
        sx={{
          background: "linear-gradient(135deg, #2C1A12 0%, #3D2817 100%)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          width: "100%",
        }}
      >
        <Toolbar
          sx={{
            py: { xs: 0.75, sm: 1.5 },
            px: { xs: 1, sm: 3 },
            minHeight: { xs: 56, sm: 64 },
            width: "100%",
            maxWidth: "100vw",
          }}
        >
          {/* Logo and Title */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
              minWidth: 0,
              overflow: "hidden",
              mr: 1,
            }}
          >
            <Storefront
              sx={{
                color: "#F2C14E",
                mr: { xs: 1, sm: 2 },
                fontSize: { xs: 24, sm: 30 },
              }}
            />
            <Box sx={{ minWidth: 0, overflow: "hidden" }}>
              <Typography
                variant="h6"
                sx={{
                  color: "white",
                  fontSize: { xs: "0.938rem", sm: "1.25rem" },
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Manager Dashboard
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "#F2C14E",
                  fontSize: { xs: "0.688rem", sm: "0.75rem" },
                  display: { xs: "none", sm: "block" },
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {currentUser?.email}
              </Typography>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              gap: { xs: 0.5, sm: 1 },
              flexShrink: 0,
              alignItems: "center",
            }}
          >
            {/* Menu Button */}
            <Button
              onClick={() => setViewMode("menu")}
              variant={viewMode === "menu" ? "contained" : "outlined"}
              size="small"
              sx={{
                color: viewMode === "menu" ? "#2C1A12" : "white",
                bgcolor: viewMode === "menu" ? "#F2C14E" : "transparent",
                borderColor: "rgba(242, 193, 78, 0.5)",
                minWidth: { xs: 32, sm: "auto" },
                width: { xs: 32, sm: "auto" },
                height: { xs: 32, sm: "auto" },
                px: { xs: 0, sm: 2 },
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                fontWeight: 600,
                borderRadius: 2,
                "&:hover": {
                  bgcolor:
                    viewMode === "menu" ? "#FFD966" : "rgba(242, 193, 78, 0.1)",
                  borderColor: "#F2C14E",
                },
              }}
            >
              <Restaurant
                sx={{ fontSize: { xs: 18, sm: 20 }, mr: { xs: 0, sm: 0.75 } }}
              />
              <Box
                component="span"
                sx={{ display: { xs: "none", sm: "inline" } }}
              >
                Menu
              </Box>
            </Button>

            {/* Banners Button */}
            <Button
              onClick={() => setViewMode("banners")}
              variant={viewMode === "banners" ? "contained" : "outlined"}
              size="small"
              sx={{
                color: viewMode === "banners" ? "#2C1A12" : "white",
                bgcolor: viewMode === "banners" ? "#F2C14E" : "transparent",
                borderColor: "rgba(242, 193, 78, 0.5)",
                minWidth: { xs: 32, sm: "auto" },
                width: { xs: 32, sm: "auto" },
                height: { xs: 32, sm: "auto" },
                px: { xs: 0, sm: 2 },
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                fontWeight: 600,
                borderRadius: 2,
                "&:hover": {
                  bgcolor:
                    viewMode === "banners"
                      ? "#FFD966"
                      : "rgba(242, 193, 78, 0.1)",
                  borderColor: "#F2C14E",
                },
              }}
            >
              <PhotoLibrary
                sx={{ fontSize: { xs: 18, sm: 20 }, mr: { xs: 0, sm: 0.75 } }}
              />
              <Box
                component="span"
                sx={{ display: { xs: "none", sm: "inline" } }}
              >
                Banners
              </Box>
            </Button>

            {/* View Menu Button - Hidden on mobile */}
            <Button
              onClick={() => navigate("/")}
              variant="outlined"
              size="small"
              sx={{
                color: "white",
                borderColor: "rgba(242, 193, 78, 0.5)",
                minWidth: "auto",
                px: 2,
                display: { xs: "none", md: "flex" },
                fontSize: "0.875rem",
                fontWeight: 600,
                borderRadius: 2,
                "&:hover": {
                  bgcolor: "rgba(242, 193, 78, 0.1)",
                  borderColor: "#F2C14E",
                },
              }}
            >
              <Visibility sx={{ fontSize: 20, mr: 0.75 }} />
              View Menu
            </Button>

            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              variant="contained"
              size="small"
              sx={{
                bgcolor: "#D32F2F",
                minWidth: { xs: 32, sm: "auto" },
                width: { xs: 32, sm: "auto" },
                height: { xs: 32, sm: "auto" },
                px: { xs: 0, sm: 1.5 },
                borderRadius: 2,
                "&:hover": {
                  bgcolor: "#C62828",
                },
              }}
            >
              <Logout sx={{ fontSize: { xs: 16, sm: 20 } }} />
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
              width: "100%",
              overflowX: "hidden",
            }}
          >
            <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "stretch", sm: "center" },
                  justifyContent: "space-between",
                  py: 1,
                  gap: { xs: 1, sm: 0 },
                }}
              >
                <Box sx={{ overflowX: "auto", flex: 1 }}>
                  <Tabs
                    value={selectedCategoryId}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                      minHeight: { xs: 40, sm: 48 },
                      "& .MuiTab-root": {
                        minHeight: { xs: 40, sm: 48 },
                        fontSize: { xs: "0.8rem", sm: "0.875rem" },
                        px: { xs: 1, sm: 2 },
                      },
                    }}
                  >
                    {categories.map((category) => (
                      <Tab
                        key={category.id}
                        label={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            {category.icon && (
                              <span
                                style={{
                                  fontSize: { xs: "1rem", sm: "1.2rem" },
                                }}
                              >
                                {category.icon}
                              </span>
                            )}
                            <span>{category.name}</span>
                            {!category.isActive && (
                              <Chip
                                label="Hidden"
                                size="small"
                                sx={{
                                  ml: 0.5,
                                  height: { xs: 16, sm: 18 },
                                  fontSize: { xs: "0.65rem", sm: "0.7rem" },
                                }}
                              />
                            )}
                          </Box>
                        }
                        value={category.id}
                        sx={{ opacity: category.isActive ? 1 : 0.6 }}
                      />
                    ))}
                  </Tabs>
                </Box>
                <Button
                  variant="contained"
                  startIcon={
                    <Add sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }} />
                  }
                  onClick={() => setAddCategoryDialogOpen(true)}
                  size="small"
                  sx={{
                    minWidth: { xs: "100%", sm: "auto" },
                    height: { xs: 36, sm: 40 },
                    fontSize: { xs: "0.8rem", sm: "0.875rem" },
                    px: { xs: 2, sm: 2 },
                    whiteSpace: "nowrap",
                  }}
                >
                  <Box
                    component="span"
                    sx={{ display: { xs: "none", sm: "inline" } }}
                  >
                    Add Category
                  </Box>
                  <Box
                    component="span"
                    sx={{ display: { xs: "inline", sm: "none" } }}
                  >
                    Add
                  </Box>
                </Button>
              </Box>
            </Container>
          </Box>

          {/* Main Content Grid for Menu Items */}
          <Container
            maxWidth="xl"
            sx={{
              py: { xs: 2.5, sm: 3, md: 4 },
              px: { xs: 1.5, sm: 2, md: 3 },
              width: "100%",
              maxWidth: "100%",
            }}
          >
            {loadingData ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress size={60} />
              </Box>
            ) : (
              <>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", md: "center" },
                    mb: 3,
                    gap: { xs: 2, md: 0 },
                  }}
                >
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{
                      fontSize: { xs: "0.95rem", sm: "1.1rem", md: "1.25rem" },
                    }}
                  >
                    {items.length} items in this category
                  </Typography>
                  {selectedCategoryId &&
                    categories.find((c) => c.id === selectedCategoryId) && (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "column", sm: "row" },
                          alignItems: { xs: "stretch", sm: "center" },
                          gap: { xs: 1, sm: 1.5, md: 2 },
                          width: { xs: "100%", sm: "auto" },
                        }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={
                            <Add
                              sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                            />
                          }
                          onClick={() => setAddItemDialogOpen(true)}
                          size="small"
                          sx={{
                            fontSize: { xs: "0.8rem", sm: "0.875rem" },
                            height: { xs: 36, sm: 40 },
                            px: { xs: 2, sm: 2 },
                          }}
                        >
                          Add Item
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={
                            <Delete
                              sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                            />
                          }
                          onClick={() =>
                            handleDeleteCategoryClick(
                              categories.find(
                                (c) => c.id === selectedCategoryId
                              )
                            )
                          }
                          size="small"
                          sx={{
                            fontSize: { xs: "0.8rem", sm: "0.875rem" },
                            height: { xs: 36, sm: 40 },
                            px: { xs: 2, sm: 2 },
                          }}
                        >
                          <Box
                            component="span"
                            sx={{ display: { xs: "none", sm: "inline" } }}
                          >
                            Delete Category
                          </Box>
                          <Box
                            component="span"
                            sx={{ display: { xs: "inline", sm: "none" } }}
                          >
                            Delete
                          </Box>
                        </Button>
                        <FormControlLabel
                          control={
                            <Switch
                              size="small"
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
                          label={
                            <Box
                              component="span"
                              sx={{
                                fontSize: { xs: "0.8rem", sm: "0.875rem" },
                              }}
                            >
                              <Box
                                component="span"
                                sx={{ display: { xs: "none", sm: "inline" } }}
                              >
                                Category Visible
                              </Box>
                              <Box
                                component="span"
                                sx={{ display: { xs: "inline", sm: "none" } }}
                              >
                                Visible
                              </Box>
                            </Box>
                          }
                          sx={{
                            m: 0,
                            "& .MuiFormControlLabel-label": {
                              fontSize: { xs: "0.8rem", sm: "0.875rem" },
                            },
                          }}
                        />
                      </Box>
                    )}
                </Box>

                {items.length > 0 ? (
                  <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
                    {items.map((item) => (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                        <Card
                          sx={{
                            opacity: item.isActive ? 1 : 0.6,
                            border: item.isActive ? "" : "2px dashed #d32f2f",
                            borderRadius: { xs: 3, sm: 4 },
                            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            "&:hover": {
                              transform: "translateY(-4px)",
                              boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
                            },
                          }}
                        >
                          <CardMedia
                            component="img"
                            height="180"
                            image={item.image}
                            alt={item.name}
                            sx={{
                              height: { xs: 160, sm: 180 },
                              objectFit: "cover",
                            }}
                          />
                          {!item.isActive && (
                            <Chip
                              label="Hidden"
                              color="error"
                              size="small"
                              sx={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                fontSize: { xs: "0.688rem", sm: "0.75rem" },
                              }}
                            />
                          )}
                          <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                            <Typography
                              variant="h6"
                              component="div"
                              sx={{
                                fontSize: { xs: "1rem", sm: "1.125rem" },
                                fontWeight: 600,
                              }}
                            >
                              {item.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                minHeight: 40,
                                fontSize: { xs: "0.813rem", sm: "0.875rem" },
                                lineHeight: 1.5,
                              }}
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
                          <CardActions
                            sx={{
                              display: "flex",
                              gap: 1,
                              p: { xs: 1.5, sm: 2 },
                            }}
                          >
                            <Button
                              startIcon={
                                <Edit sx={{ fontSize: { xs: 18, sm: 20 } }} />
                              }
                              fullWidth
                              variant="outlined"
                              size="small"
                              onClick={() => handleEditClick(item)}
                              sx={{
                                fontSize: { xs: "0.813rem", sm: "0.875rem" },
                                fontWeight: 600,
                                borderRadius: 2,
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              startIcon={
                                <Delete sx={{ fontSize: { xs: 18, sm: 20 } }} />
                              }
                              fullWidth
                              variant="outlined"
                              size="small"
                              color="error"
                              onClick={() => handleDeleteItemClick(item)}
                              sx={{
                                fontSize: { xs: "0.813rem", sm: "0.875rem" },
                                fontWeight: 600,
                                borderRadius: 2,
                              }}
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
        <Container
          maxWidth="lg"
          sx={{
            py: { xs: 2.5, sm: 3, md: 4 },
            px: { xs: 1.5, sm: 2, md: 3 },
            width: "100%",
            maxWidth: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "stretch", sm: "center" },
              mb: 3,
              gap: { xs: 1.5, sm: 0 },
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
              }}
            >
              Banner Management
            </Typography>
            <Button
              variant="contained"
              startIcon={
                <Add sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }} />
              }
              onClick={handleAddBanner}
              size="small"
              sx={{
                background: "linear-gradient(135deg, #8C3A2B 0%, #C66F53 100%)",
                fontSize: { xs: "0.8rem", sm: "0.875rem" },
                height: { xs: 36, sm: 40 },
                px: { xs: 2, sm: 2 },
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
            <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
              {banners.map((banner) => (
                <Grid item xs={12} md={6} key={banner.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: { xs: 3, sm: 4 },
                      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
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
                      sx={{
                        objectFit: "cover",
                        height: { xs: 160, sm: 200 },
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 2.5 } }}>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          fontWeight: 600,
                          fontSize: { xs: "1rem", sm: "1.125rem" },
                        }}
                      >
                        {banner.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontSize: { xs: "0.813rem", sm: "0.875rem" },
                          lineHeight: 1.5,
                        }}
                      >
                        {banner.description}
                      </Typography>
                    </CardContent>
                    <CardActions
                      sx={{ display: "flex", gap: 1, p: { xs: 1.5, sm: 2 } }}
                    >
                      <Button
                        startIcon={
                          <Edit sx={{ fontSize: { xs: 18, sm: 20 } }} />
                        }
                        onClick={() => handleEditBanner(banner)}
                        fullWidth
                        variant="outlined"
                        size="small"
                        sx={{
                          fontSize: { xs: "0.813rem", sm: "0.875rem" },
                          fontWeight: 600,
                          borderRadius: 2,
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        startIcon={
                          <Delete sx={{ fontSize: { xs: 18, sm: 20 } }} />
                        }
                        onClick={() => handleDeleteBannerClick(banner)}
                        fullWidth
                        variant="outlined"
                        size="small"
                        color="error"
                        sx={{
                          fontSize: { xs: "0.813rem", sm: "0.875rem" },
                          fontWeight: 600,
                          borderRadius: 2,
                        }}
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
                <ImageUploadField
                  value={bannerForm.image}
                  onChange={(url) =>
                    setBannerForm({ ...bannerForm, image: url })
                  }
                  onUpload={handleImageUpload}
                  label="Banner"
                  folder="banners"
                  required
                />
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
