# Quick Start Guide

## Getting Started in 3 Steps

### 1. Install and Run

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

The app will open at `http://localhost:3000/`

### 2. Test Customer Experience

**Route**: `http://localhost:3000/`

1. **View the landing page** - See restaurant logo and promotional banners
2. **Browse categories** - Scroll down to see menu categories
3. **Click a category** - e.g., "Appetizers" to view menu items
4. **Click "Back to Categories"** - Return to main menu

### 3. Test Manager Features

#### Login
**Route**: `http://localhost:3000/login`

1. **Click the Login button** (floating button on customer page)
   - OR navigate directly to `/login`
2. **Enter any credentials**:
   - Email: `manager@restaurant.com` (or any email)
   - Password: `admin123` (or any password)
3. **Click "Login to Admin Panel"**
4. **Auto-redirected to** `/admin`

#### Edit Menu Items
**Route**: `http://localhost:3000/admin`

1. **You're now on the Admin Page** (full screen, not a modal!)
2. **Select a category tab** (e.g., Appetizers, Main Course)
3. **Click "Edit Item"** on any menu item
4. **Update details**:
   - Change the name (e.g., "Bruschetta Special")
   - Update price (e.g., 15.99)
   - Modify description
   - Change image URL (use Unsplash URLs)
   - Toggle Vegetarian/Spicy checkboxes
5. **Click Save Changes**
6. **Click "View Menu"** (top navigation bar)
7. **Now on customer page** (`/`) - Navigate to that category
8. **Verify changes** - Your edits are visible! ✅

#### Switch Between Views
- **From Admin** → Click "View Menu" (top bar) → See customer view
- **From Customer** → Click "Admin Panel" button (floating) → Back to admin

#### Logout
Click the **Logout button** (top navigation bar on admin page)

## Demo Credentials

**Login Mode**: Open (any email/password works)

Example:
- Email: `manager@test.com`
- Password: `test123`

## Key Features to Test

✅ **Responsive Design** - Resize browser window to see mobile/tablet views
✅ **Slider Auto-advance** - Wait 5 seconds to see banner carousel
✅ **Item Filtering** - Each category shows different items
✅ **Real-time Updates** - Edits appear immediately
✅ **Dietary Badges** - Look for vegetarian 🌿 and spicy 🔥 indicators
✅ **Smooth Animations** - Hover over cards and buttons

## Troubleshooting

**Issue**: Images not loading
- **Fix**: Check internet connection (using Unsplash CDN)

**Issue**: Can't login
- **Fix**: Any email/password works in demo mode

**Issue**: Changes not saving
- **Fix**: Check browser console for errors

**Issue**: Port 3000 already in use
- **Fix**: Run `npm start` and choose a different port when prompted

## Next Steps

1. **Customize** restaurant name and logo in `src/services/mockApi.js`
2. **Add more items** to menu categories
3. **Update banners** with your promotional content
4. **Connect to backend** by replacing mock API calls

## File Structure Reference

```
Key Files to Modify:
├── src/services/mockApi.js    # Menu data, restaurant info
├── src/App.js                 # Theme colors and fonts
└── public/index.html          # Page title and meta tags
```

## Testing Checklist

- [ ] Landing page loads correctly
- [ ] All 6 category cards are visible
- [ ] Can click and view category details
- [ ] Back button returns to categories
- [ ] Login button is visible
- [ ] Can login with any credentials
- [ ] Admin panel opens after login
- [ ] Can switch between category tabs
- [ ] Edit dialog opens when clicking Edit
- [ ] Can modify all item fields
- [ ] Changes save successfully
- [ ] Changes visible on main menu
- [ ] Can logout
- [ ] Login button reappears after logout

Enjoy your restaurant menu system! 🍽️

