import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  CircularProgress,
  Typography,
  Alert,
} from "@mui/material";
import { Add, Edit, Delete, Store as StoreIcon } from "@mui/icons-material";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  assignStoreToManager,
  getAllStores,
} from "../../services/superAdminService";

/**
 * Users Tab
 * Manage users, assign stores to managers
 */
const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assignStoreDialogOpen, setAssignStoreDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "manager",
    storeId: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersData, storesData] = await Promise.all([
        getAllUsers(),
        getAllStores(),
      ]);
      setUsers(usersData);
      setStores(storesData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      setError("");
      if (!formData.email || !formData.password) {
        setError("Email and password are required");
        return;
      }

      await createUser(
        formData.email,
        formData.password,
        formData.role,
        formData.role === "manager" ? formData.storeId : null
      );

      setSuccess("User created successfully!");
      setOpenDialog(false);
      setFormData({ email: "", password: "", role: "manager", storeId: "" });
      fetchData();

      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError(error.message || "Failed to create user");
    }
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUser(selectedUser.id);
      setSuccess("User deleted successfully!");
      setDeleteDialogOpen(false);
      fetchData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Failed to delete user");
    }
  };

  const handleAssignStore = async () => {
    try {
      if (!formData.storeId) {
        setError("Please select a store");
        return;
      }

      await assignStoreToManager(selectedUser.id, formData.storeId);
      setSuccess("Store assigned successfully!");
      setAssignStoreDialogOpen(false);
      setFormData({ ...formData, storeId: "" });
      fetchData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Failed to assign store");
    }
  };

  const openAssignStoreDialog = (user) => {
    setSelectedUser(user);
    setFormData({ ...formData, storeId: user.storeId || "" });
    setAssignStoreDialogOpen(true);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          User Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setFormData({
              email: "",
              password: "",
              role: "manager",
              storeId: "",
            });
            setError("");
            setOpenDialog(true);
          }}
        >
          Add User
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

      {/* Users Table */}
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "primary.main" }}>
              <TableCell sx={{ color: "white", fontWeight: 700 }}>
                Email
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: 700 }}>
                Role
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: 700 }}>
                Assigned Store
              </TableCell>
              <TableCell align="right" sx={{ color: "white", fontWeight: 700 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                sx={{ "&:hover": { bgcolor: "action.hover" } }}
              >
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={user.role}
                    color={user.role === "superadmin" ? "error" : "primary"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {user.storeId ? (
                    <Chip
                      label={user.storeId}
                      size="small"
                      variant="outlined"
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Not assigned
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  {user.role === "manager" && (
                    <IconButton
                      color="primary"
                      onClick={() => openAssignStoreDialog(user)}
                      title="Assign Store"
                    >
                      <StoreIcon />
                    </IconButton>
                  )}
                  <IconButton
                    color="error"
                    onClick={() => {
                      setSelectedUser(user);
                      setDeleteDialogOpen(true);
                    }}
                    title="Delete User"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create User Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              fullWidth
              required
            />
            <TextField
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              fullWidth
              required
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                label="Role"
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="superadmin">Super Admin</MenuItem>
              </Select>
            </FormControl>
            {formData.role === "manager" && (
              <FormControl fullWidth>
                <InputLabel>Assign Store (Optional)</InputLabel>
                <Select
                  value={formData.storeId}
                  label="Assign Store (Optional)"
                  onChange={(e) =>
                    setFormData({ ...formData, storeId: e.target.value })
                  }
                >
                  <MenuItem value="">None</MenuItem>
                  {stores.map((store) => (
                    <MenuItem key={store.id} value={store.id}>
                      {store.name || store.id}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {error && (
              <Alert severity="error" onClose={() => setError("")}>
                {error}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateUser} variant="contained">
            Create User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete user "{selectedUser?.email}"? This
            action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteUser} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Store Dialog */}
      <Dialog
        open={assignStoreDialogOpen}
        onClose={() => setAssignStoreDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Assign Store to Manager</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Manager: <strong>{selectedUser?.email}</strong>
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Select Store</InputLabel>
              <Select
                value={formData.storeId}
                label="Select Store"
                onChange={(e) =>
                  setFormData({ ...formData, storeId: e.target.value })
                }
              >
                {stores.map((store) => (
                  <MenuItem key={store.id} value={store.id}>
                    {store.name || store.id}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignStoreDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAssignStore} variant="contained">
            Assign Store
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersTab;
