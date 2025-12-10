const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

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
  console.log("context", context);
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
    throw new functions.https.HttpsError(
      "internal",
      "Failed to get user role info.",
      error.message
    );
  }
});

/**
 * Send Order Notification Email
 * Triggers when a new order is created in the orders collection
 */
exports.sendOrderNotificationEmail = functions.firestore
  .document("orders/{hostUserId}/orders/{orderId}")
  .onCreate(async (snap, context) => {
    const orderData = snap.data();
    const hostUserId = context.params.hostUserId;
    const orderId = context.params.orderId;

    try {
      // Get host's profile to get their email
      const hostUserDoc = await admin
        .firestore()
        .collection("users")
        .doc(hostUserId)
        .get();

      if (!hostUserDoc.exists) {
        console.error(`Host user ${hostUserId} not found`);
        return null;
      }

      const hostUserData = hostUserDoc.data();
      const hostEmail = hostUserData.profile?.email;

      if (!hostEmail) {
        console.error(`Host email not found for user ${hostUserId}`);
        return null;
      }

      // Configure email transporter
      // For production, use environment variables for email credentials
      // Using Gmail SMTP (requires App Password setup)
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: functions.config().email?.user || process.env.EMAIL_USER,
          pass:
            functions.config().email?.password || process.env.EMAIL_PASSWORD,
        },
      });

      // Format order items
      const itemsList = orderData.items
        .map(
          (item, index) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${
            index + 1
          }</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <strong>${item.name}</strong>
            ${
              item.description
                ? `<br><small style="color: #666;">${item.description}</small>`
                : ""
            }
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;
              text-align: center;">${item.quantity}</td>
        </tr>
      `
        )
        .join("");

      // Format order date
      const orderDate = orderData.createdAt
        ? new Date(orderData.createdAt.toDate()).toLocaleString()
        : new Date().toLocaleString();

      // Email HTML template
      // eslint-disable-next-line max-len
      const emailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
              }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #1a1a1a; color: white; padding: 20px;
                  text-align: center; }
              .content { background: #f9f9f9; padding: 20px; }
              .order-info { background: white; padding: 15px; margin: 15px 0;
                border-radius: 5px; }
              table { width: 100%; border-collapse: collapse; margin: 15px 0; }
              th { background: #f5f5f5; padding: 10px; text-align: left;
                border-bottom: 2px solid #ddd; }
              .footer { text-align: center; padding: 20px; color: #666;
                font-size: 12px; }
              /* eslint-enable max-len */
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🍽️ New Order Received!</h1>
              </div>
              <div class="content">
                <p>Hello ${hostUserData.profile?.name || "Host"},</p>
                <p>You have received a new order from <strong>${
                  orderData.customerName
                }</strong>.</p>
                
                <div class="order-info">
                  <h2>Order Details</h2>
                  <p><strong>Order ID:</strong> ${orderId}</p>
                  <p><strong>Order Date:</strong> ${orderDate}</p>
                  <p><strong>Restaurant:</strong> ${
                    orderData.restaurantName || orderData.subdomain
                  }</p>
                  <p><strong>Total Items:</strong> ${
                    orderData.totalItems || 0
                  }</p>
                </div>

                <div class="order-info">
                  <h2>Customer Information</h2>
                  <p><strong>Name:</strong> ${orderData.customerName}</p>
                  <p><strong>Email:</strong> ${
                    orderData.customerEmail || "Not provided"
                  }</p>
                </div>

                <div class="order-info">
                  <h2>Order Items</h2>
                  <table>
                    <thead>
                      <tr>
                        <th style="width: 50px;">#</th>
                        <th>Item</th>
                        <th style="width: 80px; text-align: center;">Qty</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsList}
                    </tbody>
                  </table>
                </div>

                <p style="margin-top: 20px;">
                  <strong>Order Status:</strong>
                  <span style="color: #ff9800;">${
                    orderData.status || "pending"
                  }</span>
                </p>
              </div>
              <div class="footer">
                <p>This is an automated email from GuestMenu.</p>
                <p>Please log in to your dashboard to manage this order.</p>
              </div>
            </div>
          </body>
        </html>
      `;

      // Email text version (fallback)
      const emailText = `
New Order Received!

Hello ${hostUserData.profile?.name || "Host"},

You have received a new order from ${orderData.customerName}.

Order Details:
- Order ID: ${orderId}
- Order Date: ${orderDate}
- Restaurant: ${orderData.restaurantName || orderData.subdomain}
- Total Items: ${orderData.totalItems || 0}

Customer Information:
- Name: ${orderData.customerName}
- Email: ${orderData.customerEmail || "Not provided"}

Order Items:
${orderData.items
  .map((item, index) => `${index + 1}. ${item.name} (Qty: ${item.quantity})`)
  .join("\n")}

Order Status: ${orderData.status || "pending"}

This is an automated email from GuestMenu.
Please log in to your dashboard to manage this order.
      `;

      // Send email
      const mailOptions = {
        from: `"GuestMenu" <${
          functions.config().email?.user || process.env.EMAIL_USER
        }>`,
        to: hostEmail,
        subject: `New Order from ${orderData.customerName} - ${
          orderData.restaurantName || orderData.subdomain
        }`,
        text: emailText,
        html: emailHtml,
      };

      await transporter.sendMail(mailOptions);
      console.log(
        `Order notification email sent to ${hostEmail} ` +
          `for order ${orderId}`
      );

      return null;
    } catch (error) {
      console.error("Error sending order notification email:", error);
      // Don't throw error to prevent retries - log it instead
      return null;
    }
  });
