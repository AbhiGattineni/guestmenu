const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

/**
 * Set User Role
 * Sets custom claims for a user based on their role
 *
 * Roles:
 * - "guest": Default role, no subdomain
 * - "host": Admin role for a specific subdomain
 * - "superadmin": Super admin role with full access
 *
 * @param {string} data.uid - User ID
 * @param {string} data.role - Role to assign (guest, host, superadmin)
 * @param {string|null} data.subdomain - Subdomain for host role
 *     (required if role is "host")
 */
exports.setUserRole = functions.https.onCall(async (data, context) => {
  // Verify the caller is authenticated and is a super admin
  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated to set roles.",
    );
  }

  // Check if the caller is a super admin
  const callerToken = await admin.auth().getUser(context.auth.uid);
  const callerClaims = callerToken.customClaims || {};
  const isSuperAdmin =
    callerToken.email === "guestmenu0@gmail.com" ||
    callerClaims.role === "superadmin";

  if (!isSuperAdmin) {
    throw new functions.https.HttpsError(
        "permission-denied",
        "Only super admins can set user roles.",
    );
  }

  const {uid, role, subdomain} = data;

  if (!uid) {
    throw new functions.https.HttpsError(
        "invalid-argument",
        "User ID is required.",
    );
  }

  if (!["guest", "host", "superadmin"].includes(role)) {
    throw new functions.https.HttpsError(
        "invalid-argument",
        "Invalid role. Must be 'guest', 'host', or 'superadmin'.",
    );
  }

  if (role === "host" && !subdomain) {
    throw new functions.https.HttpsError(
        "invalid-argument",
        "Subdomain is required for host role.",
    );
  }

  try {
    // Prepare custom claims
    const customClaims = {
      role,
      subdomain: role === "host" ? subdomain : null,
    };

    // Set custom claims
    await admin.auth().setCustomUserClaims(uid, customClaims);

    return {
      success: true,
      message: `User role set to ${role}${
        role === "host" ? ` for ${subdomain}` : ""
      }`,
      role,
      subdomain: role === "host" ? subdomain : null,
    };
  } catch (error) {
    console.error("Error setting user role:", error);
    throw new functions.https.HttpsError(
        "internal",
        "Failed to set user role.",
        error.message,
    );
  }
});

/**
 * Delete User
 * Deletes a user from Firebase Auth and cleans up Firestore data
 *
 * @param {string} data.uid - User ID to delete
 */
exports.deleteUser = functions.https.onCall(async (data, context) => {
  // Verify the caller is authenticated and is a super admin
  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated to delete users.",
    );
  }

  // Check if the caller is a super admin
  const callerToken = await admin.auth().getUser(context.auth.uid);
  const callerClaims = callerToken.customClaims || {};
  const isSuperAdmin =
    callerToken.email === "guestmenu0@gmail.com" ||
    callerClaims.role === "superadmin";

  if (!isSuperAdmin) {
    throw new functions.https.HttpsError(
        "permission-denied",
        "Only super admins can delete users.",
    );
  }

  const {uid} = data;

  if (!uid) {
    throw new functions.https.HttpsError(
        "invalid-argument",
        "User ID is required.",
    );
  }

  // Prevent deletion of super admin
  const userToDelete = await admin.auth().getUser(uid);
  if (userToDelete.email === "guestmenu0@gmail.com") {
    throw new functions.https.HttpsError(
        "permission-denied",
        "Cannot delete super admin user.",
    );
  }

  try {
    const db = admin.firestore();
    const batch = db.batch();

    // Delete user's Firestore documents
    // 1. Delete user profile
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();
    if (userDoc.exists) {
      batch.delete(userRef);

      // Delete subcollections
      const profileRef = db.collection("users").doc(uid).collection("profile");
      const profileSnapshot = await profileRef.get();
      profileSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      const settingsRef = db
          .collection("users")
          .doc(uid)
          .collection("settings");
      const settingsSnapshot = await settingsRef.get();
      settingsSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
    }

    // 2. Delete user's menu data
    const menuRef = db.collection("menus").doc(uid);
    const menuDoc = await menuRef.get();
    if (menuDoc.exists) {
      batch.delete(menuRef);

      // Delete menu subcollections
      const categoriesRef = db
          .collection("menus")
          .doc(uid)
          .collection("categories");
      const categoriesSnapshot = await categoriesRef.get();
      categoriesSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      const itemsRef = db.collection("menus").doc(uid).collection("items");
      const itemsSnapshot = await itemsRef.get();
      itemsSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
    }

    // 3. Delete user's submissions
    const submissionsRef = db.collection("submissions").doc(uid);
    const submissionsDoc = await submissionsRef.get();
    if (submissionsDoc.exists) {
      batch.delete(submissionsRef);

      const submissionsSubRef = db
          .collection("submissions")
          .doc(uid)
          .collection("data");
      const submissionsSnapshot = await submissionsSubRef.get();
      submissionsSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
    }

    // 4. Delete user's subdomain if exists
    const subdomainsSnapshot = await db
        .collection("subdomains")
        .where("userId", "==", uid)
        .get();
    subdomainsSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // 5. Delete public menu data if exists
    const publicMenusSnapshot = await db
        .collection("publicMenus")
        .where("userId", "==", uid)
        .get();
    publicMenusSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Commit all Firestore deletions
    await batch.commit();

    // Delete user from Firebase Auth (this must be last)
    await admin.auth().deleteUser(uid);

    return {
      success: true,
      message: "User deleted successfully.",
    };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new functions.https.HttpsError(
        "internal",
        "Failed to delete user.",
        error.message,
    );
  }
});

/**
 * Get User Role Info
 * Retrieves a user's role information from custom claims
 *
 * @param {string} data.uid - User ID
 */
exports.getUserRoleInfo = functions.https.onCall(async (data, context) => {
  // Verify the caller is authenticated and is a super admin
  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated to get role info.",
    );
  }

  // Check if the caller is a super admin
  const callerToken = await admin.auth().getUser(context.auth.uid);
  const callerClaims = callerToken.customClaims || {};
  const isSuperAdmin =
    callerToken.email === "guestmenu0@gmail.com" ||
    callerClaims.role === "superadmin";

  if (!isSuperAdmin) {
    throw new functions.https.HttpsError(
        "permission-denied",
        "Only super admins can get user role info.",
    );
  }

  const {uid} = data;

  if (!uid) {
    throw new functions.https.HttpsError(
        "invalid-argument",
        "User ID is required.",
    );
  }

  try {
    const userRecord = await admin.auth().getUser(uid);
    const customClaims = userRecord.customClaims || {};

    return {
      role: customClaims.role || "guest",
      subdomain: customClaims.subdomain || null,
    };
  } catch (error) {
    console.error("Error getting user role info:", error);
    throw new functions.https.HttpsError(
        "internal",
        "Failed to get user role info.",
        error.message,
    );
  }
});
