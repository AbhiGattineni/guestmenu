import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Chip,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import ImageUploadField from "../ImageUploadField";
import { deleteImage, uploadImage } from "../../services/imageUploadService";
import {
  getAllStores,
  getStoreCategories,
  getStoreMenuItems,
  createStoreCategory,
  updateStoreCategory,
  deleteStoreCategory,
  createStoreMenuItem,
  updateStoreMenuItem,
  deleteStoreMenuItem,
  getStoreSubcategories,
} from "../../services/superAdminService";

/**
 * Menu Tab
 * Manage categories and menu items across all stores
 */
const MenuTab = () => {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState(0); // 0: Categories, 1: Items

  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [openItemDialog, setOpenItemDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Common food category icons (same as manager portal)
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

  const [categoryForm, setCategoryForm] = useState({
    id: "",
    name: "",
    icon: "🍽️",
    order: 1,
    isActive: true,
  });

  const [itemForm, setItemForm] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    categoryId: "",
    subcategoryId: "",
    image: "",
    isVegetarian: false,
    isSpicy: false,
    isActive: true,
  });

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    if (selectedStore) {
      fetchMenuData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStore]);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const data = await getAllStores();
      setStores(data);
      if (data.length > 0) {
        setSelectedStore(data[0].id);
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
      setError("Failed to load stores");
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuData = async () => {
    if (!selectedStore) return;

    try {
      setLoading(true);
      const [categoriesData, itemsData, subcategoriesData] = await Promise.all([
        getStoreCategories(selectedStore),
        getStoreMenuItems(selectedStore),
        getStoreSubcategories(selectedStore), // Fetch all subcategories for the store
      ]);
      setCategories(categoriesData);
      setMenuItems(itemsData);
      setSubcategories(subcategoriesData);
      console.log("📋 Loaded subcategories:", subcategoriesData);
    } catch (error) {
      console.error("Error fetching menu data:", error);
      setError("Failed to load menu data");
    } finally {
      setLoading(false);
    }
  };

  // Image upload handler
  const handleImageUpload = async (file, folder) => {
    if (!selectedStore) {
      throw new Error("Please select a store first");
    }
    return await uploadImage(file, folder, selectedStore);
  };

  // Category handlers
  const handleCreateCategory = async () => {
    try {
      setError("");
      if (!categoryForm.name) {
        setError("Category name is required");
        return;
      }

      await createStoreCategory(selectedStore, {
        name: categoryForm.name,
        icon: categoryForm.icon,
        order: parseInt(categoryForm.order) || 1,
        isActive: categoryForm.isActive,
      });

      setSuccess("Category created successfully!");
      setOpenCategoryDialog(false);
      resetCategoryForm();
      fetchMenuData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Failed to create category");
    }
  };

  const handleUpdateCategory = async () => {
    try {
      setError("");
      if (!categoryForm.name) {
        setError("Category name is required");
        return;
      }

      await updateStoreCategory(selectedStore, categoryForm.id, {
        name: categoryForm.name,
        icon: categoryForm.icon,
        order: parseInt(categoryForm.order) || 1,
        isActive: categoryForm.isActive,
      });

      setSuccess("Category updated successfully!");
      setOpenCategoryDialog(false);
      resetCategoryForm();
      fetchMenuData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Failed to update category");
    }
  };

  const handleDeleteCategory = async () => {
    try {
      await deleteStoreCategory(selectedStore, itemToDelete.id);
      setSuccess("Category deleted successfully!");
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      fetchMenuData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Failed to delete category");
    }
  };

  // Item handlers
  const handleCreateItem = async () => {
    try {
      setError("");
      if (!itemForm.name || !itemForm.categoryId || !itemForm.price) {
        setError("Name, category, and price are required");
        return;
      }

      const itemData = {
        name: itemForm.name,
        description: itemForm.description,
        price: parseFloat(itemForm.price),
        categoryId: itemForm.categoryId,
        image: itemForm.image,
        isVegetarian: itemForm.isVegetarian,
        isSpicy: itemForm.isSpicy,
        isActive: itemForm.isActive,
      };

      // Only include subcategoryId if it's not empty
      if (itemForm.subcategoryId) {
        itemData.subcategoryId = itemForm.subcategoryId;
      }

      await createStoreMenuItem(selectedStore, itemData);

      setSuccess("Menu item created successfully!");
      setOpenItemDialog(false);
      resetItemForm();
      fetchMenuData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Failed to create menu item");
    }
  };

  const handleUpdateItem = async () => {
    try {
      setError("");
      if (!itemForm.name || !itemForm.categoryId || !itemForm.price) {
        setError("Name, category, and price are required");
        return;
      }

      // Find the original item to check if image changed
      const originalItem = menuItems.find((item) => item.id === itemForm.id);

      // If image changed, delete the old image from Firebase Storage
      if (
        originalItem &&
        originalItem.image &&
        originalItem.image !== itemForm.image &&
        originalItem.image.includes("firebasestorage.googleapis.com")
      ) {
        try {
          await deleteImage(originalItem.image);
          console.log("Old item image deleted successfully");
        } catch (error) {
          console.error("Error deleting old item image:", error);
          // Continue with update even if image deletion fails
        }
      }

      const itemData = {
        name: itemForm.name,
        description: itemForm.description,
        price: parseFloat(itemForm.price),
        categoryId: itemForm.categoryId,
        image: itemForm.image,
        isVegetarian: itemForm.isVegetarian,
        isSpicy: itemForm.isSpicy,
        isActive: itemForm.isActive,
      };

      // Only include subcategoryId if it's not empty
      if (itemForm.subcategoryId) {
        itemData.subcategoryId = itemForm.subcategoryId;
      }

      await updateStoreMenuItem(selectedStore, itemForm.id, itemData);

      setSuccess("Menu item updated successfully!");
      setOpenItemDialog(false);
      resetItemForm();
      fetchMenuData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Failed to update menu item");
    }
  };

  const handleDeleteItem = async () => {
    try {
      // Delete image from Firebase Storage if it exists
      if (
        itemToDelete.image &&
        itemToDelete.image.includes("firebasestorage.googleapis.com")
      ) {
        try {
          await deleteImage(itemToDelete.image);
          console.log("Item image deleted successfully");
        } catch (error) {
          console.error("Error deleting item image:", error);
          // Continue with item deletion even if image deletion fails
        }
      }

      await deleteStoreMenuItem(selectedStore, itemToDelete.id);
      setSuccess("Menu item deleted successfully!");
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      fetchMenuData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Failed to delete menu item");
    }
  };

  const resetCategoryForm = () => {
    setCategoryForm({ id: "", name: "", icon: "🍽️", order: 1, isActive: true });
    setIsEdit(false);
  };

  const resetItemForm = () => {
    setItemForm({
      id: "",
      name: "",
      description: "",
      price: "",
      categoryId: "",
      subcategoryId: "",
      image: "",
      isVegetarian: false,
      isSpicy: false,
      isActive: true,
    });
    setIsEdit(false);
  };

  const openEditCategoryDialog = (category) => {
    setCategoryForm({
      id: category.id,
      name: category.name || "",
      icon: category.icon || "🍽️",
      order: category.order || 1,
      isActive: category.isActive !== false,
    });
    setIsEdit(true);
    setOpenCategoryDialog(true);
  };

  const openEditItemDialog = (item) => {
    console.log("🔧 Opening edit dialog for item:", item);
    console.log("📋 Current subcategories:", subcategories);
    console.log(
      "🔍 Filtered subcategories for category:",
      subcategories.filter((sub) => sub.categoryId === item.categoryId)
    );

    setItemForm({
      id: item.id,
      name: item.name || "",
      description: item.description || "",
      price: item.price || "",
      categoryId: item.categoryId || "",
      subcategoryId: item.subcategoryId || "",
      image: item.image || "",
      isVegetarian: item.isVegetarian || false,
      isSpicy: item.isSpicy || false,
      isActive: item.isActive !== false,
    });
    setIsEdit(true);
    setOpenItemDialog(true);
  };

  if (loading && !selectedStore) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: "100%", overflowX: "hidden" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Menu Management
        </Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Select Store</InputLabel>
          <Select
            value={selectedStore}
            label="Select Store"
            onChange={(e) => setSelectedStore(e.target.value)}
          >
            {stores.map((store) => (
              <MenuItem key={store.id} value={store.id}>
                {store.name || store.id}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={currentView} onChange={(e, v) => setCurrentView(v)}>
          <Tab label={`Categories (${categories.length})`} />
          <Tab label={`Menu Items (${menuItems.length})`} />
        </Tabs>
      </Box>

      {/* Categories View */}
      {currentView === 0 && (
        <Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              resetCategoryForm();
              setError("");
              setOpenCategoryDialog(true);
            }}
            sx={{ mb: 2 }}
          >
            Add Category
          </Button>
          <TableContainer
            component={Paper}
            elevation={2}
            sx={{ width: "100%", overflowX: "auto" }}
          >
            <Table sx={{ minWidth: { xs: 300, sm: 650 } }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "primary.main" }}>
                  <TableCell sx={{ color: "white", fontWeight: 700 }}>
                    Name
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 700 }}>
                    Icon
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 700 }}>
                    Order
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 700 }}>
                    Status
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: "white", fontWeight: 700 }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((category) => (
                  <TableRow
                    key={category.id}
                    sx={{ "&:hover": { bgcolor: "action.hover" } }}
                  >
                    <TableCell sx={{ fontWeight: 600 }}>
                      {category.name}
                    </TableCell>
                    <TableCell>{category.icon || "-"}</TableCell>
                    <TableCell>{category.order || "-"}</TableCell>
                    <TableCell>
                      <Chip
                        label={
                          category.isActive !== false ? "Active" : "Inactive"
                        }
                        color={
                          category.isActive !== false ? "success" : "default"
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="secondary"
                        onClick={() => openEditCategoryDialog(category)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => {
                          setItemToDelete({ ...category, type: "category" });
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Menu Items View */}
      {currentView === 1 && (
        <Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              resetItemForm();
              setError("");
              setOpenItemDialog(true);
            }}
            sx={{ mb: 2 }}
          >
            Add Menu Item
          </Button>
          <TableContainer
            component={Paper}
            elevation={2}
            sx={{ width: "100%", overflowX: "auto" }}
          >
            <Table sx={{ minWidth: { xs: 300, sm: 650 } }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "primary.main" }}>
                  <TableCell sx={{ color: "white", fontWeight: 700 }}>
                    Name
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 700 }}>
                    Category
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 700 }}>
                    Price
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 700 }}>
                    Tags
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 700 }}>
                    Status
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: "white", fontWeight: 700 }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {menuItems.map((item) => {
                  const category = categories.find(
                    (c) => c.id === item.categoryId
                  );
                  return (
                    <TableRow
                      key={item.id}
                      sx={{ "&:hover": { bgcolor: "action.hover" } }}
                    >
                      <TableCell sx={{ fontWeight: 600 }}>
                        {item.name}
                      </TableCell>
                      <TableCell>{category?.name || item.categoryId}</TableCell>
                      <TableCell>${item.price?.toFixed(2) || "0.00"}</TableCell>
                      <TableCell>
                        {item.isVegetarian && (
                          <Chip
                            label="Veg"
                            size="small"
                            color="success"
                            sx={{ mr: 0.5 }}
                          />
                        )}
                        {item.isSpicy && (
                          <Chip label="Spicy" size="small" color="warning" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            item.isActive !== false ? "Active" : "Inactive"
                          }
                          color={
                            item.isActive !== false ? "success" : "default"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="secondary"
                          onClick={() => openEditItemDialog(item)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => {
                            setItemToDelete({ ...item, type: "item" });
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Category Dialog */}
      <Dialog
        open={openCategoryDialog}
        onClose={() => setOpenCategoryDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {isEdit ? "Edit Category" : "Create Category"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Category Name"
              value={categoryForm.name}
              onChange={(e) =>
                setCategoryForm({ ...categoryForm, name: e.target.value })
              }
              fullWidth
              required
            />
            <FormControl fullWidth>
              <InputLabel>Category Icon</InputLabel>
              <Select
                value={categoryForm.icon}
                label="Category Icon"
                onChange={(e) =>
                  setCategoryForm({ ...categoryForm, icon: e.target.value })
                }
              >
                {iconOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Display Order"
              type="number"
              value={categoryForm.order}
              onChange={(e) =>
                setCategoryForm({ ...categoryForm, order: e.target.value })
              }
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch
                  checked={categoryForm.isActive}
                  onChange={(e) =>
                    setCategoryForm({
                      ...categoryForm,
                      isActive: e.target.checked,
                    })
                  }
                />
              }
              label="Active"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCategoryDialog(false)}>Cancel</Button>
          <Button
            onClick={isEdit ? handleUpdateCategory : handleCreateCategory}
            variant="contained"
          >
            {isEdit ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Menu Item Dialog */}
      <Dialog
        open={openItemDialog}
        onClose={() => setOpenItemDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {isEdit ? "Edit Menu Item" : "Create Menu Item"}
        </DialogTitle>
        <DialogContent>
          {/* Debug Info */}
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="caption">
              DEBUG: categoryId = "{itemForm.categoryId}" | subcategoryId = "
              {itemForm.subcategoryId}" | Subcategories loaded:{" "}
              {subcategories.length} | For this category:{" "}
              {
                subcategories.filter(
                  (sub) => sub.categoryId === itemForm.categoryId
                ).length
              }
            </Typography>
          </Alert>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Item Name"
              value={itemForm.name}
              onChange={(e) =>
                setItemForm({ ...itemForm, name: e.target.value })
              }
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={itemForm.description}
              onChange={(e) =>
                setItemForm({ ...itemForm, description: e.target.value })
              }
              fullWidth
              multiline
              rows={2}
            />
            <TextField
              label="Price"
              type="number"
              value={itemForm.price}
              onChange={(e) =>
                setItemForm({ ...itemForm, price: e.target.value })
              }
              required
              fullWidth
            />

            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select
                value={itemForm.categoryId}
                label="Category"
                onChange={(e) => {
                  // Reset subcategoryId when category changes
                  setItemForm({
                    ...itemForm,
                    categoryId: e.target.value,
                    subcategoryId: "", // Clear subcategory when category changes
                  });
                }}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Subheading Dropdown - Always visible */}
            <FormControl fullWidth disabled={!itemForm.categoryId}>
              <InputLabel>Subheading (Optional)</InputLabel>
              <Select
                value={itemForm.subcategoryId || ""}
                label="Subheading (Optional)"
                onChange={(e) =>
                  setItemForm({
                    ...itemForm,
                    subcategoryId: e.target.value,
                  })
                }
              >
                <MenuItem value="">
                  <em>None - No subheading</em>
                </MenuItem>
                {itemForm.categoryId &&
                  subcategories
                    .filter((sub) => sub.categoryId === itemForm.categoryId)
                    .map((sub) => (
                      <MenuItem key={sub.id} value={sub.id}>
                        {sub.name} {sub.description && `- ${sub.description}`}
                      </MenuItem>
                    ))}
              </Select>
              {!itemForm.categoryId ? (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 0.5, ml: 1.5, display: "block" }}
                >
                  ⬆️ Please select a category first
                </Typography>
              ) : subcategories.filter(
                  (sub) => sub.categoryId === itemForm.categoryId
                ).length === 0 ? (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 0.5, ml: 1.5, display: "block" }}
                >
                  💡 No subheadings for this category. Create them in Manager
                  Dashboard.
                </Typography>
              ) : null}
            </FormControl>
            <ImageUploadField
              label="Item Image"
              value={itemForm.image}
              onChange={(imageUrl) =>
                setItemForm({ ...itemForm, image: imageUrl })
              }
              onUpload={handleImageUpload}
              folder="items"
              helperText="Upload an image or paste an image URL"
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={itemForm.isVegetarian}
                    onChange={(e) =>
                      setItemForm({
                        ...itemForm,
                        isVegetarian: e.target.checked,
                      })
                    }
                  />
                }
                label="Vegetarian"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={itemForm.isSpicy}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, isSpicy: e.target.checked })
                    }
                  />
                }
                label="Spicy"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={itemForm.isActive}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, isActive: e.target.checked })
                    }
                  />
                }
                label="Active"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenItemDialog(false)}>Cancel</Button>
          <Button
            onClick={isEdit ? handleUpdateItem : handleCreateItem}
            variant="contained"
          >
            {isEdit ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>
          Delete {itemToDelete?.type === "category" ? "Category" : "Menu Item"}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "
            <strong>{itemToDelete?.name}</strong>"? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={
              itemToDelete?.type === "category"
                ? handleDeleteCategory
                : handleDeleteItem
            }
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MenuTab;
