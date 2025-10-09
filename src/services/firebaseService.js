/**
 * Firebase Service
 * Replaces mockApi.js with real Firestore database operations
 *
 * Firestore Structure:
 * clients/{clientId}/
 *   - restaurantInfo (document)
 *   - banners (collection)
 *   - categories (collection)
 *   - menuItems (collection)
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
import "../firebase"; // Initialize Firebase

const db = getFirestore();

/**
 * Get the client ID based on subdomain or configuration
 * In production, this would be determined by the URL subdomain
 * For development, we'll use a default client ID
 */
const getClientId = () => {
  // Check if running in development
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    return "demo-restaurant"; // Default client for development
  }

  // Extract subdomain as client ID
  const subdomain = window.location.hostname.split(".")[0];
  return subdomain || "demo-restaurant";
};

/**
 * Fetch restaurant information
 * @returns {Promise<Object>} Restaurant data
 */
export const fetchRestaurantInfo = async () => {
  try {
    const clientId = getClientId();
    const docRef = doc(db, "clients", clientId, "settings", "restaurantInfo");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      // Return default data if not found
      return {
        id: 1,
        name: "The Gourmet Kitchen",
        logo: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&h=200&fit=crop&q=80",
        description: "Fine dining experience with authentic flavors",
      };
    }
  } catch (error) {
    console.error("Error fetching restaurant info:", error);
    throw error;
  }
};

/**
 * Update restaurant information
 * @param {Object} restaurantData - Restaurant data to update
 * @returns {Promise<Object>} Updated restaurant data
 */
export const updateRestaurantInfo = async (restaurantData) => {
  try {
    const clientId = getClientId();
    const docRef = doc(db, "clients", clientId, "settings", "restaurantInfo");
    await setDoc(
      docRef,
      {
        ...restaurantData,
        updatedAt: Timestamp.now(),
      },
      { merge: true }
    );
    return restaurantData;
  } catch (error) {
    console.error("Error updating restaurant info:", error);
    throw error;
  }
};

/**
 * Fetch promotional banners
 * @returns {Promise<Array>} Array of banner objects
 */
export const fetchBanners = async () => {
  try {
    const clientId = getClientId();
    const bannersRef = collection(db, "clients", clientId, "banners");
    const q = query(bannersRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching banners:", error);
    // Return empty array if collection doesn't exist yet
    return [];
  }
};

/**
 * Add a new banner
 * @param {Object} bannerData - New banner data (title, description, image)
 * @returns {Promise<Object>} Created banner
 */
export const addBanner = async (bannerData) => {
  try {
    const clientId = getClientId();
    const bannersRef = collection(db, "clients", clientId, "banners");
    const newBannerRef = doc(bannersRef);

    const bannerWithTimestamp = {
      ...bannerData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    await setDoc(newBannerRef, bannerWithTimestamp);

    return {
      id: newBannerRef.id,
      ...bannerWithTimestamp,
    };
  } catch (error) {
    console.error("Error adding banner:", error);
    throw error;
  }
};

/**
 * Delete a banner
 * @param {string} bannerId - ID of banner to delete
 * @returns {Promise<boolean>} Success status
 */
export const deleteBanner = async (bannerId) => {
  try {
    const clientId = getClientId();
    const bannerRef = doc(db, "clients", clientId, "banners", bannerId);
    await deleteDoc(bannerRef);
    return true;
  } catch (error) {
    console.error("Error deleting banner:", error);
    throw error;
  }
};

/**
 * Fetch menu categories
 * @param {boolean} includeHidden - Whether to include hidden categories
 * @returns {Promise<Array>} Array of category objects
 */
export const fetchMenuCategories = async (includeHidden = false) => {
  try {
    const clientId = getClientId();
    const categoriesRef = collection(db, "clients", clientId, "categories");
    let q;

    if (includeHidden) {
      q = query(categoriesRef, orderBy("order", "asc"));
    } else {
      q = query(
        categoriesRef,
        where("isActive", "==", true),
        orderBy("order", "asc")
      );
    }

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

/**
 * Add a new category
 * @param {Object} categoryData - New category data (name, description, icon)
 * @returns {Promise<Object>} Created category
 */
export const addCategory = async (categoryData) => {
  try {
    const clientId = getClientId();
    const categoriesRef = collection(db, "clients", clientId, "categories");

    // Get the highest order number
    const allCategories = await fetchMenuCategories(true);
    const maxOrder =
      allCategories.length > 0
        ? Math.max(...allCategories.map((cat) => cat.order || 0))
        : 0;

    const newCategoryRef = doc(categoriesRef);

    const categoryWithMetadata = {
      ...categoryData,
      order: maxOrder + 1,
      isActive: true,
      itemCount: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    await setDoc(newCategoryRef, categoryWithMetadata);

    return {
      id: newCategoryRef.id,
      ...categoryWithMetadata,
    };
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};

/**
 * Toggle category visibility
 * @param {string} categoryId - Category ID
 * @returns {Promise<Object>} Updated category
 */
export const toggleCategoryVisibility = async (categoryId) => {
  try {
    const clientId = getClientId();
    const categoryRef = doc(db, "clients", clientId, "categories", categoryId);
    const categorySnap = await getDoc(categoryRef);

    if (!categorySnap.exists()) {
      throw new Error("Category not found");
    }

    const currentData = categorySnap.data();
    const newIsActive = !currentData.isActive;

    await updateDoc(categoryRef, {
      isActive: newIsActive,
      updatedAt: Timestamp.now(),
    });

    return {
      id: categoryId,
      ...currentData,
      isActive: newIsActive,
    };
  } catch (error) {
    console.error("Error toggling category visibility:", error);
    throw error;
  }
};

/**
 * Fetch menu items by category
 * @param {string} categoryId - Category ID
 * @param {boolean} includeHidden - Whether to include hidden items
 * @returns {Promise<Array>} Array of menu items
 */
export const fetchMenuItems = async (categoryId, includeHidden = false) => {
  try {
    const clientId = getClientId();
    const itemsRef = collection(db, "clients", clientId, "menuItems");
    let q;

    if (includeHidden) {
      q = query(itemsRef, where("categoryId", "==", categoryId));
    } else {
      q = query(
        itemsRef,
        where("categoryId", "==", categoryId),
        where("isActive", "==", true)
      );
    }

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return [];
  }
};

/**
 * Update a menu item
 * @param {Object} updatedItem - Updated menu item
 * @returns {Promise<Object>} Updated item
 */
export const updateMenuItem = async (updatedItem) => {
  try {
    const clientId = getClientId();
    const itemRef = doc(db, "clients", clientId, "menuItems", updatedItem.id);

    const itemData = {
      ...updatedItem,
      updatedAt: Timestamp.now(),
    };

    // Remove the id field from the data to be saved
    delete itemData.id;

    await updateDoc(itemRef, itemData);

    return updatedItem;
  } catch (error) {
    console.error("Error updating menu item:", error);
    throw error;
  }
};

/**
 * Add a new menu item
 * @param {Object} itemData - New menu item data
 * @returns {Promise<Object>} Created item
 */
export const addMenuItem = async (itemData) => {
  try {
    const clientId = getClientId();
    const itemsRef = collection(db, "clients", clientId, "menuItems");
    const newItemRef = doc(itemsRef);

    const itemWithMetadata = {
      ...itemData,
      isActive: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    await setDoc(newItemRef, itemWithMetadata);

    return {
      id: newItemRef.id,
      ...itemWithMetadata,
    };
  } catch (error) {
    console.error("Error adding menu item:", error);
    throw error;
  }
};

/**
 * Toggle item visibility
 * @param {string} itemId - Item ID
 * @returns {Promise<Object>} Updated item
 */
export const toggleItemVisibility = async (itemId) => {
  try {
    const clientId = getClientId();
    const itemRef = doc(db, "clients", clientId, "menuItems", itemId);
    const itemSnap = await getDoc(itemRef);

    if (!itemSnap.exists()) {
      throw new Error("Item not found");
    }

    const currentData = itemSnap.data();
    const newIsActive = !currentData.isActive;

    await updateDoc(itemRef, {
      isActive: newIsActive,
      updatedAt: Timestamp.now(),
    });

    return {
      id: itemId,
      ...currentData,
      isActive: newIsActive,
    };
  } catch (error) {
    console.error("Error toggling item visibility:", error);
    throw error;
  }
};

/**
 * Delete a menu item
 * @param {string} itemId - Item ID
 * @returns {Promise<boolean>} Success status
 */
export const deleteMenuItem = async (itemId) => {
  try {
    const clientId = getClientId();
    const itemRef = doc(db, "clients", clientId, "menuItems", itemId);
    await deleteDoc(itemRef);
    return true;
  } catch (error) {
    console.error("Error deleting menu item:", error);
    throw error;
  }
};
