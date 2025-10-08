// Mock API service to simulate backend data
// In production, these would be actual API calls to your backend

/**
 * Simulates API delay
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock restaurant data
 */
const mockRestaurantData = {
  id: 1,
  name: "The Gourmet Kitchen",
  logo: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&h=200&fit=crop&q=80",
  description: "Fine dining experience with authentic flavors",
};

/**
 * Mock banner/slider data
 * Note: Using 'let' instead of 'const' to allow adding new banners
 */
let mockBanners = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=400&fit=crop&q=80",
    title: "Special Discount",
    description: "Get 20% off on all orders above $50",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=400&fit=crop&q=80",
    title: "New Menu Items",
    description: "Try our latest seasonal dishes",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=400&fit=crop&q=80",
    title: "Happy Hour",
    description: "Special prices from 4 PM to 7 PM",
  },
];

/**
 * Mock menu categories data
 * Note: Using 'let' instead of 'const' to allow adding new categories
 */
let mockMenuCategories = [
  {
    id: 1,
    name: "Appetizers",
    description: "Start your meal right",
    icon: "🥗",
    itemCount: 12,
    isActive: true,
  },
  {
    id: 2,
    name: "Main Course",
    description: "Our signature dishes",
    icon: "🍝",
    itemCount: 24,
    isActive: true,
  },
  {
    id: 3,
    name: "Desserts",
    description: "Sweet endings",
    icon: "🍰",
    itemCount: 10,
    isActive: true,
  },
  {
    id: 4,
    name: "Beverages",
    description: "Refresh yourself",
    icon: "🥤",
    itemCount: 18,
    isActive: true,
  },
  {
    id: 5,
    name: "Soups & Salads",
    description: "Healthy options",
    icon: "🥣",
    itemCount: 8,
    isActive: true,
  },
  {
    id: 6,
    name: "Specials",
    description: "Chef's recommendations",
    icon: "⭐",
    itemCount: 6,
    isActive: true,
  },
];

/**
 * Mock menu items data organized by category
 */
const mockMenuItems = {
  1: [
    // Appetizers
    {
      id: 101,
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
      id: 102,
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
      id: 103,
      name: "Spinach Artichoke Dip",
      description: "Creamy dip served with tortilla chips",
      price: 9.99,
      image:
        "https://images.unsplash.com/photo-1541529086526-db283c563270?w=400&h=300&fit=crop&q=80",
      isVegetarian: true,
      isSpicy: false,
    },
    {
      id: 104,
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
      id: 105,
      name: "Stuffed Mushrooms",
      description: "Mushrooms filled with herbs and cheese",
      price: 10.99,
      image:
        "https://images.unsplash.com/photo-1622759858438-eb3416b05690?w=400&h=300&fit=crop&q=80",
      isVegetarian: true,
      isSpicy: false,
    },
    {
      id: 106,
      name: "Shrimp Cocktail",
      description: "Chilled shrimp with cocktail sauce",
      price: 13.99,
      image:
        "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop&q=80",
      isVegetarian: false,
      isSpicy: false,
      isActive: true,
    },
    {
      id: 107,
      name: "Mozzarella Sticks",
      description: "Golden fried mozzarella with marinara",
      price: 7.99,
      image:
        "https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=400&h=300&fit=crop&q=80",
      isVegetarian: true,
      isSpicy: false,
    },
    {
      id: 108,
      name: "Spring Rolls",
      description: "Vegetable spring rolls with sweet chili sauce",
      price: 8.49,
      image:
        "https://images.unsplash.com/photo-1555500238-c7f1f0b69e70?w=400&h=300&fit=crop&q=80",
      isVegetarian: true,
      isSpicy: false,
    },
    {
      id: 109,
      name: "Nachos Supreme",
      description: "Tortilla chips with cheese, jalapeños, and salsa",
      price: 11.49,
      image:
        "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&h=300&fit=crop&q=80",
      isVegetarian: true,
      isSpicy: true,
      isActive: true,
    },
    {
      id: 110,
      name: "Chicken Satay",
      description: "Grilled chicken skewers with peanut sauce",
      price: 10.49,
      image:
        "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop&q=80",
      isVegetarian: false,
      isSpicy: false,
      isActive: true,
    },
    {
      id: 111,
      name: "Caprese Salad",
      description: "Fresh mozzarella, tomatoes, and basil",
      price: 9.49,
      image:
        "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=400&h=300&fit=crop&q=80",
      isVegetarian: true,
      isSpicy: false,
    },
    {
      id: 112,
      name: "Loaded Potato Skins",
      description: "Crispy potato skins with bacon and cheese",
      price: 9.99,
      image:
        "https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?w=400&h=300&fit=crop&q=80",
      isVegetarian: false,
      isSpicy: false,
      isActive: true,
    },
  ],
  2: [
    // Main Course
    {
      id: 201,
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
      id: 202,
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
      id: 203,
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
      id: 204,
      name: "Vegetable Stir Fry",
      description: "Mixed vegetables in teriyaki sauce over rice",
      price: 15.99,
      image:
        "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop&q=80",
      isVegetarian: true,
      isSpicy: false,
    },
    {
      id: 205,
      name: "BBQ Ribs",
      description: "Full rack of baby back ribs with coleslaw",
      price: 22.99,
      image:
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop&q=80",
      isVegetarian: false,
      isSpicy: false,
      isActive: true,
    },
    {
      id: 206,
      name: "Lobster Tail",
      description: "Butter-poached lobster tail with vegetables",
      price: 34.99,
      image:
        "https://images.unsplash.com/photo-1626074353765-517a4673e527?w=400&h=300&fit=crop&q=80",
      isVegetarian: false,
      isSpicy: false,
      isActive: true,
    },
    {
      id: 207,
      name: "Mushroom Risotto",
      description: "Creamy arborio rice with wild mushrooms",
      price: 17.99,
      image:
        "https://images.unsplash.com/photo-1476124369491-c3819b71f7e6?w=400&h=300&fit=crop&q=80",
      isVegetarian: true,
      isSpicy: false,
    },
    {
      id: 208,
      name: "Beef Tenderloin",
      description: "8oz filet mignon with béarnaise sauce",
      price: 32.99,
      image:
        "https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=300&fit=crop&q=80",
      isVegetarian: false,
      isSpicy: false,
      isActive: true,
    },
    {
      id: 209,
      name: "Shrimp Scampi",
      description: "Garlic butter shrimp over linguine",
      price: 21.99,
      image:
        "https://images.unsplash.com/photo-1633504581786-316c8002b1b9?w=400&h=300&fit=crop&q=80",
      isVegetarian: false,
      isSpicy: false,
      isActive: true,
    },
    {
      id: 210,
      name: "Eggplant Parmesan",
      description: "Breaded eggplant with marinara and cheese",
      price: 16.99,
      image:
        "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop&q=80",
      isVegetarian: true,
      isSpicy: false,
      isActive: true,
    },
  ],
  3: [
    // Desserts
    {
      id: 301,
      name: "Tiramisu",
      description: "Classic Italian coffee-flavored dessert",
      price: 7.99,
      image:
        "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop&q=80",
      isVegetarian: true,
      isSpicy: false,
    },
    {
      id: 302,
      name: "Chocolate Lava Cake",
      description: "Warm chocolate cake with molten center",
      price: 8.99,
      image:
        "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=300&fit=crop&q=80",
      isVegetarian: true,
      isSpicy: false,
    },
    {
      id: 303,
      name: "Cheesecake",
      description: "New York style cheesecake with berry compote",
      price: 7.49,
      image:
        "https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=400&h=300&fit=crop&q=80",
      isVegetarian: true,
      isSpicy: false,
    },
    {
      id: 304,
      name: "Crème Brûlée",
      description: "Vanilla custard with caramelized sugar",
      price: 8.49,
      image:
        "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400&h=300&fit=crop&q=80",
      isVegetarian: true,
      isSpicy: false,
    },
    {
      id: 305,
      name: "Apple Pie",
      description: "Homemade apple pie with vanilla ice cream",
      price: 6.99,
      image:
        "https://images.unsplash.com/photo-1535920527002-b35e96722eb9?w=400&h=300&fit=crop&q=80",
      isVegetarian: true,
      isSpicy: false,
    },
    {
      id: 306,
      name: "Panna Cotta",
      description: "Italian cream dessert with raspberry sauce",
      price: 7.99,
      image:
        "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop&q=80",
      isVegetarian: true,
      isSpicy: false,
    },
    {
      id: 307,
      name: "Brownie Sundae",
      description: "Warm brownie with ice cream and fudge",
      price: 8.99,
      image:
        "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=300&fit=crop&q=80",
      isVegetarian: true,
      isSpicy: false,
    },
    {
      id: 308,
      name: "Fruit Tart",
      description: "Pastry cream tart with fresh seasonal fruit",
      price: 7.49,
      image:
        "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=400&h=300&fit=crop&q=80",
      isVegetarian: true,
      isSpicy: false,
    },
    {
      id: 309,
      name: "Gelato Trio",
      description: "Three scoops of artisan gelato",
      price: 6.99,
      image:
        "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop&q=80",
      isVegetarian: true,
      isSpicy: false,
    },
    {
      id: 310,
      name: "Chocolate Mousse",
      description: "Rich dark chocolate mousse with whipped cream",
      price: 7.99,
      image:
        "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=400&h=300&fit=crop&q=80",
      isVegetarian: true,
      isSpicy: false,
      isActive: true,
    },
  ],
  4: [
    // Beverages
    {
      id: 401,
      name: "Fresh Lemonade",
      description: "Homemade lemonade with mint",
      price: 3.99,
      image:
        "https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9b?w=400&h=300&fit=crop&q=80",
      isVegetarian: true,
      isSpicy: false,
    },
    {
      id: 402,
      name: "Iced Tea",
      description: "Freshly brewed sweet or unsweetened",
      price: 2.99,
      image:
        "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop&q=80",
      isVegetarian: true,
      isSpicy: false,
    },
    {
      id: 403,
      name: "Cappuccino",
      description: "Espresso with steamed milk foam",
      price: 4.49,
      image:
        "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop&q=80",
      isVegetarian: true,
      isSpicy: false,
    },
    {
      id: 404,
      name: "Mango Smoothie",
      description: "Fresh mango blended with yogurt",
      price: 5.99,
      image:
        "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400&h=300&fit=crop&q=80",
      isVegetarian: true,
      isSpicy: false,
    },
    {
      id: 405,
      name: "Red Wine",
      description: "House red wine by the glass",
      price: 8.99,
      image:
        "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop&q=80",
      isVegetarian: true,
      isSpicy: false,
    },
    {
      id: 406,
      name: "Craft Beer",
      description: "Local craft beer on tap",
      price: 6.99,
      image:
        "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=300&fit=crop&q=80",
      isVegetarian: true,
      isSpicy: false,
    },
    {
      id: 407,
      name: "Mojito",
      description: "Rum, mint, lime, and soda",
      price: 9.99,
      image:
        "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=300&fit=crop&q=80",
      isVegetarian: true,
      isSpicy: false,
    },
    {
      id: 408,
      name: "Orange Juice",
      description: "Freshly squeezed orange juice",
      price: 4.99,
      image:
        "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop&q=80",
      isVegetarian: true,
      isSpicy: false,
    },
    {
      id: 409,
      name: "Espresso",
      description: "Double shot of rich espresso",
      price: 3.49,
      image:
        "https://images.unsplash.com/photo-1610632380989-680fe40816c6?w=400&h=300&fit=crop&q=80",
      isVegetarian: true,
      isSpicy: false,
    },
    {
      id: 410,
      name: "Hot Chocolate",
      description: "Rich chocolate with whipped cream",
      price: 4.49,
      image:
        "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400&h=300&fit=crop&q=80",
      isVegetarian: true,
      isSpicy: false,
      isActive: true,
    },
  ],
  5: [
    // Soups & Salads
    {
      id: 501,
      name: "Caesar Salad",
      description: "Romaine lettuce with Caesar dressing and croutons",
      price: 9.99,
      image:
        "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop&q=80",
      isVegetarian: true,
      isSpicy: false,
    },
    {
      id: 502,
      name: "Tomato Soup",
      description: "Creamy tomato soup with basil",
      price: 6.99,
      image:
        "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop&q=80",
      isVegetarian: true,
      isSpicy: false,
    },
    {
      id: 503,
      name: "Greek Salad",
      description: "Mixed greens with feta, olives, and cucumber",
      price: 10.99,
      image:
        "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop&q=80",
      isVegetarian: true,
      isSpicy: false,
    },
    {
      id: 504,
      name: "French Onion Soup",
      description: "Caramelized onions with cheese and croutons",
      price: 7.99,
      image:
        "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop&q=80",
      isVegetarian: true,
      isSpicy: false,
    },
    {
      id: 505,
      name: "Cobb Salad",
      description: "Mixed greens with chicken, bacon, egg, and avocado",
      price: 12.99,
      image:
        "https://images.unsplash.com/photo-1607532941433-304659e8198a?w=400&h=300&fit=crop&q=80",
      isVegetarian: false,
      isSpicy: false,
      isActive: true,
    },
    {
      id: 506,
      name: "Minestrone",
      description: "Italian vegetable soup with pasta",
      price: 6.49,
      image:
        "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop&q=80",
      isVegetarian: true,
      isSpicy: false,
    },
    {
      id: 507,
      name: "Quinoa Bowl",
      description: "Quinoa with roasted vegetables and tahini",
      price: 11.99,
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&q=80",
      isVegetarian: true,
      isSpicy: false,
    },
    {
      id: 508,
      name: "Chicken Noodle Soup",
      description: "Classic chicken soup with vegetables",
      price: 7.49,
      image:
        "https://images.unsplash.com/photo-1613844237701-8f3664fc2eff?w=400&h=300&fit=crop&q=80",
      isVegetarian: false,
      isSpicy: false,
      isActive: true,
    },
  ],
  6: [
    // Specials
    {
      id: 601,
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
      id: 602,
      name: "Surf & Turf",
      description: "Lobster tail and filet mignon combo",
      price: 49.99,
      image:
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop&q=80",
      isVegetarian: false,
      isSpicy: false,
      isActive: true,
    },
    {
      id: 603,
      name: "Truffle Pasta",
      description: "Fresh pasta with black truffle and parmesan",
      price: 29.99,
      image:
        "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop&q=80",
      isVegetarian: true,
      isSpicy: false,
    },
    {
      id: 604,
      name: "Wagyu Burger",
      description: "Premium wagyu beef burger with aged cheddar",
      price: 24.99,
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&q=80",
      isVegetarian: false,
      isSpicy: false,
      isActive: true,
    },
    {
      id: 605,
      name: "Seared Scallops",
      description: "Pan-seared scallops with cauliflower purée",
      price: 28.99,
      image:
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop&q=80",
      isVegetarian: false,
      isSpicy: false,
      isActive: true,
    },
    {
      id: 606,
      name: "Duck Confit",
      description: "Slow-cooked duck leg with cherry reduction",
      price: 26.99,
      image:
        "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400&h=300&fit=crop&q=80",
      isVegetarian: false,
      isSpicy: false,
      isActive: true,
    },
  ],
};

/**
 * Fetch restaurant information
 * @returns {Promise<Object>} Restaurant data
 */
export const fetchRestaurantInfo = async () => {
  await delay(500); // Simulate network delay
  return mockRestaurantData;
};

/**
 * Fetch promotional banners
 * @returns {Promise<Array>} Array of banner objects
 */
export const fetchBanners = async () => {
  await delay(600); // Simulate network delay
  return mockBanners;
};

/**
 * Fetch menu categories
 * @param {boolean} includeHidden - Whether to include hidden categories
 * @returns {Promise<Array>} Array of category objects
 */
export const fetchMenuCategories = async (includeHidden = false) => {
  await delay(700); // Simulate network delay
  if (includeHidden) {
    return mockMenuCategories;
  }
  // Filter out hidden categories for customer view
  return mockMenuCategories.filter((cat) => cat.isActive);
};

/**
 * Fetch menu items by category
 * @param {number} categoryId - Category ID
 * @param {boolean} includeHidden - Whether to include hidden items
 * @returns {Promise<Array>} Array of menu items
 */
export const fetchMenuItems = async (categoryId, includeHidden = false) => {
  await delay(500);
  const items = mockMenuItems[categoryId] || [];
  if (includeHidden) {
    return items;
  }
  // Filter out hidden items for customer view
  return items.filter((item) => item.isActive);
};

/**
 * Update a menu item
 * @param {Object} updatedItem - Updated menu item
 * @returns {Promise<Object>} Updated item
 */
export const updateMenuItem = async (updatedItem) => {
  await delay(500); // Simulate network delay

  // In production, this would make an API call to update the item in the backend
  // For now, we'll update it in our mock data

  // Find the category that contains this item
  for (const categoryId in mockMenuItems) {
    const itemIndex = mockMenuItems[categoryId].findIndex(
      (item) => item.id === updatedItem.id
    );

    if (itemIndex !== -1) {
      // Update the item in mock data
      mockMenuItems[categoryId][itemIndex] = updatedItem;
      return updatedItem;
    }
  }

  throw new Error("Item not found");
};

/**
 * Add a new category
 * @param {Object} categoryData - New category data (name, description, icon)
 * @returns {Promise<Object>} Created category
 */
export const addCategory = async (categoryData) => {
  await delay(500); // Simulate network delay

  // Generate new ID (highest ID + 1)
  const maxId = mockMenuCategories.reduce(
    (max, cat) => Math.max(max, cat.id),
    0
  );

  const newCategory = {
    id: maxId + 1,
    name: categoryData.name,
    description: categoryData.description,
    icon: categoryData.icon,
    itemCount: 0, // New categories start with 0 items
  };

  // Add to mock data
  mockMenuCategories.push(newCategory);

  // Initialize empty items array for this category
  mockMenuItems[newCategory.id] = [];

  return newCategory;
};

/**
 * Add a new banner
 * @param {Object} bannerData - New banner data (title, description, image)
 * @returns {Promise<Object>} Created banner
 */
export const addBanner = async (bannerData) => {
  await delay(500); // Simulate network delay

  // Generate new ID (highest ID + 1)
  const maxId = mockBanners.reduce(
    (max, banner) => Math.max(max, banner.id),
    0
  );

  const newBanner = {
    id: maxId + 1,
    title: bannerData.title,
    description: bannerData.description,
    image: bannerData.image,
  };

  // Add to mock data
  mockBanners.push(newBanner);

  return newBanner;
};

/**
 * Delete a banner
 * @param {number} bannerId - ID of banner to delete
 * @returns {Promise<boolean>} Success status
 */
export const deleteBanner = async (bannerId) => {
  await delay(300); // Simulate network delay
  
  const index = mockBanners.findIndex((banner) => banner.id === bannerId);
  
  if (index !== -1) {
    mockBanners.splice(index, 1);
    return true;
  }
  
  throw new Error("Banner not found");
};

/**
 * Toggle category visibility
 * @param {number} categoryId - Category ID
 * @returns {Promise<Object>} Updated category
 */
export const toggleCategoryVisibility = async (categoryId) => {
  await delay(300); // Simulate network delay
  
  const category = mockMenuCategories.find((cat) => cat.id === categoryId);
  
  if (category) {
    category.isActive = !category.isActive;
    return category;
  }
  
  throw new Error("Category not found");
};

/**
 * Toggle item visibility
 * @param {number} itemId - Item ID
 * @returns {Promise<Object>} Updated item
 */
export const toggleItemVisibility = async (itemId) => {
  await delay(300); // Simulate network delay
  
  // Find the item in all categories
  for (const categoryId in mockMenuItems) {
    const item = mockMenuItems[categoryId].find((item) => item.id === itemId);
    
    if (item) {
      item.isActive = !item.isActive;
      return item;
    }
  }
  
  throw new Error("Item not found");
};
