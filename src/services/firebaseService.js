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
 * users/{userId}/
 *   - role (string)
 *   - storeId (string, for managers)
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

// This variable will hold the manager's store ID once they are logged in.
let managerStoreId = null;

/**
 * Sets the store ID for the logged-in manager.
 * This will override the subdomain logic for all subsequent Firestore calls.
 * @param {string} storeId - The manager's assigned store ID.
 */
export const setManagerStoreId = (storeId) => {
  console.log(`Setting manager store ID to: ${storeId}`);
  managerStoreId = storeId;
};

/**
 * Clears the manager's store ID, for example on logout.
 */
export const clearManagerStoreId = () => {
  managerStoreId = null;
};

/**
 * Get the client ID for Firestore operations.
 * For a logged-in manager, it uses the storeId from their profile.
 * For the public-facing customer menu, it uses the URL subdomain.
 * A default ID is used for local development if no other ID is available.
 *
 * Examples:
 * - 1.localhost:3000 → clientId: "1"
 * - store123.yourdomain.com → clientId: "store123"
 * - localhost:3000 → clientId: "demo-restaurant" (default)
 */
export const getClientId = () => {
  // 1. If a manager's store ID is set, always use it (for logged-in managers).
  if (managerStoreId) {
    console.log(`🏪 Using manager store ID: ${managerStoreId}`);
    return managerStoreId;
  }

  // 2. For the customer view, check for a subdomain.
  const hostname = window.location.hostname;
  const hostnameParts = hostname.split(".");

  // Check if there's a subdomain (not "www" or "localhost" alone)
  // Handles: 1.localhost, store.localhost, abc.example.com, etc.
  if (hostnameParts.length >= 2 && hostnameParts[0] !== "www") {
    // For *.localhost (e.g., 1.localhost, store.localhost)
    if (hostnameParts[hostnameParts.length - 1] === "localhost") {
      const storeId = hostnameParts[0];
      console.log(`🏪 Detected subdomain for localhost: ${storeId}`);
      return storeId;
    }
    // For production domains (e.g., store.example.com)
    if (hostnameParts.length > 2) {
      const storeId = hostnameParts[0];
      console.log(`🏪 Detected subdomain: ${storeId}`);
      return storeId;
    }
  }

  // 3. For local development without subdomain (plain localhost)
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    console.log(`🏪 Using default store for localhost: demo-restaurant`);
    return "demo-restaurant";
  }

  // Fallback
  console.warn(
    `⚠️ Could not determine store ID from hostname: ${hostname}, using default`
  );
  return "demo-restaurant";
};

/**
 * Fetches user data from the 'users' collection.
 * @param {string} userId - The UID of the user to fetch.
 * @returns {Promise<Object|null>} User data object or null if not found.
 */
export const getUserData = async (userId) => {
  try {
    if (!userId) return null;
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      return userDocSnap.data();
    } else {
      console.warn(`User document not found for ID: ${userId}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

/**
 * Fetch restaurant information
 * Fetches the main client/store document which contains name, description, logo, etc.
 * @returns {Promise<Object>} Restaurant data
 */
export const fetchRestaurantInfo = async () => {
  try {
    const clientId = getClientId();
    console.log(`📋 Fetching restaurant info for store: ${clientId}`);

    // Fetch the main client document (e.g., clients/1)
    const docRef = doc(db, "clients", clientId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log(`✅ Restaurant info loaded:`, data);
      return {
        id: clientId,
        ...data,
      };
    } else {
      console.error(`❌ Store not found: ${clientId}`);
      console.error(`💡 Please create a document at: clients/${clientId}`);
      console.error(
        `📋 Required fields: name, description (optional: logo, address, phone)`
      );
      throw new Error(
        `Store "${clientId}" does not exist in the database. Please create it in Firestore.`
      );
    }
  } catch (error) {
    console.error("Error fetching restaurant info:", error);
    throw error;
  }
};

/**
 * Update restaurant information
 * Updates the main client/store document
 * @param {Object} restaurantData - Restaurant data to update
 * @returns {Promise<Object>} Updated restaurant data
 */
export const updateRestaurantInfo = async (restaurantData) => {
  try {
    const clientId = getClientId();
    console.log(`📝 Updating restaurant info for store: ${clientId}`);

    // Update the main client document (e.g., clients/1)
    const docRef = doc(db, "clients", clientId);
    await setDoc(
      docRef,
      {
        ...restaurantData,
        updatedAt: Timestamp.now(),
      },
      { merge: true }
    );

    console.log(`✅ Restaurant info updated successfully`);
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
    console.log(`🎨 Fetching banners for store: ${clientId}`);

    const bannersRef = collection(db, "clients", clientId, "banners");
    const q = query(bannersRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const banners = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(`✅ Found ${banners.length} banners:`, banners);
    return banners;
  } catch (error) {
    console.error("❌ Error fetching banners:", error);
    console.error("Error details:", error.message);
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
 * Update a banner
 * @param {string} bannerId - ID of banner to update
 * @param {Object} updates - Updated banner data
 * @returns {Promise<void>}
 */
export const updateBanner = async (bannerId, updates) => {
  try {
    const clientId = getClientId();
    const bannerRef = doc(db, "clients", clientId, "banners", bannerId);
    await updateDoc(bannerRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating banner:", error);
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
    console.log(
      `📂 Fetching categories for store: ${clientId} (includeHidden: ${includeHidden})`
    );

    const categoriesRef = collection(db, "clients", clientId, "categories");

    // Fetch all categories and filter/sort in memory to avoid composite index requirement
    // Once you create the Firestore index, you can optimize this to query directly
    const querySnapshot = await getDocs(categoriesRef);

    let categories = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Filter out inactive categories if needed
    if (!includeHidden) {
      categories = categories.filter((cat) => cat.isActive === true);
    }

    // Sort by order field
    categories.sort((a, b) => (a.order || 0) - (b.order || 0));

    console.log(`✅ Found ${categories.length} categories:`, categories);
    return categories;
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    console.error("Error details:", error.message);
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
 * Delete a category
 * Note: This does not delete associated menu items. Consider doing that separately if needed.
 * @param {string} categoryId - Category ID to delete
 * @returns {Promise<void>}
 */
export const deleteCategory = async (categoryId) => {
  try {
    const clientId = getClientId();
    const categoryRef = doc(db, "clients", clientId, "categories", categoryId);
    await deleteDoc(categoryRef);
    console.log(`Category ${categoryId} deleted successfully`);
  } catch (error) {
    console.error("Error deleting category:", error);
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
    console.log(
      `🍽️ Fetching menu items for store: ${clientId}, category: ${categoryId} (includeHidden: ${includeHidden})`
    );

    const itemsRef = collection(db, "clients", clientId, "menuItems");

    // Query by categoryId only to avoid composite index requirement
    const q = query(itemsRef, where("categoryId", "==", categoryId));
    const querySnapshot = await getDocs(q);

    let items = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Filter out inactive items in memory if needed
    if (!includeHidden) {
      items = items.filter((item) => item.isActive === true);
    }

    console.log(`✅ Found ${items.length} menu items:`, items);
    return items;
  } catch (error) {
    console.error("❌ Error fetching menu items:", error);
    console.error("Error details:", error.message);
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

/**
 * Fetch menu items by subcategory
 * @param {string} categoryId - Category ID
 * @param {string} subcategoryId - Subcategory ID (null = no subcategory)
 * @param {boolean} includeHidden - Whether to include hidden items
 * @returns {Promise<Array>} Array of menu items
 */
export const fetchMenuItemsBySubcategory = async (
  categoryId,
  subcategoryId,
  includeHidden = false
) => {
  try {
    const clientId = getClientId();
    console.log(
      `🍽️  Fetching items for subcategory: ${
        subcategoryId || "none"
      } in category: ${categoryId}`
    );

    const itemsRef = collection(db, "clients", clientId, "menuItems");
    const q = query(itemsRef, where("categoryId", "==", categoryId));
    const querySnapshot = await getDocs(q);

    let items = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Filter by subcategory
    if (subcategoryId === null) {
      // Show items without subcategory
      items = items.filter((item) => !item.subcategoryId);
    } else if (subcategoryId) {
      // Show items with specific subcategory
      items = items.filter((item) => item.subcategoryId === subcategoryId);
    }
    // If subcategoryId is undefined, show all items in category

    // Filter by isActive
    if (!includeHidden) {
      items = items.filter((item) => item.isActive !== false);
    }

    // Sort by order
    items.sort((a, b) => (a.order || 0) - (b.order || 0));

    console.log(`✅ Found ${items.length} items`);
    return items;
  } catch (error) {
    console.error("❌ Error fetching items by subcategory:", error);
    throw error;
  }
};
