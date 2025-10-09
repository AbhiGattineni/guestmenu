# 🔥 Firebase Setup Guide

## Overview

This application now uses **Firebase Firestore** as the database instead of mock data. This guide will help you set up Firebase for your restaurant menu system.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Firebase Project Setup](#firebase-project-setup)
3. [Firestore Database Structure](#firestore-database-structure)
4. [Initialize Data](#initialize-data)
5. [Security Rules](#security-rules)
6. [Authentication Setup](#authentication-setup)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Firebase account (free tier is sufficient)
- Node.js and npm installed
- This project already configured with Firebase SDK

---

## Firebase Project Setup

### 1. Firebase Configuration

Your Firebase configuration is already set up in `src/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAN5TgXDgaSeW1u3XlN16G097P0ly4Db6Y",
  authDomain: "menuscanner-6f332.firebaseapp.com",
  projectId: "menuscanner-6f332",
  storageBucket: "menuscanner-6f332.firebasestorage.app",
  messagingSenderId: "900061990435",
  appId: "1:900061990435:web:507b2f140ffa1f2491ab96",
  measurementId: "G-M04V0HHX3V"
};
```

### 2. Enable Firestore Database

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **menuscanner-6f332**
3. Click on **"Firestore Database"** in the left sidebar
4. Click **"Create Database"**
5. Choose **"Start in production mode"** (we'll add rules later)
6. Select a location closest to your users
7. Click **"Enable"**

---

## Firestore Database Structure

The application uses the following structure:

```
clients (collection)
  └─ {clientId} (document)
      ├─ settings (subcollection)
      │   └─ restaurantInfo (document)
      │       ├─ name: string
      │       ├─ logo: string (URL)
      │       ├─ description: string
      │       ├─ createdAt: timestamp
      │       └─ updatedAt: timestamp
      │
      ├─ banners (subcollection)
      │   └─ {bannerId} (document)
      │       ├─ title: string
      │       ├─ description: string
      │       ├─ image: string (URL)
      │       ├─ createdAt: timestamp
      │       └─ updatedAt: timestamp
      │
      ├─ categories (subcollection)
      │   └─ {categoryId} (document)
      │       ├─ name: string
      │       ├─ description: string
      │       ├─ icon: string (emoji)
      │       ├─ order: number
      │       ├─ isActive: boolean
      │       ├─ itemCount: number
      │       ├─ createdAt: timestamp
      │       └─ updatedAt: timestamp
      │
      ├─ menuItems (subcollection)
      │   └─ {itemId} (document)
      │       ├─ categoryId: string (reference)
      │       ├─ name: string
      │       ├─ description: string
      │       ├─ price: number
      │       ├─ image: string (URL)
      │       ├─ isVegetarian: boolean
      │       ├─ isSpicy: boolean
      │       ├─ isActive: boolean
      │       ├─ createdAt: timestamp
      │       └─ updatedAt: timestamp
      │
      └─ users (subcollection)
          └─ {userId} (document)
              ├─ role: string (manager | superadmin)
              ├─ email: string
              └─ createdAt: timestamp
```

### Client ID

- **Development**: Uses `demo-restaurant` as the default client ID
- **Production**: Extracted from subdomain (e.g., `restaurant1.menuscanner.com` → clientId: `restaurant1`)

---

## Initialize Data

### Option 1: Using the Initialization Script (Recommended)

1. **Temporarily import the initialization function** in your `src/App.js`:

```javascript
// Add at the top of App.js
import { initializeFirestoreData } from "./services/initializeFirestoreData";

// Add inside App component (temporarily)
useEffect(() => {
  // Run once to populate data
  initializeFirestoreData().then(() => {
    console.log("Data initialized!");
  });
}, []);
```

2. **Start the app**:
```bash
npm start
```

3. **Check the console** - you should see:
```
🚀 Starting Firestore initialization...
📍 Client ID: demo-restaurant
✅ Restaurant info initialized
✅ 3 banners initialized
✅ 6 categories initialized
✅ 20 menu items initialized
✅ Firestore initialization complete!
🎉 Your restaurant data is ready!
```

4. **Remove the initialization code** from `App.js` after data is loaded

5. **Verify in Firebase Console**:
   - Go to Firestore Database
   - You should see the `clients` collection
   - Expand `demo-restaurant` to see all subcollections

### Option 2: Manual Data Entry

You can manually add data through the Firebase Console:

1. Go to Firestore Database
2. Click **"Start collection"**
3. Collection ID: `clients`
4. Add documents following the structure above

---

## Security Rules

### 1. Update Firestore Rules

1. Go to **Firestore Database** → **Rules** tab
2. Copy the contents of `firestore.rules` file
3. Paste into the rules editor
4. Click **"Publish"**

### 2. Rules Overview

- **Public Read**: All menu data is readable by anyone (for customer viewing)
- **Manager Write**: Only authenticated managers can modify their restaurant's data
- **Super Admin**: Full access to all restaurants and users

### 3. Test Rules

After publishing rules, test the application:
- ✅ Customers can view menu without login
- ✅ Managers can edit after login
- ❌ Unauthenticated users cannot modify data

---

## Authentication Setup

### 1. Enable Email/Password Authentication

1. Go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**
3. Click **Save**

### 2. Create Manager User

#### Via Firebase Console:

1. Go to **Authentication** → **Users**
2. Click **"Add user"**
3. Enter email and password:
   ```
   Email: manager@restaurant.com
   Password: admin123
   ```
4. Copy the **User UID** (you'll need this)

#### Add Manager Role to Firestore:

1. Go to **Firestore Database**
2. Navigate to: `clients/demo-restaurant/users`
3. Click **"Add document"**
4. Document ID: `[paste the User UID]`
5. Add fields:
   ```
   role: "manager"
   email: "manager@restaurant.com"
   createdAt: [current timestamp]
   ```
6. Click **Save**

### 3. Create Super Admin (Optional)

1. Create user in Authentication (same as above)
2. Add document to `superadmins` collection:
   ```
   Document ID: [User UID]
   Fields:
     role: "superadmin"
     email: "superadmin@menuscanner.com"
     createdAt: [current timestamp]
   ```

---

## Troubleshooting

### Issue: "Missing or insufficient permissions"

**Solution**: Check Firestore rules are properly deployed. Make sure you published the rules from `firestore.rules`.

### Issue: "No data showing in app"

**Solutions**:
1. Verify data exists in Firebase Console
2. Check browser console for errors
3. Verify client ID matches (should be `demo-restaurant` for local development)

### Issue: "Cannot login"

**Solutions**:
1. Verify Email/Password authentication is enabled
2. Check if user exists in Authentication
3. Verify user role exists in Firestore: `clients/{clientId}/users/{userId}`

### Issue: "Manager can't edit menu"

**Solutions**:
1. Verify user has correct role in Firestore
2. Check Firestore rules are published
3. Verify user UID matches between Authentication and Firestore

---

## Development vs Production

### Development (localhost)
- Client ID: `demo-restaurant`
- All data stored under `clients/demo-restaurant/`

### Production
- Client ID: Extracted from subdomain
- Example: `restaurant1.menuscanner.com` → `clients/restaurant1/`
- Each restaurant has isolated data

---

## Next Steps

1. ✅ Enable Firestore Database
2. ✅ Initialize data using the script
3. ✅ Publish security rules
4. ✅ Create manager users
5. ✅ Test the application
6. 🚀 Deploy to production!

---

## Support

For issues or questions:
1. Check Firebase Console for errors
2. Review browser console logs
3. Verify Firestore rules and data structure

---

## Summary

✅ **Firestore** is now your database (no more mock data!)
✅ **Real-time updates** - changes sync across all clients
✅ **Multi-tenant** - support multiple restaurants
✅ **Secure** - role-based access control
✅ **Scalable** - Firebase handles growth automatically

**Enjoy your production-ready menu system!** 🎉

