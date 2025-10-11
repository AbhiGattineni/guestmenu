# 📱 MenuScanner - Complete Documentation

> A modern, multi-tenant restaurant menu system with QR code access, manager dashboards, and super admin control panel.

**Version:** 2.0 (Firebase-Powered)  
**Last Updated:** October 11, 2025

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Tech Stack](#tech-stack)
4. [Features](#features)
5. [Architecture](#architecture)
6. [Installation & Setup](#installation--setup)
7. [Firebase Configuration](#firebase-configuration)
8. [User Roles & Authentication](#user-roles--authentication)
9. [Multi-Tenant System](#multi-tenant-system)
10. [Manager Dashboard](#manager-dashboard)
11. [Super Admin Dashboard](#super-admin-dashboard)
12. [Image Upload & Storage](#image-upload--storage)
13. [Database Structure](#database-structure)
14. [Security Rules](#security-rules)
15. [Troubleshooting](#troubleshooting)
16. [Deployment](#deployment)
17. [API Reference](#api-reference)

---

## 🎯 Overview

MenuScanner is a comprehensive restaurant menu management system that supports:

- ✅ **Multi-tenant architecture** - Host multiple restaurants on one platform
- ✅ **QR code-based menus** - Customers scan and view menus
- ✅ **Manager dashboards** - Restaurant managers control their menu
- ✅ **Super admin panel** - Platform administrators manage all stores
- ✅ **Firebase backend** - Real-time database, authentication, and storage
- ✅ **Image uploads** - Direct upload to Firebase Storage
- ✅ **Responsive design** - Works on mobile, tablet, and desktop
- ✅ **Role-based access control** - Secure access for different user types

---

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd menuscanner

# Install dependencies
npm install

# Start development server
npm start
```

### Initial Access

**Customer Menu (no login required):**
- Main page: `http://localhost:3000/`
- Store page: `http://1.localhost:3000/` (replace `1` with store ID)

**Manager Dashboard:**
- URL: `http://1.localhost:3000/manager-dashboard`
- Email: `manager@restaurant.com`
- Password: `admin123`

**Super Admin Dashboard:**
- URL: `http://localhost:3000/superadmin-dashboard`
- Email: `abhishekgattineni@gmail.com`
- Password: `admin@123`

---

## 🛠️ Tech Stack

### Frontend
- **React** 18+ - UI framework
- **Material-UI (MUI)** 5+ - Component library
- **React Router DOM** 6+ - Client-side routing
- **Context API** - State management

### Backend
- **Firebase Authentication** - User authentication
- **Firebase Firestore** - NoSQL database
- **Firebase Storage** - Image and file storage
- **Firebase Hosting** - Deployment (optional)

### Development
- **Create React App** - Build tooling
- **ESLint** - Code linting
- **Git** - Version control

---

## ✨ Features

### Customer Features
- 📱 **Responsive QR code menus** - Scan and view on any device
- 🎨 **Promotional banners** - Sliding carousel for offers
- 🍽️ **Category browsing** - Organized menu categories
- 🔍 **Item details** - Images, descriptions, prices, dietary info
- 🌐 **Multi-language ready** - Prepared for i18n

### Manager Features
- 🔐 **Secure authentication** - Firebase-powered login
- 📊 **Dashboard interface** - Full menu management
- ➕ **Add/Edit/Delete** - Categories, items, and banners
- 🖼️ **Image uploads** - Direct to Firebase Storage
- 👁️ **Visibility control** - Show/hide items and categories
- 🎯 **Store-specific access** - Managers only see their store

### Super Admin Features
- 📈 **Analytics dashboard** - All stores overview
- 👥 **User management** - Create/edit/delete users
- 🏪 **Store management** - Add/edit/delete stores
- 🔗 **Store assignment** - Assign managers to stores
- 🍔 **Cross-store menu management** - Edit any store's menu
- 🎨 **Banner management** - Manage banners for all stores
- 🔒 **Full access control** - Platform-wide administration

---

## 🏗️ Architecture

### Multi-Tenant Structure

```
Domain Structure:
├── localhost:3000/                    → HomePage (about the app)
├── localhost:3000/login               → Login page
├── localhost:3000/superadmin-dashboard → Super Admin
├── 1.localhost:3000/                  → Store 1 customer menu
├── 1.localhost:3000/manager-dashboard → Store 1 manager dashboard
├── 2.localhost:3000/                  → Store 2 customer menu
└── 2.localhost:3000/manager-dashboard → Store 2 manager dashboard
```

### Component Hierarchy

```
App.js
├── SmartHome (/)
│   ├── HomePage (no subdomain)
│   └── CustomerMenu (subdomain detected)
├── LoginPage (/login)
├── ManagerDashboard (/manager-dashboard) [Protected]
├── SuperAdminDashboard (/superadmin-dashboard) [Protected]
└── UnauthorizedPage (/unauthorized)
```

### Data Flow

```
Client Request
    ↓
React Router
    ↓
withRoleProtection (HOC)
    ↓
AuthContext (verify auth & role)
    ↓
Page Component
    ↓
firebaseService.js / superAdminService.js
    ↓
Firebase Firestore / Storage
```

---

## 📦 Installation & Setup

### Prerequisites

- Node.js 16+ and npm
- Firebase account (free tier works)
- Git

### Step 1: Clone and Install

```bash
git clone <repository-url>
cd menuscanner
npm install
```

### Step 2: Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select: **menuscanner-6f332**
3. Your config is already in `src/firebase.js`

### Step 3: Enable Firebase Services

#### 3.1 Enable Firestore Database

1. Click **Firestore Database** → **Create Database**
2. Start in **production mode**
3. Choose location: **us-central1** (or nearest)
4. Click **Enable**

#### 3.2 Enable Authentication

1. Click **Authentication** → **Get Started**
2. Click **Sign-in method** tab
3. Enable **Email/Password**
4. Click **Save**

#### 3.3 Enable Storage

1. Click **Storage** → **Get Started**
2. Start in **production mode** (we'll add rules)
3. Choose location: **us-central1**
4. Click **Done**

### Step 4: Configure Security Rules

#### Firestore Rules

Go to **Firestore Database** → **Rules**, paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection (all roles)
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Clients collection (stores)
    match /clients/{clientId} {
      allow read: if true; // Public read for customer menus
      allow write: if request.auth != null && 
                   (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'superadmin');
      
      // Subcollections
      match /{subcollection}/{document=**} {
        allow read: if true; // Public read
        allow write: if request.auth != null && 
                     (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'superadmin' ||
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'manager');
      }
    }
  }
}
```

Click **Publish**.

#### Storage Rules

Go to **Storage** → **Rules**, paste:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{clientId}/{folder}/{fileName} {
      // Allow authenticated users to upload/delete
      allow write: if request.auth != null 
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
      
      // Allow anyone to read (for public menus)
      allow read: if true;
    }
  }
}
```

Click **Publish**.

### Step 5: Configure CORS for Storage

1. Go to [Google Cloud Storage Console](https://console.cloud.google.com/storage/browser?project=menuscanner-6f332)
2. Click on bucket: `menuscanner-6f332.firebasestorage.app`
3. Click **"Configuration"** tab
4. Scroll to **"CORS configuration"**
5. Click **"Edit CORS configuration"**
6. Paste:

```json
[
  {
    "origin": ["*"],
    "method": ["GET", "HEAD", "PUT", "POST", "DELETE"],
    "maxAgeSeconds": 3600,
    "responseHeader": ["Content-Type", "Authorization", "Content-Length", "User-Agent", "x-goog-resumable"]
  }
]
```

7. Click **Save**

### Step 6: Initialize Sample Data

#### Option A: Automatic (Recommended)

Temporarily add to `src/App.js`:

```javascript
import { initializeFirestoreData } from "./services/initializeFirestoreData";

// Inside App component:
useEffect(() => {
  initializeFirestoreData().then(() => {
    console.log("✅ Data initialized!");
  });
}, []);
```

Start the app, wait for console success message, then remove the code.

#### Option B: Manual

Use Firebase Console to manually create collections following the database structure below.

### Step 7: Create Admin Users

#### Create Super Admin

1. **Authentication:**
   - Go to **Authentication** → **Users**
   - Click **Add user**
   - Email: `abhishekgattineni@gmail.com`
   - Password: `admin@123`
   - Copy the **User UID**

2. **Firestore:**
   - Go to **Firestore Database**
   - Create collection: `users`
   - Document ID: `[paste User UID]`
   - Fields:
     ```
     name: "Abhishek Gattineni"
     role: "superadmin"
     email: "abhishekgattineni@gmail.com"
     createdAt: [current timestamp]
     ```

#### Create Manager

1. **Authentication:**
   - Email: `manager@restaurant.com`
   - Password: `admin123`
   - Copy the **User UID**

2. **Firestore:**
   - Collection: `users`
   - Document ID: `[paste User UID]`
   - Fields:
     ```
     name: "Test Manager"
     role: "manager"
     email: "manager@restaurant.com"
     storeId: "1"
     createdAt: [current timestamp]
     ```

### Step 8: Run the Application

```bash
npm start
```

Open: `http://localhost:3000/`

---

## 🔥 Firebase Configuration

Your Firebase config is in `src/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAN5TgXDgaSeW1u3XlN16G097P0ly4Db6Y",
  authDomain: "menuscanner-6f332.firebaseapp.com",
  projectId: "menuscanner-6f332",
  storageBucket: "menuscanner-6f332.firebasestorage.app",
  messagingSenderId: "900061990435",
  appId: "1:900061990435:web:507b2f140ffa1f2491ab96",
  measurementId: "G-M04V0HHX3V",
};
```

**Services Initialized:**
- `auth` - Firebase Authentication
- `db` - Firestore Database
- `storage` - Firebase Storage
- `analytics` - Google Analytics

---

## 🔐 User Roles & Authentication

### Role Types

| Role | Access Level | Capabilities |
|------|--------------|--------------|
| **Customer** | Public | View menus, no login required |
| **Manager** | Store-specific | Manage own store's menu, banners, items |
| **Super Admin** | Platform-wide | Manage all stores, users, full analytics |

### Authentication Flow

```
1. User visits login page
2. Enters email & password
3. Firebase Authentication validates
4. AuthContext fetches user role from Firestore
5. withRoleProtection HOC checks role
6. User redirected to appropriate dashboard
```

### Login Credentials

**Super Admin:**
```
Email: abhishekgattineni@gmail.com
Password: admin@123
Access: All stores, all features
```

**Manager (Store 1):**
```
Email: manager@restaurant.com
Password: admin123
Access: Store 1 only
```

### Session Management

- Firebase handles session tokens automatically
- Sessions persist across browser refreshes
- Logout clears authentication state
- Protected routes redirect unauthorized users

---

## 🌐 Multi-Tenant System

### Client ID Detection

The system automatically detects the store based on the URL subdomain:

```javascript
// src/services/firebaseService.js
export const getClientId = () => {
  const hostname = window.location.hostname;
  
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "demo-restaurant"; // Development default
  }
  
  // Extract subdomain (e.g., "1.localhost" → "1")
  const parts = hostname.split(".");
  if (parts.length >= 2) {
    return parts[0]; // First part is the store ID
  }
  
  return "demo-restaurant";
};
```

### URL Structure

| URL | Client ID | Purpose |
|-----|-----------|---------|
| `localhost:3000/` | N/A | HomePage (about app) |
| `1.localhost:3000/` | `1` | Store 1 customer menu |
| `2.localhost:3000/` | `2` | Store 2 customer menu |
| `store-abc.localhost:3000/` | `store-abc` | Custom store menu |

### Data Isolation

Each store's data is completely isolated:

```
Firestore:
clients/
  └── 1/  (Store 1)
      ├── banners/
      ├── categories/
      ├── menuItems/
      └── settings/
  └── 2/  (Store 2)
      ├── banners/
      ├── categories/
      ├── menuItems/
      └── settings/

Storage:
1/  (Store 1)
  ├── banners/
  └── menuItems/
2/  (Store 2)
  ├── banners/
  └── menuItems/
```

---

## 🏪 Manager Dashboard

**Access:** `http://[storeId].localhost:3000/manager-dashboard`

### Features

#### 1. Menu Management

**View Modes:**
- Toggle between **Menu** and **Banners** views
- Category tabs for organized navigation

**Categories:**
- ➕ Add new categories
- ✏️ Edit category name, icon, order
- 🗑️ Delete categories (with confirmation)
- 👁️ Show/hide categories

**Menu Items:**
- ➕ Add new items
- ✏️ Edit item details (name, description, price, image)
- 🗑️ Delete items (with confirmation)
- 🖼️ Upload images directly
- 🏷️ Mark as vegetarian/spicy
- 👁️ Toggle visibility

#### 2. Banner Management

**Features:**
- ➕ Add promotional banners
- ✏️ Edit banner title, description, image
- 🗑️ Delete banners
- 🖼️ Upload banner images (direct to Firebase Storage)
- 📱 Preview banners before saving
- ♻️ Auto-cleanup: Old images deleted when updated

**Image Upload:**
- Two modes: **Upload file** or **Paste URL**
- Supported formats: JPG, PNG, GIF, WEBP
- Max size: 5MB
- Automatic compression (optional)
- Live preview

#### 3. Store Information

- Restaurant name display
- Logo display (or initial if no logo)
- Manager email shown in header
- Responsive mobile layout

### UI Components

```
ManagerDashboard
├── AppBar
│   ├── Store Logo
│   ├── Store Name
│   ├── View Toggle (Menu/Banners)
│   ├── User Email
│   └── Logout Button
├── Menu View
│   ├── Category Tabs
│   ├── Add Category Button
│   ├── Items Grid
│   └── Item Cards
│       ├── Image
│       ├── Details
│       └── Edit/Delete Buttons
└── Banner View
    ├── Add Banner Button
    ├── Banner Grid
    └── Banner Cards
        ├── Image
        ├── Details
        └── Edit/Delete Buttons
```

---

## 👑 Super Admin Dashboard

**Access:** `http://localhost:3000/superadmin-dashboard`

### Features

#### 1. Analytics Tab

**Overview Cards:**
- 📊 Total stores
- 👥 Total users
- 🍔 Total menu items
- 🎨 Total banners

**Store Overview:**
- List of all stores
- Store name and ID
- Manager count
- Menu item count
- Banner count
- Status indicators

**Design:**
- Professional corporate styling
- Gradient backgrounds
- 3D icon boxes
- Hover animations
- Progress bars

#### 2. Users Tab

**User Management:**
- ➕ Create new users
- ✏️ Edit user details
- 🗑️ Delete users
- 🔗 Assign stores to managers
- 👁️ View all users in table format

**User Fields:**
- Name
- Email
- Role (superadmin/manager)
- Store assignment (for managers)
- Creation date

#### 3. Stores Tab

**Store Management:**
- ➕ Create new stores
- ✏️ Edit store information
- 🗑️ Delete stores
- 📊 View store statistics

**Store Fields:**
- Store ID
- Store name
- Description
- Logo URL
- Location
- Status (active/inactive)

#### 4. Menu Tab

**Cross-Store Menu Management:**
- 🏪 Select any store from dropdown
- 📂 Manage categories
- 🍔 Manage menu items
- Same features as Manager Dashboard
- Access to all stores

**Sub-tabs:**
- **Categories:** Add/edit/delete categories
- **Items:** Add/edit/delete menu items

**Icon Suggestions:**
- Predefined emoji list
- Same as Manager portal
- Easy selection dropdown

#### 5. Banners Tab

**Cross-Store Banner Management:**
- 🏪 Select any store from dropdown
- ➕ Add banners for any store
- ✏️ Edit existing banners
- 🗑️ Delete banners
- 🖼️ Upload images
- Same interface as Manager Dashboard

### Navigation

```
SuperAdminDashboard
├── AppBar (Logo, Title, User, Logout)
├── Tab Navigation
│   ├── Analytics
│   ├── Users
│   ├── Stores
│   ├── Menu
│   └── Banners
└── Tab Content Panels
```

---

## 🖼️ Image Upload & Storage

### How It Works

1. **User selects image** in Manager/Super Admin dashboard
2. **Frontend validates** file type and size
3. **Image uploaded** to Firebase Storage
4. **Download URL** returned and saved to Firestore
5. **Image displayed** on customer-facing pages

### Upload Service

**Location:** `src/services/imageUploadService.js`

**Functions:**

```javascript
// Upload image to Firebase Storage
uploadImage(file, folder, clientId)
  → Returns: downloadURL

// Delete image from Firebase Storage  
deleteImage(imageUrl)
  → Returns: void

// Compress image before upload (optional)
compressImage(file, maxWidth, maxHeight, quality)
  → Returns: Blob
```

### ImageUploadField Component

**Location:** `src/components/ImageUploadField.jsx`

**Features:**
- Toggle between **Upload** and **URL** modes
- File validation (type, size)
- Upload progress indicator
- Live image preview
- Delete/clear functionality
- Error handling

**Usage:**

```javascript
import ImageUploadField from "../components/ImageUploadField";
import { uploadImage } from "../services/imageUploadService";

const MyComponent = () => {
  const [imageUrl, setImageUrl] = useState("");
  
  const handleImageUpload = async (file, folder) => {
    const clientId = "store-id";
    return await uploadImage(file, folder, clientId);
  };

  return (
    <ImageUploadField
      value={imageUrl}
      onChange={setImageUrl}
      onUpload={handleImageUpload}
      label="Banner Image"
      folder="banners"
      required
    />
  );
};
```

### Storage Structure

```
Firebase Storage:
menuscanner-6f332.firebasestorage.app/
├── 1/  (Store 1)
│   ├── banners/
│   │   ├── 1760159112440_banner1.jpg
│   │   └── 1760159223551_banner2.png
│   └── menuItems/
│       ├── 1760159334662_pizza.jpg
│       └── 1760159445773_burger.jpg
├── 2/  (Store 2)
│   ├── banners/
│   └── menuItems/
└── demo-restaurant/
    ├── banners/
    └── menuItems/
```

### Auto-Cleanup

**When?**
- Banner/item deleted → Image deleted from Storage
- Banner/item image updated → Old image deleted from Storage
- Prevents orphaned files and saves storage costs

**Implementation:**

```javascript
// In ManagerDashboard.jsx
const handleConfirmDeleteBanner = async () => {
  // Delete image from Storage
  await deleteImage(bannerToDelete.image);
  
  // Delete banner from Firestore
  await deleteBanner(bannerToDelete.id);
};
```

### Image Requirements

- **Formats:** JPG, PNG, GIF, WEBP
- **Max Size:** 5MB
- **Recommended Dimensions:**
  - Banners: 1200×400px
  - Menu Items: 800×600px
  - Logos: 200×200px

---

## 💾 Database Structure

### Firestore Collections

```
users/  (Top-level collection)
  └── {userId}
      ├── name: string
      ├── email: string
      ├── role: "superadmin" | "manager"
      ├── storeId: string (for managers)
      └── createdAt: timestamp

clients/  (Top-level collection)
  └── {clientId}
      ├── name: string
      ├── description: string
      ├── logo: string (URL)
      ├── location: string
      ├── createdAt: timestamp
      └── updatedAt: timestamp
      
      ├── banners/  (Subcollection)
      │   └── {bannerId}
      │       ├── title: string
      │       ├── description: string
      │       ├── image: string (URL)
      │       ├── order: number
      │       ├── createdAt: timestamp
      │       └── updatedAt: timestamp
      │
      ├── categories/  (Subcollection)
      │   └── {categoryId}
      │       ├── name: string
      │       ├── description: string
      │       ├── icon: string (emoji)
      │       ├── order: number
      │       ├── isActive: boolean
      │       ├── itemCount: number
      │       ├── createdAt: timestamp
      │       └── updatedAt: timestamp
      │
      └── menuItems/  (Subcollection)
          └── {itemId}
              ├── categoryId: string
              ├── name: string
              ├── description: string
              ├── price: number
              ├── image: string (URL)
              ├── isVegetarian: boolean
              ├── isSpicy: boolean
              ├── isActive: boolean
              ├── order: number
              ├── createdAt: timestamp
              └── updatedAt: timestamp
```

### Sample Data

**User Document:**
```json
{
  "name": "Test Manager",
  "email": "manager@restaurant.com",
  "role": "manager",
  "storeId": "1",
  "createdAt": "2025-10-11T00:00:00Z"
}
```

**Client Document:**
```json
{
  "name": "My Test Store",
  "description": "The best test restaurant",
  "logo": "https://...",
  "location": "New York, NY",
  "createdAt": "2025-10-11T00:00:00Z",
  "updatedAt": "2025-10-11T00:00:00Z"
}
```

**Menu Item Document:**
```json
{
  "categoryId": "appetizers",
  "name": "Bruschetta",
  "description": "Grilled bread with tomatoes",
  "price": 8.99,
  "image": "https://firebasestorage.googleapis.com/...",
  "isVegetarian": true,
  "isSpicy": false,
  "isActive": true,
  "order": 1,
  "createdAt": "2025-10-11T00:00:00Z",
  "updatedAt": "2025-10-11T00:00:00Z"
}
```

---

## 🔒 Security Rules

### Firestore Rules Philosophy

- **Public Read:** All menu data readable (for customers)
- **Authenticated Write:** Only logged-in users can modify data
- **Role-Based Write:** Super admins have full access, managers limited to their store

### Current Rules

See [Firebase Configuration](#firebase-configuration) section for complete rules.

**Key Points:**
- ✅ Anyone can read menu data
- ✅ Only authenticated users can write
- ✅ Super admins can access all stores
- ✅ Managers can only access their assigned store
- ❌ Unauthenticated users cannot modify data

### Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{clientId}/{folder}/{fileName} {
      // Only authenticated users can upload
      allow write: if request.auth != null 
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
      
      // Anyone can read (for customer menus)
      allow read: if true;
    }
  }
}
```

**Key Points:**
- ✅ Max file size: 5MB
- ✅ Only image files allowed
- ✅ Must be authenticated to upload
- ✅ Public read access for customer viewing

---

## 🐛 Troubleshooting

### Common Issues

#### 1. CORS Error on Image Upload

**Symptoms:**
```
CORS error
xhr imageUploadService.js:49
```

**Solution:**
1. Configure CORS in Google Cloud Storage (see [Step 5](#step-5-configure-cors-for-storage))
2. Wait 2-3 minutes for propagation
3. Clear browser cache: `Ctrl + Shift + R`
4. Try upload again

---

#### 2. Permission Denied (403)

**Symptoms:**
```json
{
  "error": {
    "code": 403,
    "message": "Permission denied."
  }
}
```

**Solutions:**

**A. Check Storage Rules:**
- Go to Firebase Console → Storage → Rules
- Ensure rules match the ones in [Firebase Configuration](#firebase-configuration)
- Click **Publish**

**B. Check Authentication:**
- Open browser console
- Check if user is logged in
- If not, logout and login again

**C. Test with permissive rules (temporarily):**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
Once working, revert to secure rules.

---

#### 3. User Redirected to Unauthorized Page

**Symptoms:**
- Login successful but redirected to `/unauthorized`

**Solutions:**

**A. Check User Role in Firestore:**
1. Go to Firebase Console → Firestore
2. Navigate to: `users/{userId}`
3. Verify `role` field exists and is set to `"manager"` or `"superadmin"`
4. Verify `storeId` is set for managers

**B. Check User UID matches:**
- Get UID from Authentication tab
- Ensure Firestore document uses the same UID

**C. Check Firestore Rules:**
- Ensure rules allow reading from `users` collection

---

#### 4. No Data Showing on Store Page

**Symptoms:**
- Store page loads but no banners/categories/items

**Solutions:**

**A. Check Client ID:**
- Open browser console
- Look for: `🏪 Detected subdomain for localhost: X`
- Verify it matches your store ID in Firestore

**B. Check Data Exists:**
- Firebase Console → Firestore
- Navigate to: `clients/{clientId}/categories`
- Verify documents exist

**C. Check Console for Errors:**
- Look for Firestore errors
- Common: "The query requires an index"
- Current code uses in-memory filtering to avoid this

---

#### 5. Build Failing - Unused Variables

**Symptoms:**
```
Compiled with problems:
ERROR [eslint]
'X' is defined but never used
```

**Solution:**
- Remove unused imports and variables
- Or add: `// eslint-disable-next-line no-unused-vars` above the line

---

#### 6. Login Loop / Flickering

**Symptoms:**
- Page keeps redirecting between login and dashboard
- Flickering on login

**Solutions:**

**A. Check AuthContext loading states:**
- Ensure `loading` state is properly managed
- `withRoleProtection` should wait for `loading: false`

**B. Clear browser cache:**
```bash
# Chrome
Ctrl + Shift + Delete → Clear cache

# Or
Incognito mode for testing
```

**C. Check for multiple redirects:**
- Ensure only one component is handling redirects
- Remove duplicate navigation calls

---

### Debug Mode

Add to `localStorage` for verbose logging:

```javascript
// In browser console
localStorage.setItem('DEBUG', 'true');

// Reload page
location.reload();
```

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

Creates optimized production build in `build/` folder.

### Deployment Options

#### Option 1: Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Deploy
firebase deploy --only hosting
```

**Configuration (`firebase.json`):**
```json
{
  "hosting": {
    "public": "build",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

#### Option 2: Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Option 3: Netlify

1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `build`
4. Deploy

#### Option 4: Custom Server

1. Build: `npm run build`
2. Upload `build/` folder to server
3. Configure web server (Apache/Nginx) for SPA routing

---

## 📚 API Reference

### firebaseService.js

**Location:** `src/services/firebaseService.js`

#### Client ID

```javascript
getClientId()
// Returns: string (client ID from subdomain)
```

#### Restaurant Info

```javascript
fetchRestaurantInfo()
// Returns: Promise<{name, description, logo}>

updateRestaurantInfo(info)
// Params: {name, description, logo}
// Returns: Promise<void>
```

#### Banners

```javascript
fetchBanners()
// Returns: Promise<Array<{id, title, description, image}>>

addBanner(bannerData)
// Params: {title, description, image}
// Returns: Promise<{id, ...bannerData}>

updateBanner(bannerId, updates)
// Params: (string, {title?, description?, image?})
// Returns: Promise<void>

deleteBanner(bannerId)
// Params: string
// Returns: Promise<void>
```

#### Categories

```javascript
fetchMenuCategories(includeHidden = false)
// Returns: Promise<Array<{id, name, icon, order, isActive}>>

addCategory(categoryData)
// Params: {name, icon, order, isActive}
// Returns: Promise<{id, ...categoryData}>

updateCategory(categoryId, updates)
// Params: (string, {name?, icon?, order?, isActive?})
// Returns: Promise<void>

deleteCategory(categoryId)
// Params: string
// Returns: Promise<void>
```

#### Menu Items

```javascript
fetchMenuItems(categoryId, includeHidden = false)
// Returns: Promise<Array<{id, name, description, price, image, ...}>>

addMenuItem(itemData)
// Params: {categoryId, name, description, price, image, isVegetarian, isSpicy, isActive}
// Returns: Promise<{id, ...itemData}>

updateMenuItem(itemId, updates)
// Params: (string, {...updates})
// Returns: Promise<void>

deleteMenuItem(itemId)
// Params: string
// Returns: Promise<void>
```

### superAdminService.js

**Location:** `src/services/superAdminService.js`

#### Analytics

```javascript
getAnalytics()
// Returns: Promise<{totalStores, totalUsers, totalMenuItems, totalBanners, stores: []}>
```

#### Users

```javascript
getAllUsers()
// Returns: Promise<Array<{id, name, email, role, storeId}>>

createUser(userData)
// Params: {email, password, name, role, storeId?}
// Returns: Promise<{uid, ...userData}>

updateUser(userId, updates)
// Params: (string, {name?, role?, storeId?})
// Returns: Promise<void>

deleteUser(userId)
// Params: string
// Returns: Promise<void>
```

#### Stores

```javascript
getAllStores()
// Returns: Promise<Array<{id, name, description, logo, location}>>

createStore(storeData)
// Params: {name, description, logo, location}
// Returns: Promise<{id, ...storeData}>

updateStore(storeId, updates)
// Params: (string, {...updates})
// Returns: Promise<void>

deleteStore(storeId)
// Params: string
// Returns: Promise<void>
```

#### Cross-Store Operations

```javascript
getStoreCategories(storeId)
// Returns: Promise<Array<Category>>

getStoreMenuItems(storeId, categoryId)
// Returns: Promise<Array<MenuItem>>

getStoreBanners(storeId)
// Returns: Promise<Array<Banner>>

createStoreCategory(storeId, categoryData)
createStoreMenuItem(storeId, itemData)
createStoreBanner(storeId, bannerData)

updateStoreCategory(storeId, categoryId, updates)
updateStoreMenuItem(storeId, itemId, updates)
updateStoreBanner(storeId, bannerId, updates)

deleteStoreCategory(storeId, categoryId)
deleteStoreMenuItem(storeId, itemId)
deleteStoreBanner(storeId, bannerId)
```

### imageUploadService.js

**Location:** `src/services/imageUploadService.js`

```javascript
uploadImage(file, folder, clientId)
// Params: (File, string, string)
// Returns: Promise<string> (downloadURL)

deleteImage(imageUrl)
// Params: string
// Returns: Promise<void>

compressImage(file, maxWidth = 1200, maxHeight = 1200, quality = 0.8)
// Params: (File, number, number, number)
// Returns: Promise<Blob>
```

---

## 📝 Project Structure

```
menuscanner/
├── public/
│   └── index.html
├── src/
│   ├── auth/
│   │   └── withRoleProtection.jsx      # HOC for route protection
│   ├── components/
│   │   ├── AddBannerDialog.jsx         # Add banner form
│   │   ├── AddCategoryDialog.jsx       # Add category form
│   │   ├── AdminPanel.jsx              # (Legacy)
│   │   ├── CategoryDetail.jsx          # Category items view
│   │   ├── EditItemDialog.jsx          # Edit item form
│   │   ├── ImageUploadField.jsx        # Reusable image upload
│   │   ├── LoginModal.jsx              # (Legacy)
│   │   ├── MenuCategories.jsx          # Category grid
│   │   ├── PromoSlider.jsx             # Banner carousel
│   │   ├── RestaurantLogo.jsx          # Logo component
│   │   └── superadmin/
│   │       ├── AnalyticsTab.jsx        # Analytics dashboard
│   │       ├── BannersTab.jsx          # Banner management
│   │       ├── MenuTab.jsx             # Menu management
│   │       ├── StoresTab.jsx           # Store management
│   │       └── UsersTab.jsx            # User management
│   ├── context/
│   │   └── AuthContext.jsx             # Authentication context
│   ├── pages/
│   │   ├── CustomerMenu.jsx            # Customer-facing menu
│   │   ├── HomePage.jsx                # About page (no subdomain)
│   │   ├── LandingPage.jsx             # (Legacy)
│   │   ├── LoginPage.jsx               # Login page
│   │   ├── ManagerDashboard.jsx        # Manager dashboard
│   │   ├── SuperAdminDashboard.jsx     # Super admin dashboard
│   │   └── UnauthorizedPage.jsx        # 403 page
│   ├── services/
│   │   ├── firebaseService.js          # Firestore operations
│   │   ├── imageUploadService.js       # Image upload/delete
│   │   ├── initializeFirestoreData.js  # Data initialization
│   │   └── superAdminService.js        # Super admin operations
│   ├── App.js                          # Root component
│   ├── firebase.js                     # Firebase config
│   ├── index.css                       # Global styles
│   └── index.js                        # Entry point
├── .gitignore
├── cors.json                           # CORS configuration
├── DOCUMENTATION.md                    # This file
├── package.json
└── README.md
```

---

## 🎨 Design System

### Color Palette

```css
/* Primary Colors */
--primary: #8C3A2B;        /* Terracotta */
--primary-light: #C66F53;
--primary-dark: #5C1A0B;

/* Secondary Colors */
--secondary: #F2C14E;      /* Saffron Gold */
--secondary-light: #FFD966;
--secondary-dark: #D4A42E;

/* Neutral Colors */
--background: #FFF8F0;     /* Cream */
--surface: #FFFFFF;
--text-primary: #2C2C2C;
--text-secondary: #757575;
```

### Typography

```css
/* Headings */
font-family: 'Playfair Display', serif;
font-weight: 700;

/* Body */
font-family: 'Poppins', sans-serif;
font-weight: 400;
```

### Spacing

```css
/* Material-UI spacing scale */
spacing(1) = 8px
spacing(2) = 16px
spacing(3) = 24px
spacing(4) = 32px
```

---

## 🔗 Related Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Material-UI Documentation](https://mui.com/)
- [React Router Documentation](https://reactrouter.com/)
- [React Documentation](https://react.dev/)

---

## 📞 Support & Contact

For onboarding new restaurants or technical support:

**Contact Information:**
- Email: `support@menuscanner.com`
- Phone: `+1 (555) 123-4567`
- Website: `https://menuscanner.com`

**Business Inquiries:**
- Email: `sales@menuscanner.com`

---

## 📄 License

This project is proprietary software owned by Anddhen Software Services.

---

## 🎉 Changelog

### Version 2.0 (October 2025)
- ✅ Migrated from mock data to Firebase
- ✅ Added image upload to Firebase Storage
- ✅ Implemented Super Admin Dashboard
- ✅ Added multi-tenant architecture
- ✅ Redesigned analytics dashboard
- ✅ Added banner management
- ✅ Improved mobile responsiveness

### Version 1.0 (Initial Release)
- ✅ Basic customer menu
- ✅ Manager login and editing
- ✅ Mock data implementation

---

**Built with ❤️ by Anddhen Software Services**

*Last updated: October 11, 2025*

