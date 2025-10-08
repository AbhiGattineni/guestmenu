# 🗺️ Routing Guide

## Application Routes

The application now has **separate routes** for customer and admin views, making the distinction crystal clear!

---

## 📍 Available Routes

### 1. Customer Menu (Home)
**Route**: `/` or `http://localhost:3000/`

**Description**: Main customer-facing menu page

**Features**:
- Restaurant logo and branding
- Promotional slider
- Menu categories grid
- Category detail view with items
- Login/Admin button (floating, bottom right)

**Who sees this**: All customers who scan the QR code

---

### 2. Manager Login
**Route**: `/login` or `http://localhost:3000/login`

**Description**: Dedicated login page for managers

**Features**:
- Professional login form
- Demo credentials displayed
- Email and password fields
- "Back to Menu" button
- Auto-redirect to `/admin` after successful login

**Credentials**: Any email/password (demo mode)
- Suggested: `manager@restaurant.com` / `admin123`

---

### 3. Admin Panel
**Route**: `/admin` or `http://localhost:3000/admin`

**Description**: Full-page admin interface

**Features**:
- Top navigation bar with logout
- Category tabs
- Grid of all menu items
- Edit functionality
- "View Menu" button to see customer view
- Protected route (requires login)

**Access**: Only accessible after login (auto-redirects to `/login` if not authenticated)

---

## 🔄 Navigation Flow

### Customer Journey:
```
Customer scans QR code
    ↓
Opens http://localhost:3000/
    ↓
Browses menu categories
    ↓
Views items in categories
```

### Manager Journey:
```
Manager opens app
    ↓
Clicks "Login" button (or goes to /login)
    ↓
Enters credentials
    ↓
Redirected to /admin
    ↓
Edits menu items
    ↓
Clicks "View Menu" to see customer view
    ↓
Switches between /admin and / as needed
```

---

## 🎯 Route Protection

### Public Routes:
- ✅ `/` - Customer menu (always accessible)
- ✅ `/login` - Login page (redirects to `/admin` if already logged in)

### Protected Routes:
- 🔒 `/admin` - Admin panel (redirects to `/login` if not authenticated)

---

## 🚀 Testing the Routes

### Test 1: Customer View
1. Open `http://localhost:3000/`
2. See customer menu
3. Browse categories
4. ✅ No admin features visible (except login button)

### Test 2: Direct Admin Access (Not Logged In)
1. Open `http://localhost:3000/admin`
2. ✅ Auto-redirected to `/login`

### Test 3: Login Flow
1. Open `http://localhost:3000/login`
2. Enter: `manager@restaurant.com` / `admin123`
3. Click Login
4. ✅ Redirected to `/admin`
5. See full admin panel

### Test 4: Edit and Verify
1. At `/admin`, edit an item (e.g., change price)
2. Click "View Menu" button in top bar
3. ✅ Navigates to `/` (customer view)
4. Browse to that category
5. ✅ See updated price!

### Test 5: Logout Flow
1. At `/admin`, click "Logout" in top bar
2. ✅ Redirected to `/` (customer menu)
3. Try to access `/admin` again
4. ✅ Redirected to `/login`

---

## 🔗 Quick Links Reference

### Development:
- Customer Menu: `http://localhost:3000/`
- Login: `http://localhost:3000/login`
- Admin: `http://localhost:3000/admin`

### Production (after deployment):
- Customer Menu: `https://yourdomain.com/`
- Login: `https://yourdomain.com/login`
- Admin: `https://yourdomain.com/admin`

---

## 💡 Key Differences from Previous Version

### Before (Single Page):
```
Everything on /
├── Customer sees menu
├── Manager clicks FAB → Opens modal
└── Admin panel in dialog overlay
```

### Now (Multiple Routes):
```
/ → Customer menu page
/login → Dedicated login page
/admin → Full admin page (separate route)
```

### Benefits:
✅ **Clearer separation** between customer and admin views
✅ **Direct URLs** for login and admin
✅ **Better UX** - dedicated pages instead of modals
✅ **Easier to share** - send `/login` link to managers
✅ **Professional** - feels like a real application
✅ **SEO friendly** - proper routes for each section

---

## 📱 Navigation Buttons

### On Customer Page (`/`):
- **Login button** (if not logged in) → Navigates to `/login`
- **Admin Panel button** (if logged in) → Navigates to `/admin`

### On Login Page (`/login`):
- **Back to Menu button** → Navigates to `/`
- **Login button** → Authenticates and navigates to `/admin`

### On Admin Page (`/admin`):
- **View Menu button** (top bar) → Navigates to `/`
- **Logout button** (top bar) → Logs out and navigates to `/`
- **Home FAB** (floating button) → Navigates to `/`

---

## 🔍 Browser History

The routing now works with browser back/forward buttons:

```
User navigates: / → /login → /admin
Click browser back: /admin → /login → /
Browser forward: / → /login → /admin
```

---

## 📊 Route Summary Table

| Route | Component | Access | Redirect If | Purpose |
|-------|-----------|---------|-------------|---------|
| `/` | `CustomerMenu` | Public | - | Customer menu view |
| `/login` | `LoginPage` | Public | Already logged in → `/admin` | Manager login |
| `/admin` | `AdminPage` | Protected | Not logged in → `/login` | Admin panel |
| `*` (any other) | - | Public | → `/` | Catch-all |

---

## 🎨 Visual Route Map

```
┌─────────────────────────────────────┐
│         Customer Scans QR           │
│                 ↓                   │
│           / (Home Page)             │
│       ┌──────────────────┐          │
│       │  Customer Menu   │          │
│       │  - Logo          │          │
│       │  - Slider        │          │
│       │  - Categories    │          │
│       │  [Login Button]  │          │
│       └──────────────────┘          │
│                 ↓                   │
│         Click Login Button          │
│                 ↓                   │
│          /login (Login Page)        │
│       ┌──────────────────┐          │
│       │  Login Form      │          │
│       │  - Email         │          │
│       │  - Password      │          │
│       │  [Login Button]  │          │
│       └──────────────────┘          │
│                 ↓                   │
│         Enter Credentials           │
│                 ↓                   │
│          /admin (Admin Page)        │
│       ┌──────────────────┐          │
│       │  Admin Panel     │          │
│       │  - Top Nav       │          │
│       │  - Categories    │          │
│       │  - Item Grid     │          │
│       │  [Edit Items]    │          │
│       │  [View Menu]     │          │
│       │  [Logout]        │          │
│       └──────────────────┘          │
│         ↓              ↓            │
│    Edit Items    Click View Menu   │
│         ↓              ↓            │
│    Save Changes    Back to /       │
│         ↓                           │
│    Changes reflect                  │
│    on / (Customer view)             │
└─────────────────────────────────────┘
```

---

## 🛠️ Implementation Details

### Technology:
- **React Router v6** (`react-router-dom`)
- `BrowserRouter` for routing
- `Routes` and `Route` components
- `useNavigate()` hook for programmatic navigation
- `Navigate` component for redirects

### File Structure:
```
src/
├── App.js (Router setup)
├── pages/
│   ├── CustomerMenu.jsx  → Route: /
│   ├── LoginPage.jsx     → Route: /login
│   └── AdminPage.jsx     → Route: /admin
└── context/
    └── AuthContext.jsx (Manages auth state across routes)
```

---

**The routing makes the customer/admin distinction obvious and professional!** 🎉

