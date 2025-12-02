# Cloud Functions Setup for Role Management

This document provides the complete Cloud Functions code required for user role management and deletion in the Guest Menu application.

## Required Cloud Functions

1. **setUserRole** - Sets custom claims for user roles
2. **deleteUser** - Deletes a user from Firebase Auth and Firestore
3. **getUserRoleInfo** - Retrieves user role information from custom claims

## Setup Instructions

### 1. Initialize Firebase Functions

If you haven't already, initialize Firebase Functions in your project:

```bash
firebase init functions
```

Choose:
- TypeScript or JavaScript (JavaScript example provided below)
- Install dependencies with npm

### 2. Install Required Dependencies

```bash
cd functions
npm install firebase-admin
```

### 3. Deploy the Functions

```bash
firebase deploy --only functions
```

## Cloud Functions Code

Create or update `functions/index.js` with the following code:

```javascript
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
 * @param {string|null} data.subdomain - Subdomain for host role (required if role is "host")
 */
exports.setUserRole = functions.https.onCall(async (data, context) => {
  // Verify the caller is authenticated and is a super admin
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated to set roles."
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
      "Only super admins can set user roles."
    );
  }

  const { uid, role, subdomain } = data;

  if (!uid) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "User ID is required."
    );
  }

  if (!["guest", "host", "superadmin"].includes(role)) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Invalid role. Must be 'guest', 'host', or 'superadmin'."
    );
  }

  if (role === "host" && !subdomain) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Subdomain is required for host role."
    );
  }

  try {
    // Prepare custom claims
    const customClaims = {
      role: role,
      subdomain: role === "host" ? subdomain : null,
    };

    // Set custom claims
    await admin.auth().setCustomUserClaims(uid, customClaims);

    return {
      success: true,
      message: `User role set to ${role}${role === "host" ? ` for ${subdomain}` : ""}`,
      role: role,
      subdomain: role === "host" ? subdomain : null,
    };
  } catch (error) {
    console.error("Error setting user role:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to set user role.",
      error.message
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
      "User must be authenticated to delete users."
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
      "Only super admins can delete users."
    );
  }

  const { uid } = data;

  if (!uid) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "User ID is required."
    );
  }

  // Prevent deletion of super admin
  const userToDelete = await admin.auth().getUser(uid);
  if (userToDelete.email === "guestmenu0@gmail.com") {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Cannot delete super admin user."
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

      const settingsRef = db.collection("users").doc(uid).collection("settings");
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
      const categoriesRef = db.collection("menus").doc(uid).collection("categories");
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

      const submissionsSubRef = db.collection("submissions").doc(uid).collection("data");
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
      error.message
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
      "User must be authenticated to get role info."
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
      "Only super admins can get user role info."
    );
  }

  const { uid } = data;

  if (!uid) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "User ID is required."
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
      error.message
    );
  }
});
```

## Testing the Functions

After deployment, you can test the functions using the Firebase Console or by calling them from your application.

### Test from Firebase Console

1. Go to Firebase Console → Functions
2. Click on a function name
3. Use the "Test" tab to send test requests

### Test from Application

The functions are automatically called from the Super Admin Dashboard when:
- Editing a user's role
- Deleting a user
- Viewing user roles in the Users tab

## Important Notes

1. **Custom Claims**: Custom claims are included in the user's ID token. Users need to sign out and sign back in (or refresh their token) to see updated claims.

2. **Super Admin Protection**: The super admin user (`guestmenu0@gmail.com`) cannot be deleted.

3. **Subdomain Requirement**: When setting a user's role to "host", a subdomain must be provided.

4. **Data Cleanup**: The `deleteUser` function attempts to clean up all user-related data from Firestore, but you may need to adjust the deletion logic based on your exact data structure.

5. **Permissions**: All functions require the caller to be authenticated and have super admin privileges.

## Troubleshooting

### Functions Not Found Error

If you see "Cloud Functions are not deployed" errors:
1. Ensure functions are deployed: `firebase deploy --only functions`
2. Check that the function names match exactly: `setUserRole`, `deleteUser`, `getUserRoleInfo`
3. Verify your Firebase project ID matches in both the client and functions

### Permission Denied Errors

- Ensure the logged-in user is a super admin
- Check that custom claims are set correctly for the super admin user
- Verify the super admin email matches `guestmenu0@gmail.com`

### Role Not Updating

- Users must sign out and sign back in to refresh their ID token
- Custom claims are cached in the ID token until it's refreshed
- Force token refresh: `await user.getIdToken(true)`

