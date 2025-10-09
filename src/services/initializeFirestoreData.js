/**
 * Initialize Firestore Data
 *
 * This script populates Firestore with initial restaurant data
 * Run this once to set up a new restaurant client
 *
 * Usage:
 * 1. Import this in your app temporarily
 * 2. Call initializeFirestoreData() once
 * 3. Remove the import after data is initialized
 */

import {
  getFirestore,
  collection,
  doc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import "../firebase"; // Initialize Firebase

const db = getFirestore();

/**
 * Get the client ID
 */
const getClientId = () => {
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    return "demo-restaurant";
  }
  const subdomain = window.location.hostname.split(".")[0];
  return subdomain || "demo-restaurant";
};

/**
 * Initialize restaurant info
 */
const initRestaurantInfo = async (clientId) => {
  const restaurantInfoRef = doc(
    db,
    "clients",
    clientId,
    "settings",
    "restaurantInfo"
  );
  await setDoc(restaurantInfoRef, {
    name: "The Gourmet Kitchen",
    logo: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&h=200&fit=crop&q=80",
    description: "Fine dining experience with authentic flavors",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  console.log("✅ Restaurant info initialized");
};

/**
 * Initialize banners
 */
const initBanners = async (clientId) => {
  const banners = [
    {
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=400&fit=crop&q=80",
      title: "Special Discount",
      description: "Get 20% off on all orders above $50",
    },
    {
      image:
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=400&fit=crop&q=80",
      title: "New Menu Items",
      description: "Try our latest seasonal dishes",
    },
    {
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=400&fit=crop&q=80",
      title: "Happy Hour",
      description: "Special prices from 4 PM to 7 PM",
    },
  ];

  for (const banner of banners) {
    const bannerRef = doc(collection(db, "clients", clientId, "banners"));
    await setDoc(bannerRef, {
      ...banner,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  }
  console.log(`✅ ${banners.length} banners initialized`);
};

/**
 * Initialize categories
 */
const initCategories = async (clientId) => {
  const categories = [
    {
      name: "Appetizers",
      description: "Start your meal right",
      icon: "🥗",
      order: 1,
      isActive: true,
    },
    {
      name: "Main Course",
      description: "Our signature dishes",
      icon: "🍝",
      order: 2,
      isActive: true,
    },
    {
      name: "Desserts",
      description: "Sweet endings",
      icon: "🍰",
      order: 3,
      isActive: true,
    },
    {
      name: "Beverages",
      description: "Refresh yourself",
      icon: "🥤",
      order: 4,
      isActive: true,
    },
    {
      name: "Soups & Salads",
      description: "Healthy options",
      icon: "🥣",
      order: 5,
      isActive: true,
    },
    {
      name: "Specials",
      description: "Chef's recommendations",
      icon: "⭐",
      order: 6,
      isActive: true,
    },
  ];

  const categoryIds = {};
  for (const category of categories) {
    const categoryRef = doc(collection(db, "clients", clientId, "categories"));
    await setDoc(categoryRef, {
      ...category,
      itemCount: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    categoryIds[category.name] = categoryRef.id;
  }
  console.log(`✅ ${categories.length} categories initialized`);
  return categoryIds;
};

/**
 * Initialize menu items
 */
const initMenuItems = async (clientId, categoryIds) => {
  const menuItems = [
    // Appetizers
    {
      categoryId: categoryIds["Appetizers"],
      name: "Bruschetta",
      description: "Toasted bread with tomatoes, basil, and mozzarella",
      price: 8.99,
      image:
        "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&h=300&fit=crop&q=80",
      isVegetarian: true,
      isSpicy: false,
      isActive: true,
    },
    {
      categoryId: categoryIds["Appetizers"],
      name: "Calamari Fritti",
      description: "Crispy fried squid with marinara sauce",
      price: 12.99,
      image:
        "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop&q=80",
      isVegetarian: false,
      isSpicy: false,
      isActive: true,
    },
    {
      categoryId: categoryIds["Appetizers"],
      name: "Spinach Artichoke Dip",
      description: "Creamy dip served with tortilla chips",
      price: 9.99,
      image:
        "https://images.unsplash.com/photo-1541529086526-db283c563270?w=400&h=300&fit=crop&q=80",
      isVegetarian: true,
      isSpicy: false,
      isActive: true,
    },
    {
      categoryId: categoryIds["Appetizers"],
      name: "Buffalo Wings",
      description: "Spicy chicken wings with blue cheese dip",
      price: 11.99,
      image:
        "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400&h=300&fit=crop&q=80",
      isVegetarian: false,
      isSpicy: true,
      isActive: true,
    },
    {
      categoryId: categoryIds["Appetizers"],
      name: "Stuffed Mushrooms",
      description: "Mushrooms filled with herbs and cheese",
      price: 10.99,
      image:
        "https://images.unsplash.com/photo-1622759858438-eb3416b05690?w=400&h=300&fit=crop&q=80",
      isVegetarian: true,
      isSpicy: false,
      isActive: true,
    },

    // Main Course
    {
      categoryId: categoryIds["Main Course"],
      name: "Grilled Ribeye Steak",
      description: "12oz ribeye with garlic mashed potatoes",
      price: 28.99,
      image:
        "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop&q=80",
      isVegetarian: false,
      isSpicy: false,
      isActive: true,
    },
    {
      categoryId: categoryIds["Main Course"],
      name: "Salmon Fillet",
      description: "Pan-seared salmon with lemon butter sauce",
      price: 24.99,
      image:
        "https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=400&h=300&fit=crop&q=80",
      isVegetarian: false,
      isSpicy: false,
      isActive: true,
    },
    {
      categoryId: categoryIds["Main Course"],
      name: "Chicken Parmesan",
      description: "Breaded chicken with marinara and mozzarella",
      price: 18.99,
      image:
        "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=400&h=300&fit=crop&q=80",
      isVegetarian: false,
      isSpicy: false,
      isActive: true,
    },
    {
      categoryId: categoryIds["Main Course"],
      name: "Vegetable Stir Fry",
      description: "Mixed vegetables in teriyaki sauce over rice",
      price: 15.99,
      image:
        "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop&q=80",
      isVegetarian: true,
      isSpicy: false,
      isActive: true,
    },

    // Desserts
    {
      categoryId: categoryIds["Desserts"],
      name: "Tiramisu",
      description: "Classic Italian coffee-flavored dessert",
      price: 7.99,
      image:
        "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop&q=80",
      isVegetarian: true,
      isSpicy: false,
      isActive: true,
    },
    {
      categoryId: categoryIds["Desserts"],
      name: "Chocolate Lava Cake",
      description: "Warm chocolate cake with molten center",
      price: 8.99,
      image:
        "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=300&fit=crop&q=80",
      isVegetarian: true,
      isSpicy: false,
      isActive: true,
    },
    {
      categoryId: categoryIds["Desserts"],
      name: "Cheesecake",
      description: "New York style cheesecake with berry compote",
      price: 7.49,
      image:
        "https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=400&h=300&fit=crop&q=80",
      isVegetarian: true,
      isSpicy: false,
      isActive: true,
    },

    // Beverages
    {
      categoryId: categoryIds["Beverages"],
      name: "Fresh Lemonade",
      description: "Homemade lemonade with mint",
      price: 3.99,
      image:
        "https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9b?w=400&h=300&fit=crop&q=80",
      isVegetarian: true,
      isSpicy: false,
      isActive: true,
    },
    {
      categoryId: categoryIds["Beverages"],
      name: "Cappuccino",
      description: "Espresso with steamed milk foam",
      price: 4.49,
      image:
        "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop&q=80",
      isVegetarian: true,
      isSpicy: false,
      isActive: true,
    },
    {
      categoryId: categoryIds["Beverages"],
      name: "Mango Smoothie",
      description: "Fresh mango blended with yogurt",
      price: 5.99,
      image:
        "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400&h=300&fit=crop&q=80",
      isVegetarian: true,
      isSpicy: false,
      isActive: true,
    },

    // Soups & Salads
    {
      categoryId: categoryIds["Soups & Salads"],
      name: "Caesar Salad",
      description: "Romaine lettuce with Caesar dressing and croutons",
      price: 9.99,
      image:
        "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop&q=80",
      isVegetarian: true,
      isSpicy: false,
      isActive: true,
    },
    {
      categoryId: categoryIds["Soups & Salads"],
      name: "Tomato Soup",
      description: "Creamy tomato soup with basil",
      price: 6.99,
      image:
        "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop&q=80",
      isVegetarian: true,
      isSpicy: false,
      isActive: true,
    },

    // Specials
    {
      categoryId: categoryIds["Specials"],
      name: "Chef's Tasting Menu",
      description: "5-course chef-selected experience",
      price: 65.0,
      image:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop&q=80",
      isVegetarian: false,
      isSpicy: false,
      isActive: true,
    },
    {
      categoryId: categoryIds["Specials"],
      name: "Surf & Turf",
      description: "Lobster tail and filet mignon combo",
      price: 49.99,
      image:
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop&q=80",
      isVegetarian: false,
      isSpicy: false,
      isActive: true,
    },
  ];

  for (const item of menuItems) {
    const itemRef = doc(collection(db, "clients", clientId, "menuItems"));
    await setDoc(itemRef, {
      ...item,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  }
  console.log(`✅ ${menuItems.length} menu items initialized`);
};

/**
 * Main initialization function
 * Call this once to populate Firestore with initial data
 */
export const initializeFirestoreData = async () => {
  try {
    console.log("🚀 Starting Firestore initialization...");
    const clientId = getClientId();
    console.log(`📍 Client ID: ${clientId}`);

    // Initialize in sequence
    await initRestaurantInfo(clientId);
    await initBanners(clientId);
    const categoryIds = await initCategories(clientId);
    await initMenuItems(clientId, categoryIds);

    console.log("✅ Firestore initialization complete!");
    console.log("🎉 Your restaurant data is ready!");
    console.log(
      "⚠️  Remember to remove the initialization call from your code."
    );

    return { success: true, clientId };
  } catch (error) {
    console.error("❌ Error initializing Firestore:", error);
    throw error;
  }
};

export default initializeFirestoreData;
