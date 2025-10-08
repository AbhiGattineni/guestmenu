# 🔐 Manager Login Credentials

## Quick Reference

### Demo Mode: ANY credentials work!

You can use **any email and password combination** to login. The system accepts all credentials in demo mode.

---

## Recommended Test Credentials

### Option 1 (Recommended)
```
Email:    manager@restaurant.com
Password: admin123
```

### Option 2
```
Email:    admin@gourmet.com
Password: password
```

### Option 3
```
Email:    test@test.com
Password: test
```

### Option 4 (Or literally anything!)
```
Email:    hello@world.com
Password: 12345
```

---

## 🎯 Quick Login Test

### Method 1: Via Customer Page
1. **Start the app**: `npm start`
2. **Open**: `http://localhost:3000/`
3. **Click** the floating Login button (bottom right corner)
4. **You're redirected to**: `/login`
5. **Enter**:
   - Email: `manager@restaurant.com`
   - Password: `admin123`
6. **Click** "Login to Admin Panel"
7. **Success!** Redirected to `/admin`

### Method 2: Direct Login URL
1. **Open directly**: `http://localhost:3000/login`
2. **Enter credentials** and login
3. **Redirected to**: `/admin`

---

## ✅ Verify Changes Reflect on UI

### Quick Test (30 seconds):

1. **Login** with any credentials above
2. **Click** Admin Panel button
3. **Find** any item (e.g., "Bruschetta" in Appetizers)
4. **Click** Edit button
5. **Change** the price from `8.99` to `15.99`
6. **Click** Save Changes
7. **Close** Admin Panel (X button)
8. **Navigate** to Appetizers category on main menu
9. **✅ See** the price is now `$15.99`!

**Result**: Changes are LIVE and visible to customers immediately! 🎉

---

## 📋 What You Can Edit

- ✏️ Item Name
- ✏️ Description
- ✏️ Price
- ✏️ Image URL
- ✏️ Vegetarian flag
- ✏️ Spicy flag

All changes are **immediately reflected** on the customer-facing menu!

---

## ⚠️ Important Notes

### Session Persistence
- ✅ Changes persist during current browser session
- ✅ Changes visible immediately to customers
- ❌ Page refresh resets data (no real database connected)

### Real Database Integration
To make changes permanent:
1. Connect to a backend API
2. Replace mock functions in `src/services/mockApi.js`
3. Add real database storage

---

## 🚀 Try It Now!

```bash
# 1. Start the app
npm start

# 2. Open browser to http://localhost:3000

# 3. Login with:
manager@restaurant.com / admin123

# 4. Edit any menu item

# 5. View changes on customer page!
```

**Enjoy managing your menu!** 🍽️

