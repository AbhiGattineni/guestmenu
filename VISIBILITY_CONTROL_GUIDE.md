# 👁️ Visibility Control Guide

## New Feature: Hide/Show Categories & Items! ✨

Admins can now control which categories and items are visible to customers. Perfect for managing out-of-stock items, seasonal menus, or items under preparation.

---

## 🎯 How It Works

### Hide Categories
When a category is hidden:
- ❌ Doesn't appear on customer menu
- ✅ Still visible in admin panel (with "Hidden" badge)
- ✅ All items in that category are hidden from customers
- ✅ Can be toggled back to visible anytime

### Hide Items
When an item is hidden:
- ❌ Doesn't appear to customers
- ✅ Still visible in admin panel (with "Hidden" badge)
- ✅ Category remains visible (if it has other visible items)
- ✅ Can be toggled back to visible anytime

---

## 🎨 Visual Indicators

### In Admin Panel:

**Category Tabs:**
- Visible categories: Full opacity
- Hidden categories: Reduced opacity + "Hidden" badge (red chip)

**Category Toggle:**
- Top-right switch shows category visibility status
- 👁️ Icon = Visible to customers
- 👁️‍🗨️ Icon = Hidden from customers

**Item Cards:**
- Visible items: Solid border, full opacity
- Hidden items:
  - Dashed red border
  - Reduced opacity (60%)
  - "Hidden" badge on image (top right)

**Item Buttons:**
- "Hide Item" (warning/orange) - Click to hide visible item
- "Show Item" (success/green) - Click to show hidden item

---

## 🧪 Quick Test (2 minutes)

### Test Hiding a Category:

1. **Login to admin**: `/admin`

2. **Select any category tab** (e.g., "Appetizers")

3. **Find the category visibility switch** (top right)
   - Should show: "Category Visible to Customers" with 👁️ icon

4. **Toggle the switch OFF**
   - Status changes to: "Category Hidden from Customers" with 👁️‍🗨️ icon
   - Tab shows "Hidden" badge
   - Tab becomes slightly transparent

5. **Check customer view**:
   - Click "View Menu" in top nav
   - ✅ "Appetizers" category NOT visible in grid!

6. **Go back to admin** → Toggle switch ON
   - Category becomes visible again ✅

---

### Test Hiding an Item:

1. **In admin panel**, select "Appetizers" tab

2. **Find "Bruschetta" item card**

3. **Click "Hide Item"** button (orange/warning)
   - Card gets dashed red border
   - Opacity reduced to 60%
   - "Hidden" badge appears on image
   - Button changes to "Show Item" (green)

4. **Check customer view**:
   - Click "View Menu" → Browse to Appetizers
   - ✅ "Bruschetta" NOT visible in list!
   - Other items still visible ✅

5. **Go back to admin** → Click "Show Item"
   - Item becomes visible again ✅

---

## 💡 Use Cases

### Out of Stock:
```
Scenario: Lobster Tail is temporarily out of stock
Action: Go to admin → Main Course → Find "Lobster Tail" → Click "Hide Item"
Result: Customers don't see the unavailable item
When back in stock: Click "Show Item"
```

### Seasonal Menu:
```
Scenario: Summer menu ends, fall menu starts
Action: 
1. Hide "Summer Specials" category (toggle switch)
2. Show "Fall Specials" category (if previously hidden)
Result: Customers see only current seasonal items
```

### Time-Based:
```
Scenario: Breakfast menu available only until 11 AM
Action: After 11 AM, hide "Breakfast" category
Result: Customers don't see breakfast items
Next morning: Show "Breakfast" category again
```

### Item Preparation:
```
Scenario: New item being tested, not ready for customers
Action: Hide the item while finalizing recipe
Result: Admin can see it, customers can't
When ready: Click "Show Item"
```

### Sold Out Daily Special:
```
Scenario: Chef's Special sold out for the day
Action: Hide the item
Result: Customers don't order unavailable item
Next day: Show the item again
```

---

## 🔄 Workflow Examples

### Managing Inventory:

```
Daily Opening:
1. Login to admin
2. Check inventory
3. Hide items that are out of stock
4. Show items that are back in stock

During Service:
- Item runs out → Hide immediately
- Customers don't see it anymore

End of Day:
- Review what was hidden
- Plan for tomorrow
```

### Seasonal Transition:

```
End of Summer:
1. Hide "Summer Specials" category
2. Hide summer drinks in "Beverages"
3. Show "Fall Specials" category
4. Show fall drinks

Result: Smooth seasonal menu transition
```

---

## 📊 Admin vs Customer View

### What Admin Sees:
```
/admin
├── ALL categories (visible + hidden)
│   ├── Hidden categories: Reduced opacity + "Hidden" badge
│   └── Visible categories: Normal appearance
├── ALL items (visible + hidden)
│   ├── Hidden items: Dashed border + "Hidden" badge
│   └── Visible items: Normal appearance
└── Toggle controls for each category and item
```

### What Customer Sees:
```
/ (homepage)
├── ONLY visible categories
│   └── ONLY visible items within each category
└── No indication that items are hidden
```

---

## 🎯 Key Features

### Category-Level Control:
- ✅ One-click toggle switch
- ✅ Immediate effect
- ✅ Visual feedback (badge + opacity)
- ✅ Hides all items in that category

### Item-Level Control:
- ✅ Individual hide/show buttons
- ✅ Clear visual indicators
- ✅ Tooltip hints
- ✅ Color-coded (orange = hide, green = show)

### Safety:
- ✅ Hidden items still in database
- ✅ No data loss
- ✅ Reversible instantly
- ✅ Admin always sees everything

---

## 🔍 Visual Guide

### Category Tab (Visible):
```
[🥗 Appetizers]
Normal opacity, no badge
```

### Category Tab (Hidden):
```
[🥗 Appetizers [Hidden]]
Reduced opacity, red "Hidden" badge
```

### Category Toggle (Visible):
```
[Toggle: ON] 👁️ Category Visible to Customers
```

### Category Toggle (Hidden):
```
[Toggle: OFF] 👁️‍🗨️ Category Hidden from Customers
```

### Item Card (Visible):
```
┌─────────────────┐
│   [Image]       │
├─────────────────┤
│ Bruschetta      │
│ $8.99           │
├─────────────────┤
│ [Edit Item]     │
│ [Hide Item]     │ ← Orange button
└─────────────────┘
Solid border
Full opacity
```

### Item Card (Hidden):
```
┌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┐
│ [Image] [Hidden]│ ← Badge
├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┤
│ Bruschetta      │
│ $8.99           │
├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┤
│ [Edit Item]     │
│ [Show Item]     │ ← Green button
└╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┘
Dashed red border
60% opacity
```

---

## 🛠️ Implementation Details

### New API Functions:
```javascript
// Toggle category visibility
toggleCategoryVisibility(categoryId)
→ Returns updated category with isActive toggled

// Toggle item visibility
toggleItemVisibility(itemId)
→ Returns updated item with isActive toggled

// Fetch categories (with filter option)
fetchMenuCategories(includeHidden = false)
→ If false, returns only active categories
→ If true (admin), returns all categories

// Fetch items (with filter option)
fetchMenuItems(categoryId, includeHidden = false)
→ If false, returns only active items
→ If true (admin), returns all items
```

### Data Structure:
```javascript
// Categories
{
  id: 1,
  name: "Appetizers",
  description: "Start your meal right",
  icon: "🥗",
  itemCount: 12,
  isActive: true  // ← New field
}

// Items
{
  id: 101,
  name: "Bruschetta",
  description: "...",
  price: 8.99,
  image: "...",
  isVegetarian: true,
  isSpicy: false,
  isActive: true  // ← New field
}
```

---

## 💾 Data Persistence

### Session-Based:
- ✅ Visibility changes persist during browser session
- ✅ Changes reflected immediately for all views
- ⚠️ Lost on page refresh (no database)

### For Production:
```
PATCH /api/categories/:id/visibility
Body: { isActive: true/false }

PATCH /api/items/:id/visibility
Body: { isActive: true/false }
```

---

## 📝 Best Practices

### Daily Operations:
1. ✅ Check inventory before opening
2. ✅ Hide out-of-stock items immediately
3. ✅ Review hidden items at end of day
4. ✅ Plan for next day's menu

### Communication:
1. ✅ Train staff on hiding items when they run out
2. ✅ Create checklist for seasonal transitions
3. ✅ Document why items are hidden (internal notes)

### Customer Experience:
1. ✅ Hide items proactively (before customers complain)
2. ✅ Show items only when ready to serve
3. ✅ Keep menu up-to-date throughout service

---

## 🎯 Testing Checklist

- [ ] Can hide a category via toggle
- [ ] Hidden category shows badge and reduced opacity
- [ ] Hidden category NOT visible on customer menu
- [ ] Can show category again
- [ ] Can hide an item via button
- [ ] Hidden item shows dashed border and badge
- [ ] Hidden item NOT visible to customers
- [ ] Can show item again
- [ ] Multiple items can be hidden in same category
- [ ] Category with all hidden items still shows on admin
- [ ] Empty categories handle correctly
- [ ] Toggle works for all categories
- [ ] Hide/Show works for all items
- [ ] Changes persist during session
- [ ] Customer view filters correctly

---

## ✨ Summary

### What's New:
- ✅ **Category visibility toggle** - One-click hide/show
- ✅ **Item visibility buttons** - Individual control
- ✅ **Visual indicators** - Badges, opacity, borders
- ✅ **Filtered customer view** - Only active items shown
- ✅ **Admin sees all** - Including hidden items

### Benefits:
- 🎯 **Better inventory management** - Hide unavailable items instantly
- ⏰ **Time-based menus** - Show breakfast, lunch, dinner at right times
- 🌱 **Seasonal control** - Easy seasonal menu transitions
- 🔒 **Test new items** - Hide until ready for customers
- 💰 **Reduce complaints** - Customers don't order unavailable items

---

**Admins now have complete control over what customers see!** 👁️✨

