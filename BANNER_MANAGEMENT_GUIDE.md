# 🎪 Banner Management Guide

## New Feature: Manage Promotional Banners! ✨

Admins can now create, view, and delete promotional banners that appear on the customer homepage slider.

---

## 🎯 How to Manage Banners

### Step 1: Access Banner Management
```
Method 1: From Admin Panel
1. Login to /admin
2. Click "Manage Banners" button (top navigation bar)
3. Redirected to /admin/banners

Method 2: Direct URL
1. Navigate to http://localhost:3000/admin/banners
2. (Requires login)
```

### Step 2: View Existing Banners
```
- See all active banners in a grid layout
- Each card shows:
  - Banner image preview
  - Title and description overlay
  - Banner ID
  - Image URL
  - Delete button
```

### Step 3: Add New Banner
```
1. Click "Add Banner" button (top right)
2. Fill in the form:
   - Title (e.g., "Weekend Special")
   - Description (e.g., "Get 20% off all orders")
   - Image URL (or click example images)
3. See live preview
4. Click "Add Banner"
5. New banner appears immediately!
```

### Step 4: Delete Banner
```
1. Find the banner card you want to remove
2. Click "Delete" button
3. Confirm deletion
4. Banner removed from slider
```

---

## 🧪 Quick Test (2 minutes)

### Test Adding a Banner:

1. **Login to admin**: `/admin`

2. **Click "Manage Banners"** in top nav

3. **Click "Add Banner"** (top right, primary button)

4. **Fill in form**:
   ```
   Title: Weekend Brunch Special
   Description: Join us Saturday & Sunday 10am-2pm
   Image: Click one of the example images
   ```

5. **See live preview** at bottom of dialog

6. **Click "Add Banner"**

7. **✅ Verify**:
   - New banner card appears in grid
   - Shows image, title, description

8. **Test customer view**:
   - Click "View Menu" button
   - See new banner in homepage slider! 🎉
   - Slider auto-advances through all banners

9. **Test deletion**:
   - Go back to /admin/banners
   - Click "Delete" on a banner
   - Confirm deletion
   - Banner removed ✅

---

## 📸 Image Requirements

### Recommended:
- **Size**: 1200px × 400px (landscape)
- **Format**: JPG, PNG, WebP
- **Quality**: High resolution for sharp display
- **Subject**: Food, restaurant ambiance, or promotional graphics

### Where to Find Images:
1. **Unsplash.com** - Free high-quality photos
   - Search: "food", "restaurant", "dining"
   - Use image URL format: `?w=1200&h=400&fit=crop&q=80`

2. **Your own images** - Upload to image hosting
   - Imgur, Cloudinary, AWS S3, etc.

3. **Example images** - Click quick examples in the dialog
   - 4 pre-selected food images ready to use

---

## 🎨 Features

### 1. Add Banners
- ✅ Title and description
- ✅ Custom image URL
- ✅ Click-to-use example images
- ✅ Live preview before saving
- ✅ Form validation
- ✅ Image error handling

### 2. View Banners
- ✅ Grid layout (2 columns on desktop)
- ✅ Image preview cards
- ✅ Title/description overlay
- ✅ Banner count display
- ✅ Responsive design

### 3. Delete Banners
- ✅ One-click deletion
- ✅ Confirmation dialog
- ✅ Immediate removal
- ✅ Loading states

### 4. Navigation
- ✅ Back to admin panel
- ✅ View customer menu
- ✅ Dedicated banner page
- ✅ Protected route (login required)

---

## 🔄 Banner Display

### Customer Homepage:
- Appears as **sliding carousel** below restaurant logo
- **Auto-advances** every 5 seconds
- Shows **title and description** on bottom overlay
- Navigation arrows and dots
- Responsive height (mobile/tablet/desktop)

### Admin View:
- Shows all banners in **grid layout**
- Each banner is **editable/deletable**
- See exactly what customers will see

---

## 💡 Use Cases

### Seasonal Promotions:
```
Title: "Summer Specials"
Description: "Fresh seasonal salads and chilled beverages"
Image: Bright summer food photo
```

### Special Events:
```
Title: "Valentine's Day Menu"
Description: "Reserve your romantic dinner for two"
Image: Elegant table setting
```

### Happy Hour:
```
Title: "Happy Hour 4-7 PM"
Description: "Half price on all drinks and appetizers"
Image: Drinks and appetizers
```

### New Menu Launch:
```
Title: "New Fall Menu Available"
Description: "Try our seasonal dishes with autumn flavors"
Image: Fall-themed food
```

### Discounts:
```
Title: "20% Off Weekday Lunch"
Description: "Valid Monday-Friday 11am-3pm"
Image: Lunch spread
```

---

## 🗺️ Routes

### New Routes Added:
```
/admin/banners  →  Banner Management Page (Protected)
```

### Route Protection:
- ✅ Requires authentication
- ✅ Redirects to /login if not logged in
- ✅ Full-page interface

---

## 📊 Banner Lifecycle

### Creation:
```
Admin clicks "Add Banner"
  ↓
Fills form (title, description, image URL)
  ↓
Clicks "Add Banner"
  ↓
Banner saved to mockBanners array
  ↓
Appears in banner grid
  ↓
Visible on customer homepage immediately
```

### Deletion:
```
Admin clicks "Delete"
  ↓
Confirms deletion
  ↓
Banner removed from mockBanners array
  ↓
Removed from grid
  ↓
No longer appears on customer homepage
```

---

## 🎯 Testing Checklist

- [ ] Can access /admin/banners (after login)
- [ ] "Manage Banners" button visible in admin panel
- [ ] Existing banners load and display
- [ ] "Add Banner" button opens dialog
- [ ] Can enter title and description
- [ ] Can paste image URL
- [ ] Can click example images to use them
- [ ] Live preview updates as you type
- [ ] Can submit form
- [ ] New banner appears in grid
- [ ] New banner appears on customer homepage
- [ ] Slider includes new banner
- [ ] Can delete banners
- [ ] Deletion confirmation works
- [ ] Deleted banner removed from grid
- [ ] Deleted banner removed from customer homepage
- [ ] "View Menu" button works
- [ ] "Back to Admin" button works
- [ ] Route protection works (redirects if not logged in)

---

## 🛠️ Implementation Details

### New Files:
```
src/components/AddBannerDialog.jsx    ← Banner creation form
src/pages/BannerManagementPage.jsx    ← Dedicated banner management page
```

### Updated Files:
```
src/services/mockApi.js    ← Added addBanner() and deleteBanner()
src/pages/AdminPage.jsx    ← Added "Manage Banners" button
src/App.js                 ← Added /admin/banners route
```

### API Functions:
```javascript
// Add banner
addBanner({ title, description, image })
→ Returns new banner with auto-generated ID

// Delete banner
deleteBanner(bannerId)
→ Returns success status
```

---

## 💾 Data Persistence

### Session-Based:
- ✅ Banners persist during browser session
- ✅ Visible on customer homepage immediately
- ✅ Changes reflected in real-time
- ⚠️ Lost on page refresh (no database)

### For Production:
```
POST   /api/banners        → Create banner
GET    /api/banners        → List all banners
DELETE /api/banners/:id    → Delete banner
PUT    /api/banners/:id    → Update banner (future)
```

---

## 📐 UI/UX Details

### Banner Management Page:
- **Header**: Gold/saffron gradient
- **Buttons**: "Manage Banners", "View Menu", "Add Banner"
- **Grid**: 2 columns on desktop, 1 on mobile
- **Cards**: Image preview with title/description overlay
- **Empty State**: Friendly message with CTA

### Add Banner Dialog:
- **Size**: Medium width, full-height scrollable
- **Sections**: Form fields, example images, live preview
- **Validation**: All fields required
- **Error Handling**: Invalid image URLs show placeholder

### Customer Homepage:
- **Slider**: Full-width, responsive height
- **Auto-advance**: 5 seconds per slide
- **Navigation**: Arrows + dots
- **Overlay**: Dark gradient with white text

---

## 🎨 Example Banner Content

### Restaurant Anniversary:
```
Title: "Celebrating 10 Years!"
Description: "Thank you for a decade of delicious memories"
Image: Restaurant celebration photo
```

### Chef's Special:
```
Title: "Chef's Tasting Menu"
Description: "5-course culinary journey - $65 per person"
Image: Plated gourmet dish
```

### Online Ordering:
```
Title: "Order Online for Pickup"
Description: "Skip the line - order ahead for fast pickup"
Image: Food packaging/delivery
```

### Loyalty Program:
```
Title: "Join Our Rewards Program"
Description: "Earn points with every purchase"
Image: Loyalty card or happy customers
```

---

## 🔍 Where Banners Appear

### 1. Customer Homepage (`/`):
- Below restaurant logo
- Above menu categories
- Sliding carousel with auto-advance
- Responsive height

### 2. Banner Management (`/admin/banners`):
- Grid of all banners
- Edit/delete controls
- Add new banner button

---

## ✨ Summary

### What's New:
- ✅ Dedicated banner management page
- ✅ "Manage Banners" button in admin panel
- ✅ Add unlimited banners
- ✅ Delete banners with confirmation
- ✅ Live preview before saving
- ✅ Quick example images
- ✅ Real-time updates on customer homepage
- ✅ Protected route for security

### Routes:
```
/admin/banners  →  Manage promotional banners
```

### Navigation:
```
Admin Panel → Manage Banners → Add/Delete → View Customer Menu
```

---

**Admins can now fully manage the homepage promotional slider!** 🎉

