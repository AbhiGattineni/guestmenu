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
  Chip,
} from "@mui/material";
import { Add, Edit, Delete, Visibility } from "@mui/icons-material";
import {
  getAllStores,
  createStore,
  updateStore,
  deleteStore,
} from "../../services/superAdminService";
import ImageUploadField from "../ImageUploadField";
import { uploadImage, deleteImage } from "../../services/imageUploadService";

/**
 * Stores Tab
 * Manage stores (add/edit/delete)
 */
const StoresTab = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    logo: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const data = await getAllStores();
      setStores(data);
    } catch (error) {
      console.error("Error fetching stores:", error);
      setError("Failed to load stores");
    } finally {
      setLoading(false);
    }
  };

  // Handle image upload for store logos
  const handleImageUpload = async (file, folder) => {
    if (!formData.id && !selectedStore?.id) {
      throw new Error("Please save the store first or provide a store ID");
    }
    const storeId = formData.id || selectedStore?.id;
    return await uploadImage(file, folder, storeId);
  };

  const handleCreateStore = async () => {
    try {
      setError("");
      if (!formData.id || !formData.name) {
        setError("Store ID and Name are required");
        return;
      }

      await createStore(formData.id, {
        name: formData.name,
        description: formData.description,
        logo: formData.logo,
        address: formData.address,
        phone: formData.phone,
      });

      setSuccess("Store created successfully!");
      setOpenDialog(false);
      resetForm();
      fetchStores();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError(error.message || "Failed to create store");
    }
  };

  const handleUpdateStore = async () => {
    try {
      setError("");
      if (!formData.name) {
        setError("Store name is required");
        return;
      }

      // Delete old logo if it was changed and was a Firebase Storage URL
      if (
        selectedStore.logo &&
        selectedStore.logo !== formData.logo &&
        selectedStore.logo.includes("firebasestorage.googleapis.com")
      ) {
        try {
          await deleteImage(selectedStore.logo);
        } catch (error) {
          console.error("Error deleting old logo:", error);
          // Continue with update even if delete fails
        }
      }

      await updateStore(selectedStore.id, {
        name: formData.name,
        description: formData.description,
        logo: formData.logo,
        address: formData.address,
        phone: formData.phone,
      });

      setSuccess("Store updated successfully!");
      setOpenDialog(false);
      resetForm();
      fetchStores();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Failed to update store");
    }
  };

  const handleDeleteStore = async () => {
    try {
      // Delete store logo from Firebase Storage if it exists
      if (
        selectedStore.logo &&
        selectedStore.logo.includes("firebasestorage.googleapis.com")
      ) {
        try {
          await deleteImage(selectedStore.logo);
        } catch (error) {
          console.error("Error deleting store logo:", error);
          // Continue with delete even if logo deletion fails
        }
      }

      await deleteStore(selectedStore.id);
      setSuccess("Store deleted successfully!");
      setDeleteDialogOpen(false);
      fetchStores();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Failed to delete store");
    }
  };

  const openEditDialog = (store) => {
    setSelectedStore(store);
    setFormData({
      id: store.id,
      name: store.name || "",
      description: store.description || "",
      logo: store.logo || "",
      address: store.address || "",
      phone: store.phone || "",
    });
    setIsEdit(true);
    setOpenDialog(true);
  };

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      description: "",
      logo: "",
      address: "",
      phone: "",
    });
    setIsEdit(false);
    setSelectedStore(null);
  };

  if (loading) {
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
          Store Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            resetForm();
            setError("");
            setOpenDialog(true);
          }}
        >
          Add Store
        </Button>
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

      {/* Stores Table */}
      <TableContainer
        component={Paper}
        elevation={2}
        sx={{ width: "100%", overflowX: "auto" }}
      >
        <Table sx={{ minWidth: { xs: 300, sm: 650 } }}>
          <TableHead>
            <TableRow sx={{ bgcolor: "primary.main" }}>
              <TableCell sx={{ color: "white", fontWeight: 700 }}>
                Store ID
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: 700 }}>
                Name
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: 700 }}>
                Description
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: 700 }}>
                Phone
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: 700 }}>
                Status
              </TableCell>
              <TableCell align="right" sx={{ color: "white", fontWeight: 700 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stores.map((store) => (
              <TableRow
                key={store.id}
                sx={{ "&:hover": { bgcolor: "action.hover" } }}
              >
                <TableCell sx={{ fontWeight: 600 }}>{store.id}</TableCell>
                <TableCell>{store.name || "-"}</TableCell>
                <TableCell>
                  {store.description
                    ? store.description.substring(0, 50) +
                      (store.description.length > 50 ? "..." : "")
                    : "-"}
                </TableCell>
                <TableCell>{store.phone || "-"}</TableCell>
                <TableCell>
                  <Chip
                    label={store.isActive !== false ? "Active" : "Inactive"}
                    color={store.isActive !== false ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() =>
                      window.open(`http://${store.id}.localhost:3000`, "_blank")
                    }
                    title="View Store"
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => openEditDialog(store)}
                    title="Edit Store"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => {
                      setSelectedStore(store);
                      setDeleteDialogOpen(true);
                    }}
                    title="Delete Store"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Store Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{isEdit ? "Edit Store" : "Create New Store"}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Store ID"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              fullWidth
              required
              disabled={isEdit}
              helperText={
                isEdit
                  ? "Store ID cannot be changed"
                  : "Unique identifier (e.g., '1', 'store-name')"
              }
            />
            <TextField
              label="Store Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              fullWidth
              multiline
              rows={2}
            />
            <ImageUploadField
              label="Store Logo"
              value={formData.logo}
              onChange={(logoUrl) =>
                setFormData({ ...formData, logo: logoUrl })
              }
              onUpload={handleImageUpload}
              folder="logos"
              helperText="Upload a logo or paste an image URL"
            />
            <TextField
              label="Address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              fullWidth
            />
            {error && (
              <Alert severity="error" onClose={() => setError("")}>
                {error}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={isEdit ? handleUpdateStore : handleCreateStore}
            variant="contained"
          >
            {isEdit ? "Update Store" : "Create Store"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Store</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete store "
            <strong>{selectedStore?.name}</strong>" (ID:
            {selectedStore?.id})? This action cannot be undone.
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            Note: This will not delete menu items and categories. Those need to
            be deleted separately.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteStore} color="error" variant="contained">
            Delete Store
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StoresTab;
