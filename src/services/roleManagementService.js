/**
 * Role Management Service
 * Handles role assignment and user deletion via Firebase Cloud Functions
 */

import { httpsCallable } from "firebase/functions";
import { getAuth } from "firebase/auth";
import { functions } from "../firebase";

// Callable Cloud Functions
const setUserRoleCallable = httpsCallable(functions, "setUserRole");
const deleteUserCallable = httpsCallable(functions, "deleteUser");
const getUserRoleInfoCallable = httpsCallable(functions, "getUserRoleInfo");

/**
 * Sets a user's custom claim role.
 * @param {string} uid The user's UID.
 * @param {'guest' | 'host' | 'superadmin'} role The role to assign.
 * @param {string | null} subdomain The subdomain if the role is 'host'.
 * @returns {Promise<Object>} The result from the Cloud Function.
 */
export const setUserRole = async (uid, role, subdomain = null) => {
  try {
    // Check if user is authenticated
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error("You must be logged in to set user roles.");
    }

    if (role === "host" && !subdomain) {
      throw new Error("Subdomain is required for 'host' role.");
    }

    // Force token refresh to ensure we have a valid token
    await currentUser.getIdToken(true);

    const result = await setUserRoleCallable({ uid, role, subdomain });
    return result.data;
  } catch (error) {
    // Handle specific error codes
    if (
      error.code === "functions/unavailable" ||
      error.code === "functions/not-found"
    ) {
      throw new Error(
        "Cloud Functions are not deployed. Please deploy them to manage user roles."
      );
    }

    if (error.code === "functions/unauthenticated") {
      throw new Error(
        "You must be logged in to set user roles. Please refresh the page and try again."
      );
    }

    if (error.code === "functions/permission-denied") {
      throw new Error(
        "You don't have permission to set user roles. Only super admins can set roles."
      );
    }

    // Extract error message from the error object
    const errorMessage =
      error.message || error.details || "Failed to set user role.";
    throw new Error(errorMessage);
  }
};

/**
 * Deletes a user from Firebase Auth and Firestore.
 * @param {string} uid The user's UID.
 * @returns {Promise<Object>} The result from the Cloud Function.
 */
export const deleteUser = async (uid) => {
  try {
    // Check if user is authenticated
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error("You must be logged in to delete users.");
    }

    // Force token refresh to ensure we have a valid token
    await currentUser.getIdToken(true);

    const result = await deleteUserCallable({ uid });
    return result.data;
  } catch (error) {
    // Handle specific error codes
    if (
      error.code === "functions/unavailable" ||
      error.code === "functions/not-found"
    ) {
      throw new Error(
        "Cloud Functions are not deployed. Please deploy them to delete users."
      );
    }

    if (error.code === "functions/unauthenticated") {
      throw new Error(
        "You must be logged in to delete users. Please refresh the page and try again."
      );
    }

    if (error.code === "functions/permission-denied") {
      throw new Error(
        "You don't have permission to delete users. Only super admins can delete users."
      );
    }

    // Extract error message from the error object
    const errorMessage =
      error.message || error.details || "Failed to delete user.";
    throw new Error(errorMessage);
  }
};

/**
 * Fetches a user's role information from custom claims.
 * @param {string} uid The user's UID.
 * @returns {Promise<{role: 'guest' | 'host' | 'superadmin', subdomain: string | null}>}
 */
export const getUserRoleInfo = async (uid) => {
  try {
    const result = await getUserRoleInfoCallable({ uid });
    return result.data;
  } catch (error) {
    if (
      error.code === "functions/unavailable" ||
      error.code === "functions/not-found"
    ) {
      return { role: "guest", subdomain: null };
    }
    throw error;
  }
};

export default {
  setUserRole,
  deleteUser,
  getUserRoleInfo,
};
