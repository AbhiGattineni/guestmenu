import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Box,
} from "@mui/material";
import {
  Delete,
  Visibility,
  VisibilityOff,
  Logout,
  Home,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStores: 0,
    totalMenuItems: 0,
    totalManagers: 0,
  });
  const [stores, setStores] = useState([]);
  const [newStoreId, setNewStoreId] = useState("");
  const [newManager, setNewManager] = useState({ uid: "", storeId: "" });

  const db = getFirestore();
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const fetchStatsAndStores = async () => {
    const clientsCollection = collection(db, "clients");
    const clientsSnapshot = await getDocs(clientsCollection);
    const storesData = clientsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    let totalMenuItems = 0;
    let totalManagers = 0;

    for (const store of storesData) {
      const menuItemsCollection = collection(
        db,
        `clients/${store.id}/menuItems`
      );
      const menuItemsSnapshot = await getDocs(menuItemsCollection);
      totalMenuItems += menuItemsSnapshot.size;

      const usersCollection = collection(db, `clients/${store.id}/users`);
      const usersSnapshot = await getDocs(usersCollection);
      usersSnapshot.forEach((userDoc) => {
        if (userDoc.data().role === "manager") {
          totalManagers++;
        }
      });
    }

    setStats({
      totalStores: storesData.length,
      totalMenuItems,
      totalManagers,
    });
    setStores(storesData);
  };

  useEffect(() => {
    fetchStatsAndStores();
  }, []);

  const handleOnboardStore = async () => {
    if (!newStoreId) return;
    await setDoc(doc(db, "clients", newStoreId), { createdAt: new Date() });
    setNewStoreId("");
    fetchStatsAndStores();
  };

  const handleAssignManager = async () => {
    if (!newManager.uid || !newManager.storeId) return;
    await setDoc(
      doc(db, `clients/${newManager.storeId}/users`, newManager.uid),
      { role: "manager" }
    );
    setNewManager({ uid: "", storeId: "" });
    fetchStatsAndStores();
  };

  const handleDeleteStore = async (storeId) => {
    await deleteDoc(doc(db, "clients", storeId));
    fetchStatsAndStores();
  };

  const handleToggleVisibility = async (storeId, currentVisibility) => {
    await updateDoc(doc(db, "clients", storeId), {
      isHidden: !currentVisibility,
    });
    fetchStatsAndStores();
  };

  return (
    <>
      <AppBar
        position="static"
        sx={{ background: "linear-gradient(135deg, #2C1A12 0%, #3D2817 100%)" }}
      >
        <Toolbar sx={{ px: { xs: 1, sm: 2 }, py: { xs: 1, sm: 1.5 } }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                width: { xs: 32, sm: 40 },
                height: { xs: 32, sm: 40 },
                borderRadius: "50%",
                background: "linear-gradient(135deg, #F2C14E 0%, #C8A97E 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: { xs: 1, sm: 2 },
                boxShadow: "0 4px 12px rgba(242, 193, 78, 0.3)",
                flexShrink: 0,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
              >
                👑
              </Typography>
            </Box>
            <Box sx={{ minWidth: 0, overflow: "hidden" }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "white",
                  fontSize: { xs: "0.875rem", sm: "1.25rem" },
                  whiteSpace: { xs: "nowrap", sm: "normal" },
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                <Box
                  component="span"
                  sx={{ display: { xs: "none", md: "inline" } }}
                >
                  Super Admin Dashboard
                </Box>
                <Box
                  component="span"
                  sx={{ display: { xs: "inline", md: "none" } }}
                >
                  Super Admin
                </Box>
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "#F2C14E",
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

          <Box sx={{ display: "flex", gap: { xs: 1, sm: 2 } }}>
            <Button
              startIcon={<Home sx={{ display: { xs: "none", sm: "block" } }} />}
              onClick={() => navigate("/")}
              sx={{
                color: "white",
                borderColor: "rgba(242, 193, 78, 0.3)",
                minWidth: { xs: "auto", sm: "auto" },
                px: { xs: 1.5, sm: 2.5 },
                "&:hover": {
                  borderColor: "#F2C14E",
                  bgcolor: "rgba(242, 193, 78, 0.08)",
                },
              }}
              variant="outlined"
            >
              <Home sx={{ display: { xs: "block", sm: "none" } }} />
              <Box
                component="span"
                sx={{ display: { xs: "none", sm: "inline" } }}
              >
                View Menu
              </Box>
            </Button>
            <Button
              startIcon={
                <Logout sx={{ display: { xs: "none", sm: "block" } }} />
              }
              onClick={handleLogout}
              sx={{
                background: "linear-gradient(135deg, #8C3A2B 0%, #6B2C20 100%)",
                color: "white",
                fontWeight: 600,
                minWidth: { xs: "auto", sm: "auto" },
                px: { xs: 1.5, sm: 2.5 },
                boxShadow: "0 4px 12px rgba(140, 58, 43, 0.3)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #6B2C20 0%, #8C3A2B 100%)",
                  boxShadow: "0 6px 16px rgba(140, 58, 43, 0.4)",
                },
              }}
              variant="contained"
            >
              <Logout sx={{ display: { xs: "block", sm: "none" } }} />
              <Box
                component="span"
                sx={{ display: { xs: "none", sm: "inline" } }}
              >
                Logout
              </Box>
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5">Total Stores</Typography>
                <Typography variant="h3">{stats.totalStores}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5">Total Menu Items</Typography>
                <Typography variant="h3">{stats.totalMenuItems}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5">Total Managers</Typography>
                <Typography variant="h3">{stats.totalManagers}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper sx={{ mt: 4, p: 2 }}>
          <Typography variant="h6">Onboard New Store</Typography>
          <TextField
            label="New Store ID"
            value={newStoreId}
            onChange={(e) => setNewStoreId(e.target.value)}
            sx={{ mr: 2 }}
          />
          <Button variant="contained" onClick={handleOnboardStore}>
            Onboard
          </Button>
        </Paper>

        <Paper sx={{ mt: 4, p: 2 }}>
          <Typography variant="h6">Assign Manager to Store</Typography>
          <TextField
            label="Manager UID"
            value={newManager.uid}
            onChange={(e) =>
              setNewManager({ ...newManager, uid: e.target.value })
            }
            sx={{ mr: 2 }}
          />
          <TextField
            label="Store ID"
            value={newManager.storeId}
            onChange={(e) =>
              setNewManager({ ...newManager, storeId: e.target.value })
            }
            sx={{ mr: 2 }}
          />
          <Button variant="contained" onClick={handleAssignManager}>
            Assign
          </Button>
        </Paper>

        <Paper sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ p: 2 }}>
            Stores
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stores.map((store) => (
                <TableRow key={store.id}>
                  <TableCell>{store.id}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDeleteStore(store.id)}>
                      <Delete />
                    </IconButton>
                    <IconButton
                      onClick={() =>
                        handleToggleVisibility(store.id, store.isHidden)
                      }
                    >
                      {store.isHidden ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Container>
    </>
  );
};

export default SuperAdminDashboard;
