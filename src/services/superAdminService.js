/**
 * Super Admin Service
 * Handles all super admin operations for accessing all businesses
 */

import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";

const db = getFirestore();

const SUPER_ADMIN_EMAIL = "guestmenu0@gmail.com";

/**
 * Check if user is super admin
 * @param {Object} user - Firebase user object
 * @returns {boolean} True if user is super admin
 */
export const isSuperAdmin = (user) => {
  return user?.email === SUPER_ADMIN_EMAIL;
};

/**
 * Get all businesses/subdomains with their owners
 * @returns {Promise<Array>} List of all businesses
 */
export const getAllBusinesses = async () => {
  try {
    const subdomainsRef = collection(db, "subdomains");
    const q = query(subdomainsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    const businesses = [];

    for (const doc of snapshot.docs) {
      const subdomainData = doc.data();
      const userId = subdomainData.userId;

      try {
        // Fetch owner profile from subcollection
        const profileRef = doc(db, "users", userId, "profile", "data");
        const profileSnap = await getDoc(profileRef);
        const profileData = profileSnap.exists() ? profileSnap.data() : null;

        businesses.push({
          subdomain: doc.id,
          userId,
          owner: profileData || { name: "Unknown", email: "N/A" },
          createdAt: subdomainData.createdAt,
        });
      } catch (error) {
        console.error(`Error fetching owner data for ${userId}:`, error);
        businesses.push({
          subdomain: doc.id,
          userId,
          owner: { name: "Unknown", email: "N/A" },
          createdAt: subdomainData.createdAt,
        });
      }
    }

    return businesses;
  } catch (error) {
    console.error("Error fetching all businesses:", error);
    throw error;
  }
};

/**
 * Get all users (businesses)
 * @returns {Promise<Array>} List of all users
 */
export const getAllUsers = async () => {
  try {
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);

    const users = [];

    for (const docSnap of snapshot.docs) {
      const userData = docSnap.data();

      // Fetch profile from subcollection
      try {
        const profileRef = doc(db, "users", docSnap.id, "profile", "data");
        const profileSnap = await getDoc(profileRef);
        const profileData = profileSnap.exists() ? profileSnap.data() : null;

        users.push({
          userId: docSnap.id,
          ...userData,
          profile: profileData,
        });
      } catch (error) {
        console.error(`Error fetching profile for user ${docSnap.id}:`, error);
        users.push({
          userId: docSnap.id,
          ...userData,
          profile: null,
        });
      }
    }

    return users;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};

/**
 * Get business statistics
 * @returns {Promise<Object>} Statistics about all businesses
 */
export const getBusinessStatistics = async () => {
  try {
    const businesses = await getAllBusinesses();
    const users = await getAllUsers();

    return {
      totalBusinesses: businesses.length,
      totalUsers: users.length,
      businesses,
      users,
    };
  } catch (error) {
    console.error("Error fetching business statistics:", error);
    throw error;
  }
};

export default {
  isSuperAdmin,
  getAllBusinesses,
  getAllUsers,
  getBusinessStatistics,
};
