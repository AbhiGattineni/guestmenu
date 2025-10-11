# 🔐 Login Credentials

## Quick Reference

### Super Admin

```
Email:    abhishekgattineni@gmail.com
Password: admin@123
Access:   All stores, full platform control
URL:      http://localhost:3000/superadmin-dashboard
```

**Capabilities:**
- ✅ Manage all stores
- ✅ Create/edit/delete users
- ✅ Assign managers to stores
- ✅ Edit menus across all stores
- ✅ Manage banners for all stores
- ✅ View analytics dashboard

---

### Manager (Store 1)

```
Email:    manager@restaurant.com
Password: admin123
Store:    1
Access:   Store 1 only
URL:      http://1.localhost:3000/manager-dashboard
```

**Capabilities:**
- ✅ Manage own store's menu
- ✅ Add/edit/delete categories
- ✅ Add/edit/delete menu items
- ✅ Manage banners
- ✅ Upload images
- ❌ Cannot access other stores
- ❌ Cannot manage users

---

## Customer Access (No Login Required)

**Homepage:**
```
URL: http://localhost:3000/
Shows: About MenuScanner app and contact info
```

**Store Menus:**
```
Store 1: http://1.localhost:3000/
Store 2: http://2.localhost:3000/
Shows: Customer-facing menu with banners, categories, items
```

---

## Creating New Users

### Via Super Admin Dashboard

1. Login as Super Admin
2. Go to **Users** tab
3. Click **Add User**
4. Fill in:
   - Name
   - Email
   - Password
   - Role (superadmin/manager)
   - Store ID (if manager)
5. Click **Create**

### Via Firebase Console

#### Step 1: Create Authentication User

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **menuscanner-6f332**
3. Click **Authentication** → **Users**
4. Click **Add user**
5. Enter email and password
6. **Copy the User UID** (you'll need this)

#### Step 2: Add Role to Firestore

1. Go to **Firestore Database**
2. Navigate to collection: `users`
3. Click **Add document**
4. Document ID: `[paste the User UID from step 1]`
5. Add fields:

**For Super Admin:**
```
name: "Full Name"
email: "email@example.com"
role: "superadmin"
createdAt: [current timestamp]
```

**For Manager:**
```
name: "Manager Name"
email: "manager@example.com"
role: "manager"
storeId: "1"  (or any store ID)
createdAt: [current timestamp]
```

6. Click **Save**

---

## Testing Login

### Quick Test (30 seconds)

1. **Start the app:**
   ```bash
   npm start
   ```

2. **Test Super Admin:**
   - Open: `http://localhost:3000/login`
   - Email: `abhishekgattineni@gmail.com`
   - Password: `admin@123`
   - Should redirect to: `/superadmin-dashboard`

3. **Test Manager:**
   - Logout first
   - Email: `manager@restaurant.com`
   - Password: `admin123`
   - Should redirect to: `/manager-dashboard`

4. **Test Customer Menu:**
   - Open: `http://1.localhost:3000/`
   - Should show menu (no login required)

---

## Troubleshooting Login Issues

### Issue: Redirected to Unauthorized Page

**Solutions:**

1. **Check Firestore role document:**
   - Go to Firebase Console → Firestore
   - Collection: `users`
   - Document ID: `[your User UID]`
   - Verify `role` field exists and is set correctly

2. **Check User UID matches:**
   - Authentication UID must match Firestore document ID

3. **Check storeId for managers:**
   - Managers must have `storeId` field
   - storeId must match an existing store in `clients` collection

### Issue: Cannot Login / Invalid Credentials

**Solutions:**

1. **Check Firebase Authentication:**
   - Go to Firebase Console → Authentication → Users
   - Verify user exists with correct email

2. **Reset password:**
   - Delete user in Authentication
   - Create new user with correct password

3. **Check browser console:**
   - Look for specific error messages
   - Common: "auth/user-not-found", "auth/wrong-password"

### Issue: Login Loop / Keeps Redirecting

**Solutions:**

1. **Clear browser cache:**
   - Press `Ctrl + Shift + Delete`
   - Clear cached images and files

2. **Use incognito mode:**
   - Test in incognito to rule out cache issues

3. **Check console logs:**
   - Look for "Auth Check" logs
   - Verify `currentUser` and `userRole` are both present

---

## Security Notes

### Password Requirements

- Minimum 6 characters (Firebase requirement)
- Recommended: Use strong passwords in production
- Change default passwords immediately

### Role Hierarchy

```
Super Admin → Full access to everything
    ↓
Manager → Limited to assigned store(s)
    ↓
Customer → Read-only, no authentication required
```

### Best Practices

✅ **DO:**
- Change default passwords
- Use strong passwords (12+ characters)
- Regularly audit user access
- Remove inactive users
- Enable 2FA for super admins (via Firebase)

❌ **DON'T:**
- Share super admin credentials
- Use same password for multiple accounts
- Leave default credentials in production
- Give manager role to untrusted users

---

## Additional Resources

For more detailed information:

- **Complete Setup Guide:** See [DOCUMENTATION.md](DOCUMENTATION.md)
- **Firebase Authentication:** [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- **Troubleshooting:** See [DOCUMENTATION.md - Troubleshooting](DOCUMENTATION.md#troubleshooting)

---

**Last Updated:** October 11, 2025
