
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, setDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { 
    AppBar, Toolbar, Typography, Container, Grid, Card, CardContent, 
    Button, TextField, Paper, Table, TableBody, TableCell, TableHead, 
    TableRow, IconButton
} from '@mui/material';
import { Delete, Visibility, VisibilityOff } from '@mui/icons-material';

const SuperAdminDashboard = () => {
    const [stats, setStats] = useState({ totalStores: 0, totalMenuItems: 0, totalManagers: 0 });
    const [stores, setStores] = useState([]);
    const [newStoreId, setNewStoreId] = useState('');
    const [newManager, setNewManager] = useState({ uid: '', storeId: '' });

    const db = getFirestore();

    const fetchStatsAndStores = async () => {
        const clientsCollection = collection(db, 'clients');
        const clientsSnapshot = await getDocs(clientsCollection);
        const storesData = clientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        let totalMenuItems = 0;
        let totalManagers = 0;

        for (const store of storesData) {
            const menuItemsCollection = collection(db, `clients/${store.id}/menuItems`);
            const menuItemsSnapshot = await getDocs(menuItemsCollection);
            totalMenuItems += menuItemsSnapshot.size;

            const usersCollection = collection(db, `clients/${store.id}/users`);
            const usersSnapshot = await getDocs(usersCollection);
            usersSnapshot.forEach(userDoc => {
                if (userDoc.data().role === 'manager') {
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
        await setDoc(doc(db, 'clients', newStoreId), { createdAt: new Date() });
        setNewStoreId('');
        fetchStatsAndStores();
    };

    const handleAssignManager = async () => {
        if (!newManager.uid || !newManager.storeId) return;
        await setDoc(doc(db, `clients/${newManager.storeId}/users`, newManager.uid), { role: 'manager' });
        setNewManager({ uid: '', storeId: '' });
        fetchStatsAndStores();
    };

    const handleDeleteStore = async (storeId) => {
        await deleteDoc(doc(db, 'clients', storeId));
        fetchStatsAndStores();
    };

    const handleToggleVisibility = async (storeId, currentVisibility) => {
        await updateDoc(doc(db, 'clients', storeId), { isHidden: !currentVisibility });
        fetchStatsAndStores();
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">Super Admin Dashboard</Typography>
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
                    <Button variant="contained" onClick={handleOnboardStore}>Onboard</Button>
                </Paper>

                <Paper sx={{ mt: 4, p: 2 }}>
                    <Typography variant="h6">Assign Manager to Store</Typography>
                    <TextField
                        label="Manager UID"
                        value={newManager.uid}
                        onChange={(e) => setNewManager({ ...newManager, uid: e.target.value })}
                        sx={{ mr: 2 }}
                    />
                    <TextField
                        label="Store ID"
                        value={newManager.storeId}
                        onChange={(e) => setNewManager({ ...newManager, storeId: e.target.value })}
                        sx={{ mr: 2 }}
                    />
                    <Button variant="contained" onClick={handleAssignManager}>Assign</Button>
                </Paper>

                <Paper sx={{ mt: 4 }}>
                    <Typography variant="h6" sx={{ p: 2 }}>Stores</Typography>
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
                                        <IconButton onClick={() => handleToggleVisibility(store.id, store.isHidden)}>
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
