/**
 * Firebase Service - Guest Menu Platform
 * Handles all Firestore database operations for multi-tenant guest menu system
 *
 * Database Structure:
 * users/{userId}/
 *   - profile (name, email, phone, avatar, theme)
 *   - settings (notifications, privacy)
 *
 * menus/{userId}/
 *   - info (title, description)
 *   - categories/{categoryId}/ (name, icon, order)
 *   - items/{itemId}/ (name, description, quantity, options)
 *
 * submissions/{userId}/
 *   - {submissionId}/ (guestName, guestEmail, guestPhone, items, timestamp, status)
 *
 * subdomains/{subdomain}/
 *   - userId (owner's user ID)
 *   - createdAt (timestamp)
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
  increment,
} from "firebase/firestore";
import "../firebase";

const db = getFirestore();

// ============ USER PROFILE OPERATIONS ============

export const createUserProfile = async (userId, profileData) => {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, {
      profile: {
        name: profileData.name || "",
        email: profileData.email || "",
        phone: profileData.phone || "",
        avatar: profileData.avatar || null,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      },
      settings: {
        emailNotifications: true,
        darkMode: false,
        theme: "default",
      },
    });
    return { userId, ...profileData };
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
};

export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return {
        userId,
        ...userSnap.data(),
      };
    } else {
      console.warn(`User profile not found for ID: ${userId}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (userId, profileData) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      profile: {
        ...profileData,
        updatedAt: Timestamp.now(),
      },
    });
    return profileData;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export const updateUserSettings = async (userId, settings) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      settings,
    });
    return settings;
  } catch (error) {
    console.error("Error updating user settings:", error);
    throw error;
  }
};

// ============ SUBDOMAIN OPERATIONS ============

export const checkSubdomainAvailability = async (subdomain) => {
  try {
    const subdomainRef = doc(db, "subdomains", subdomain.toLowerCase());
    const subdomainSnap = await getDoc(subdomainRef);
    return !subdomainSnap.exists();
  } catch (error) {
    console.error("Error checking subdomain availability:", error);
    throw error;
  }
};

export const registerSubdomain = async (userId, subdomain) => {
  try {
    const subdomainRef = doc(db, "subdomains", subdomain.toLowerCase());
    await setDoc(subdomainRef, {
      userId,
      subdomain: subdomain.toLowerCase(),
      createdAt: Timestamp.now(),
    });
    return subdomain.toLowerCase();
  } catch (error) {
    console.error("Error registering subdomain:", error);
    throw error;
  }
};

export const getUserBySubdomain = async (subdomain) => {
  try {
    const subdomainRef = doc(db, "subdomains", subdomain.toLowerCase());
    const subdomainSnap = await getDoc(subdomainRef);

    if (subdomainSnap.exists()) {
      return subdomainSnap.data().userId;
    } else {
      console.warn(`Subdomain not found: ${subdomain}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user by subdomain:", error);
    throw error;
  }
};

// ============ MENU OPERATIONS ============

export const createMenu = async (userId, menuData) => {
  try {
    const userMenusRef = collection(db, "menus", userId, "menus");
    const newMenuRef = doc(userMenusRef);

    const menuWithMetadata = {
      ...menuData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      isActive: true,
      submissionCount: 0,
    };

    await setDoc(newMenuRef, menuWithMetadata);

    return {
      id: newMenuRef.id,
      ...menuWithMetadata,
    };
  } catch (error) {
    console.error("Error creating menu:", error);
    throw error;
  }
};

export const getMenuById = async (userId, menuId) => {
  try {
    const menuRef = doc(db, "menus", userId, "menus", menuId);
    const menuSnap = await getDoc(menuRef);

    if (menuSnap.exists()) {
      return {
        id: menuId,
        ...menuSnap.data(),
      };
    } else {
      console.warn(`Menu not found for ID: ${menuId}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching menu:", error);
    throw error;
  }
};

export const getUserMenus = async (userId) => {
  try {
    const userMenusRef = collection(db, "menus", userId, "menus");
    const menusSnap = await getDocs(userMenusRef);

    return menusSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching user menus:", error);
    return [];
  }
};

export const updateMenu = async (userId, menuId, menuData) => {
  try {
    const menuRef = doc(db, "menus", userId, "menus", menuId);
    await updateDoc(menuRef, {
      ...menuData,
      updatedAt: Timestamp.now(),
    });
    return menuData;
  } catch (error) {
    console.error("Error updating menu:", error);
    throw error;
  }
};

export const deleteMenu = async (userId, menuId) => {
  try {
    const menuRef = doc(db, "menus", userId, "menus", menuId);
    await deleteDoc(menuRef);
    return true;
  } catch (error) {
    console.error("Error deleting menu:", error);
    throw error;
  }
};

// ============ CATEGORY OPERATIONS ============

export const addCategory = async (userId, menuId, categoryData) => {
  try {
    const categoriesRef = collection(
      db,
      "menus",
      userId,
      "menus",
      menuId,
      "categories"
    );
    const newCategoryRef = doc(categoriesRef);

    const categoryWithMetadata = {
      ...categoryData,
      order: categoryData.order || 0,
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

export const getCategories = async (userId, menuId) => {
  try {
    const categoriesRef = collection(
      db,
      "menus",
      userId,
      "menus",
      menuId,
      "categories"
    );
    const q = query(categoriesRef, orderBy("order", "asc"));
    const categoriesSnap = await getDocs(q);

    return categoriesSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const updateCategory = async (
  userId,
  menuId,
  categoryId,
  categoryData
) => {
  try {
    const categoryRef = doc(
      db,
      "menus",
      userId,
      "menus",
      menuId,
      "categories",
      categoryId
    );
    await updateDoc(categoryRef, {
      ...categoryData,
      updatedAt: Timestamp.now(),
    });
    return categoryData;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

export const deleteCategory = async (userId, menuId, categoryId) => {
  try {
    const categoryRef = doc(
      db,
      "menus",
      userId,
      "menus",
      menuId,
      "categories",
      categoryId
    );
    await deleteDoc(categoryRef);
    return true;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

// ============ MENU ITEM OPERATIONS ============

export const addMenuItem = async (userId, menuId, itemData) => {
  try {
    const itemsRef = collection(db, "menus", userId, "menus", menuId, "items");
    const newItemRef = doc(itemsRef);

    const itemWithMetadata = {
      ...itemData,
      order: itemData.order || 0,
      quantity: itemData.quantity || 0,
      available: itemData.available !== false,
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

export const getMenuItems = async (userId, menuId, categoryId = null) => {
  try {
    const itemsRef = collection(db, "menus", userId, "menus", menuId, "items");

    let q;
    if (categoryId) {
      q = query(
        itemsRef,
        where("categoryId", "==", categoryId),
        orderBy("order", "asc")
      );
    } else {
      q = query(itemsRef, orderBy("order", "asc"));
    }

    const itemsSnap = await getDocs(q);

    return itemsSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return [];
  }
};

export const updateMenuItem = async (userId, menuId, itemId, itemData) => {
  try {
    const itemRef = doc(db, "menus", userId, "menus", menuId, "items", itemId);
    await updateDoc(itemRef, {
      ...itemData,
      updatedAt: Timestamp.now(),
    });
    return itemData;
  } catch (error) {
    console.error("Error updating menu item:", error);
    throw error;
  }
};

export const deleteMenuItem = async (userId, menuId, itemId) => {
  try {
    const itemRef = doc(db, "menus", userId, "menus", menuId, "items", itemId);
    await deleteDoc(itemRef);
    return true;
  } catch (error) {
    console.error("Error deleting menu item:", error);
    throw error;
  }
};

// ============ SUBMISSION OPERATIONS ============

export const submitGuestSelection = async (userId, menuId, submissionData) => {
  try {
    const submissionsRef = collection(db, "submissions", userId, "submissions");
    const newSubmissionRef = doc(submissionsRef);

    const submissionWithMetadata = {
      ...submissionData,
      menuId,
      status: "pending",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    await setDoc(newSubmissionRef, submissionWithMetadata);

    // Update menu submission count
    const menuRef = doc(db, "menus", userId, "menus", menuId);
    await updateDoc(menuRef, {
      submissionCount: increment(1),
    });

    return {
      id: newSubmissionRef.id,
      ...submissionWithMetadata,
    };
  } catch (error) {
    console.error("Error submitting guest selection:", error);
    throw error;
  }
};

export const getSubmissions = async (userId, menuId = null, filters = {}) => {
  try {
    const submissionsRef = collection(db, "submissions", userId, "submissions");

    let q = submissionsRef;
    let conditions = [];

    if (menuId) {
      conditions.push(where("menuId", "==", menuId));
    }

    if (filters.status) {
      conditions.push(where("status", "==", filters.status));
    }

    if (conditions.length > 0) {
      q = query(submissionsRef, ...conditions, orderBy("createdAt", "desc"));
    } else {
      q = query(submissionsRef, orderBy("createdAt", "desc"));
    }

    const submissionsSnap = await getDocs(q);

    return submissionsSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return [];
  }
};

export const getSubmissionById = async (userId, submissionId) => {
  try {
    const submissionRef = doc(
      db,
      "submissions",
      userId,
      "submissions",
      submissionId
    );
    const submissionSnap = await getDoc(submissionRef);

    if (submissionSnap.exists()) {
      return {
        id: submissionId,
        ...submissionSnap.data(),
      };
    } else {
      console.warn(`Submission not found for ID: ${submissionId}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching submission:", error);
    throw error;
  }
};

export const updateSubmission = async (userId, submissionId, updateData) => {
  try {
    const submissionRef = doc(
      db,
      "submissions",
      userId,
      "submissions",
      submissionId
    );
    await updateDoc(submissionRef, {
      ...updateData,
      updatedAt: Timestamp.now(),
    });
    return updateData;
  } catch (error) {
    console.error("Error updating submission:", error);
    throw error;
  }
};

export const deleteSubmission = async (userId, submissionId) => {
  try {
    const submissionRef = doc(
      db,
      "submissions",
      userId,
      "submissions",
      submissionId
    );
    await deleteDoc(submissionRef);
    return true;
  } catch (error) {
    console.error("Error deleting submission:", error);
    throw error;
  }
};

// ============ PUBLIC MENU ACCESS ============

export const getPublicMenu = async (userId, menuId) => {
  try {
    const menuRef = doc(db, "menus", userId, "menus", menuId);
    const menuSnap = await getDoc(menuRef);

    if (menuSnap.exists()) {
      return {
        id: menuId,
        ...menuSnap.data(),
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching public menu:", error);
    throw error;
  }
};

export const getPublicCategories = async (userId, menuId) => {
  try {
    return await getCategories(userId, menuId);
  } catch (error) {
    console.error("Error fetching public categories:", error);
    return [];
  }
};

export const getPublicMenuItems = async (userId, menuId) => {
  try {
    return await getMenuItems(userId, menuId);
  } catch (error) {
    console.error("Error fetching public menu items:", error);
    return [];
  }
};
