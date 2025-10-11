import {
  getFirestore,
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { getClientId } from "./firebaseService";

const db = getFirestore();

/**
 * Fetch subcategories for a given category
 * @param {string} categoryId - The ID of the parent category
 * @param {boolean} includeHidden - Whether to include inactive subcategories
 * @returns {Promise<Array>} Array of subcategory objects
 */
export const fetchSubcategories = async (categoryId, includeHidden = false) => {
  try {
    const clientId = getClientId();
    const subcategoriesRef = collection(
      db,
      "clients",
      clientId,
      "subcategories"
    );

    // Try with composite index first
    try {
      const q = query(
        subcategoriesRef,
        where("categoryId", "==", categoryId),
        orderBy("order", "asc")
      );
      const querySnapshot = await getDocs(q);
      let subcategories = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (!includeHidden) {
        subcategories = subcategories.filter((sub) => sub.isActive !== false);
      }

      return subcategories;
    } catch (error) {
      // Fallback: fetch all and sort in memory if composite index is missing
      console.warn("Composite index missing, using in-memory sort");
      const q = query(subcategoriesRef, where("categoryId", "==", categoryId));
      const querySnapshot = await getDocs(q);
      let subcategories = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (!includeHidden) {
        subcategories = subcategories.filter((sub) => sub.isActive !== false);
      }

      // Sort by order in memory
      subcategories.sort((a, b) => (a.order || 0) - (b.order || 0));

      return subcategories;
    }
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    throw error;
  }
};

/**
 * Add a new subcategory
 * @param {string} categoryId - The ID of the parent category
 * @param {Object} subcategoryData - Data for the new subcategory (name, description, order)
 * @returns {Promise<Object>} The newly created subcategory with its ID
 */
export const addSubcategory = async (categoryId, subcategoryData) => {
  try {
    const clientId = getClientId();
    const subcategoriesRef = collection(
      db,
      "clients",
      clientId,
      "subcategories"
    );
    const newSubcategoryRef = doc(subcategoriesRef);

    const subcategoryWithMetadata = {
      ...subcategoryData,
      categoryId,
      isActive: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    await setDoc(newSubcategoryRef, subcategoryWithMetadata);

    return {
      id: newSubcategoryRef.id,
      ...subcategoryWithMetadata,
    };
  } catch (error) {
    console.error("Error adding subcategory:", error);
    throw error;
  }
};

/**
 * Update an existing subcategory
 * @param {string} subcategoryId - The ID of the subcategory to update
 * @param {Object} updates - Fields to update (name, description, order, isActive)
 * @returns {Promise<void>}
 */
export const updateSubcategory = async (subcategoryId, updates) => {
  try {
    const clientId = getClientId();
    const subcategoryRef = doc(
      db,
      "clients",
      clientId,
      "subcategories",
      subcategoryId
    );

    await updateDoc(subcategoryRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating subcategory:", error);
    throw error;
  }
};

/**
 * Delete a subcategory
 * @param {string} subcategoryId - The ID of the subcategory to delete
 * @returns {Promise<void>}
 */
export const deleteSubcategory = async (subcategoryId) => {
  try {
    const clientId = getClientId();
    const subcategoryRef = doc(
      db,
      "clients",
      clientId,
      "subcategories",
      subcategoryId
    );
    await deleteDoc(subcategoryRef);
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    throw error;
  }
};

/**
 * Toggle visibility of a subcategory
 * @param {string} subcategoryId - The ID of the subcategory
 * @param {boolean} isActive - The new active status
 * @returns {Promise<void>}
 */
export const toggleSubcategoryVisibility = async (subcategoryId, isActive) => {
  try {
    const clientId = getClientId();
    const subcategoryRef = doc(
      db,
      "clients",
      clientId,
      "subcategories",
      subcategoryId
    );
    await updateDoc(subcategoryRef, {
      isActive: isActive,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error toggling subcategory visibility:", error);
    throw error;
  }
};
