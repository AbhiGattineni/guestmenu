import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
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
} from "../services/mockApi";
import EditItemDialog from "../components/EditItemDialog";
import AddCategoryDialog from "../components/AddCategoryDialog";

/**
 * AdminPage Component
 * Full page admin interface for managers to view and edit menu items
 */
const AdminPage = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addCategoryDialogOpen, setAddCategoryDialogOpen] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Fetch categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  // Fetch items when category changes
  useEffect(() => {
    if (selectedCategoryId) {
      loadItems(selectedCategoryId);
    }
  }, [selectedCategoryId]);

  const loadCategories = async () => {
    try {
      // Admin sees all categories including hidden ones
      const data = await fetchMenuCategories(true);
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
      // Admin sees all items including hidden ones
      const data = await fetchMenuItems(categoryId, true);
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

      // If visibility changed, log it
      const originalItem = items.find((item) => item.id === updatedItem.id);
      if (originalItem && originalItem.isActive !== updatedItem.isActive) {
        console.log(
          `Item visibility changed: ${
            updatedItem.isActive ? "Shown" : "Hidden"
          }`
        );
      }
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedCategoryId(newValue);
  };

  const handleAddCategory = async (categoryData) => {
    try {
      const newCategory = await addCategory(categoryData);
      setCategories((prev) => [...prev, newCategory]);
      // Auto-select the new category
      setSelectedCategoryId(newCategory.id);
      console.log("Category added successfully:", newCategory);
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleToggleCategoryVisibility = async (categoryId) => {
    try {
      const updatedCategory = await toggleCategoryVisibility(categoryId);
      setCategories((prev) =>
        prev.map((cat) => (cat.id === categoryId ? updatedCategory : cat))
      );
      console.log("Category visibility toggled:", updatedCategory);
    } catch (error) {
      console.error("Error toggling category visibility:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Modern App Bar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "linear-gradient(135deg, #2C1A12 0%, #3D2817 100%)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(242, 193, 78, 0.1)",
          boxShadow: "0 2px 20px rgba(0,0,0,0.08)",
        }}
      >
        <Toolbar sx={{ py: 1.5 }}>
          {/* Logo & Title Section */}
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                background: "linear-gradient(135deg, #F2C14E 0%, #C8A97E 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 2,
                boxShadow: "0 4px 12px rgba(242, 193, 78, 0.3)",
              }}
            >
              <Typography variant="h4">🍽️</Typography>
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "white",
                  letterSpacing: 0.5,
                  fontFamily: "Playfair Display, serif",
                }}
              >
                Admin Dashboard
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "#F2C14E",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    bgcolor: "#4CAF50",
                    display: "inline-block",
                  }}
                />
                {user?.name || "Manager"}
              </Typography>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Button
              startIcon={<PhotoLibrary />}
              onClick={() => navigate("/admin/banners")}
              sx={{
                color: "white",
                borderColor: "rgba(242, 193, 78, 0.3)",
                textTransform: "none",
                fontWeight: 600,
                px: 2.5,
                borderRadius: 2,
                "&:hover": {
                  borderColor: "#F2C14E",
                  bgcolor: "rgba(242, 193, 78, 0.08)",
                },
              }}
              variant="outlined"
            >
              Banners
            </Button>
            <Button
              startIcon={<Visibility />}
              onClick={() => navigate("/")}
              sx={{
                color: "white",
                borderColor: "rgba(242, 193, 78, 0.3)",
                textTransform: "none",
                fontWeight: 600,
                px: 2.5,
                borderRadius: 2,
                "&:hover": {
                  borderColor: "#F2C14E",
                  bgcolor: "rgba(242, 193, 78, 0.08)",
                },
              }}
              variant="outlined"
            >
              View Menu
            </Button>
            <Button
              startIcon={<Logout />}
              onClick={handleLogout}
              sx={{
                background: "linear-gradient(135deg, #8C3A2B 0%, #6B2C20 100%)",
                color: "white",
                textTransform: "none",
                fontWeight: 600,
                px: 2.5,
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(140, 58, 43, 0.3)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #6B2C20 0%, #8C3A2B 100%)",
                  boxShadow: "0 6px 16px rgba(140, 58, 43, 0.4)",
                },
              }}
              variant="contained"
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Modern Category Tabs */}
      <Box
        sx={{
          bgcolor: "white",
          position: "sticky",
          top: 80,
          zIndex: 100,
          boxShadow: "0 4px 20px rgba(44, 26, 18, 0.08)",
          borderBottom: "2px solid rgba(242, 193, 78, 0.15)",
          backdropFilter: "blur(10px)",
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
              scrollButtons="auto"
              sx={{
                flexGrow: 1,
                "& .MuiTabs-indicator": {
                  height: 3,
                  borderRadius: "3px 3px 0 0",
                  background:
                    "linear-gradient(90deg, #F2C14E 0%, #C8A97E 100%)",
                },
                "& .MuiTabs-scrollButtons": {
                  color: "#8C3A2B",
                  "&.Mui-disabled": {
                    opacity: 0.3,
                  },
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
                        gap: 1,
                        py: 0.5,
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          fontSize: "1.5rem",
                          lineHeight: 1,
                        }}
                      >
                        {category.icon}
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            lineHeight: 1.2,
                          }}
                        >
                          {category.name}
                        </Typography>
                        {!category.isActive && (
                          <Chip
                            label="Hidden"
                            size="small"
                            sx={{
                              height: 16,
                              fontSize: "0.65rem",
                              mt: 0.5,
                              bgcolor: "#fee",
                              color: "#d32f2f",
                              fontWeight: 600,
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  }
                  value={category.id}
                  sx={{
                    textTransform: "none",
                    minHeight: 72,
                    px: 2.5,
                    opacity: category.isActive ? 1 : 0.5,
                    color: "text.secondary",
                    transition: "all 0.2s ease",
                    "&.Mui-selected": {
                      color: "#8C3A2B",
                      fontWeight: 700,
                    },
                    "&:hover": {
                      bgcolor: "rgba(242, 193, 78, 0.06)",
                    },
                  }}
                />
              ))}
            </Tabs>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setAddCategoryDialogOpen(true)}
              sx={{
                ml: 3,
                mr: 2,
                background: "linear-gradient(135deg, #F2C14E 0%, #C8A97E 100%)",
                color: "#2C1A12",
                fontWeight: 700,
                textTransform: "none",
                px: 3,
                py: 1.2,
                borderRadius: 2,
                boxShadow: "0 4px 14px rgba(242, 193, 78, 0.35)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #C8A97E 0%, #F2C14E 100%)",
                  boxShadow: "0 6px 20px rgba(242, 193, 78, 0.45)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              Add Category
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Items Grid */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 8,
            }}
          >
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
              <Typography
                variant="h6"
                sx={{ color: "text.secondary", fontWeight: 500 }}
              >
                {items.length} items in this category
              </Typography>
              {categories.find((cat) => cat.id === selectedCategoryId) && (
                <FormControlLabel
                  control={
                    <Switch
                      checked={
                        categories.find((cat) => cat.id === selectedCategoryId)
                          ?.isActive
                      }
                      onChange={() =>
                        handleToggleCategoryVisibility(selectedCategoryId)
                      }
                      color="primary"
                    />
                  }
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {categories.find((cat) => cat.id === selectedCategoryId)
                        ?.isActive ? (
                        <>
                          <Visibility fontSize="small" />
                          <span>Category Visible to Customers</span>
                        </>
                      ) : (
                        <>
                          <VisibilityOff fontSize="small" color="error" />
                          <span>Category Hidden from Customers</span>
                        </>
                      )}
                    </Box>
                  }
                />
              )}
            </Box>
            <Grid container spacing={3}>
              {items.map((item) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.2s ease",
                      opacity: item.isActive ? 1 : 0.6,
                      border: item.isActive
                        ? "1px solid rgba(44,26,18,0.06)"
                        : "2px dashed rgba(211, 47, 47, 0.5)",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 12px 32px rgba(44,26,18,0.12)",
                      },
                    }}
                  >
                    <Box sx={{ position: "relative" }}>
                      <CardMedia
                        component="img"
                        height="180"
                        image={item.image}
                        alt={item.name}
                        sx={{ objectFit: "cover" }}
                      />
                      {!item.isActive && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                          }}
                        >
                          <Chip
                            label="Hidden"
                            size="small"
                            color="error"
                            icon={<VisibilityOff />}
                          />
                        </Box>
                      )}
                    </Box>
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
                        sx={{ mb: 2, minHeight: 40 }}
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
                        variant="contained"
                        fullWidth
                        onClick={() => handleEditClick(item)}
                      >
                        Edit Item
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Container>

      {/* Floating Back to Menu Button */}
      <Fab
        color="secondary"
        onClick={() => navigate("/")}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
        }}
        title="View Customer Menu"
      >
        <Home />
      </Fab>

      {/* Edit Item Dialog */}
      <EditItemDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        item={editItem}
        onSave={handleSaveItem}
      />

      {/* Add Category Dialog */}
      <AddCategoryDialog
        open={addCategoryDialogOpen}
        onClose={() => setAddCategoryDialogOpen(false)}
        onSave={handleAddCategory}
      />
    </Box>
  );
};

export default AdminPage;
