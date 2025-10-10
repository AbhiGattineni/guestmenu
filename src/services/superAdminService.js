/**
 * Super Admin Service
 * Handles all super admin operations: users, stores, analytics
 */

import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const db = getFirestore();
const auth = getAuth();

/**
 * =================
 * ANALYTICS
 * =================
 */

/**
 * Get overall analytics for super admin dashboard
 */
export const getAnalytics = async () => {
  try {
    const analytics = {
      totalStores: 0,
      totalUsers: 0,
      totalManagers: 0,
      totalCategories: 0,
      totalMenuItems: 0,
      activeStores: 0,
      storesList: [],
    };

    // Get all stores
    const clientsSnapshot = await getDocs(collection(db, "clients"));
    analytics.totalStores = clientsSnapshot.size;

    // Get all users
    const usersSnapshot = await getDocs(collection(db, "users"));
    analytics.totalUsers = usersSnapshot.size;

    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      if (userData.role === "manager") {
        analytics.totalManagers++;
      }
    }

    // Count categories and menu items across all stores
    for (const clientDoc of clientsSnapshot.docs) {
      const storeId = clientDoc.id;
      const storeData = clientDoc.data();

      // Count categories
      const categoriesSnapshot = await getDocs(
        collection(db, `clients/${storeId}/categories`)
      );
      analytics.totalCategories += categoriesSnapshot.size;

      // Count menu items
      const menuItemsSnapshot = await getDocs(
        collection(db, `clients/${storeId}/menuItems`)
      );
      analytics.totalMenuItems += menuItemsSnapshot.size;

      // Add to stores list
      analytics.storesList.push({
        id: storeId,
        name: storeData.name || storeId,
        categoriesCount: categoriesSnapshot.size,
        itemsCount: menuItemsSnapshot.size,
      });

      if (storeData.isActive !== false) {
        analytics.activeStores++;
      }
    }

    return analytics;
  } catch (error) {
    console.error("Error fetching analytics:", error);
    throw error;
  }
};

/**
 * =================
 * USER MANAGEMENT
 * =================
 */

/**
 * Get all users
 */
export const getAllUsers = async () => {
  try {
    const usersSnapshot = await getDocs(collection(db, "users"));
    return usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

/**
 * Create a new user
 */
export const createUser = async (email, password, role, storeId = null) => {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const userId = userCredential.user.uid;

    // Create user document in Firestore
    const userData = {
      email,
      role, // "superadmin" or "manager"
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    if (role === "manager" && storeId) {
      userData.storeId = storeId;
    }

    await setDoc(doc(db, "users", userId), userData);

    return { id: userId, ...userData };
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

/**
 * Update user details
 */
export const updateUser = async (userId, updates) => {
  try {
    await updateDoc(doc(db, "users", userId), {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

/**
 * Assign store to manager
 */
export const assignStoreToManager = async (userId, storeId) => {
  try {
    await updateDoc(doc(db, "users", userId), {
      storeId,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error assigning store:", error);
    throw error;
  }
};

/**
 * Delete user
 * Note: This only deletes from Firestore, not from Firebase Auth
 */
export const deleteUser = async (userId) => {
  try {
    await deleteDoc(doc(db, "users", userId));
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

/**
 * =================
 * STORE MANAGEMENT
 * =================
 */

/**
 * Get all stores
 */
export const getAllStores = async () => {
  try {
    const clientsSnapshot = await getDocs(collection(db, "clients"));
    return clientsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching stores:", error);
    throw error;
  }
};

/**
 * Create a new store
 */
export const createStore = async (storeId, storeData) => {
  try {
    await setDoc(doc(db, "clients", storeId), {
      ...storeData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      isActive: true,
    });
    return { id: storeId, ...storeData };
  } catch (error) {
    console.error("Error creating store:", error);
    throw error;
  }
};

/**
 * Update store details
 */
export const updateStore = async (storeId, updates) => {
  try {
    await updateDoc(doc(db, "clients", storeId), {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating store:", error);
    throw error;
  }
};

/**
 * Delete store
 * Note: This does not delete subcollections
 */
export const deleteStore = async (storeId) => {
  try {
    await deleteDoc(doc(db, "clients", storeId));
  } catch (error) {
    console.error("Error deleting store:", error);
    throw error;
  }
};

/**
 * =================
 * BANNER MANAGEMENT (Cross-Store)
 * =================
 */

/**
 * Get banners for a specific store
 */
export const getStoreBanners = async (storeId) => {
  try {
    const bannersRef = collection(db, `clients/${storeId}/banners`);
    const q = query(bannersRef, orderBy("createdAt", "desc"));
    const bannersSnapshot = await getDocs(q);
    return bannersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching banners:", error);
    // Return empty array if collection doesn't exist
    return [];
  }
};

/**
 * Create banner for a store
 */
export const createStoreBanner = async (storeId, bannerData) => {
  try {
    const bannersRef = collection(db, `clients/${storeId}/banners`);
    const newBannerRef = doc(bannersRef);

    await setDoc(newBannerRef, {
      ...bannerData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return { id: newBannerRef.id, ...bannerData };
  } catch (error) {
    console.error("Error creating banner:", error);
    throw error;
  }
};

/**
 * Update banner
 */
export const updateStoreBanner = async (storeId, bannerId, updates) => {
  try {
    await updateDoc(doc(db, `clients/${storeId}/banners`, bannerId), {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating banner:", error);
    throw error;
  }
};

/**
 * Delete banner
 */
export const deleteStoreBanner = async (storeId, bannerId) => {
  try {
    await deleteDoc(doc(db, `clients/${storeId}/banners`, bannerId));
  } catch (error) {
    console.error("Error deleting banner:", error);
    throw error;
  }
};

/**
 * =================
 * MENU MANAGEMENT (Cross-Store)
 * =================
 */

/**
 * Get categories for a specific store
 */
export const getStoreCategories = async (storeId) => {
  try {
    const categoriesSnapshot = await getDocs(
      collection(db, `clients/${storeId}/categories`)
    );
    return categoriesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

/**
 * Get menu items for a specific store
 */
export const getStoreMenuItems = async (storeId, categoryId = null) => {
  try {
    const itemsRef = collection(db, `clients/${storeId}/menuItems`);
    let q = itemsRef;

    if (categoryId) {
      q = query(itemsRef, where("categoryId", "==", categoryId));
    }

    const itemsSnapshot = await getDocs(q);
    return itemsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching menu items:", error);
    throw error;
  }
};

/**
 * Create category for a store
 */
export const createStoreCategory = async (storeId, categoryData) => {
  try {
    const categoriesRef = collection(db, `clients/${storeId}/categories`);
    const newCategoryRef = doc(categoriesRef);

    await setDoc(newCategoryRef, {
      ...categoryData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      isActive: true,
    });

    return { id: newCategoryRef.id, ...categoryData };
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

/**
 * Update category
 */
export const updateStoreCategory = async (storeId, categoryId, updates) => {
  try {
    await updateDoc(doc(db, `clients/${storeId}/categories`, categoryId), {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

/**
 * Delete category
 */
export const deleteStoreCategory = async (storeId, categoryId) => {
  try {
    await deleteDoc(doc(db, `clients/${storeId}/categories`, categoryId));
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

/**
 * Create menu item for a store
 */
export const createStoreMenuItem = async (storeId, itemData) => {
  try {
    const itemsRef = collection(db, `clients/${storeId}/menuItems`);
    const newItemRef = doc(itemsRef);

    await setDoc(newItemRef, {
      ...itemData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      isActive: true,
    });

    return { id: newItemRef.id, ...itemData };
  } catch (error) {
    console.error("Error creating menu item:", error);
    throw error;
  }
};

/**
 * Update menu item
 */
export const updateStoreMenuItem = async (storeId, itemId, updates) => {
  try {
    await updateDoc(doc(db, `clients/${storeId}/menuItems`, itemId), {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating menu item:", error);
    throw error;
  }
};

/**
 * Delete menu item
 */
export const deleteStoreMenuItem = async (storeId, itemId) => {
  try {
    await deleteDoc(doc(db, `clients/${storeId}/menuItems`, itemId));
  } catch (error) {
    console.error("Error deleting menu item:", error);
    throw error;
  }
};
