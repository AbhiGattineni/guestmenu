import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GuestLoginModal from "../components/GuestLoginModal";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  doc,
  getDoc,
} from "firebase/firestore";

const PublicMenuPage = ({ subdomain: propSubdomain, userId: propUserId }) => {
  const { subdomain: paramSubdomain } = useParams();
  const subdomain = propSubdomain || paramSubdomain;
  const { user, isAuthenticated, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [ownerProfile, setOwnerProfile] = useState(null);
  const [subdomainNotFound, setSubdomainNotFound] = useState(false);

  // Fetch menu data
  useEffect(() => {
    const fetchMenuData = async () => {
      if (!subdomain) {
        setLoading(false);
        return;
      }

      try {
        const db = getFirestore();

        // Get userId from subdomain if not provided as prop
        let userId = propUserId;

        // If propUserId is explicitly null (subdomain not found in App.js), show 404
        if (propUserId === null) {
          console.error("Subdomain not found in database");
          setSubdomainNotFound(true);
          setLoading(false);
          return;
        }

        // If userId is undefined, fetch from subdomain
        if (userId === undefined) {
          const subdomainDoc = await getDoc(doc(db, "subdomains", subdomain));
          if (subdomainDoc.exists()) {
            userId = subdomainDoc.data().userId;
          } else {
            console.error("Subdomain not found");
            setSubdomainNotFound(true);
            setLoading(false);
            return;
          }
        }

        // Fetch owner profile
        const profileDoc = await getDoc(
          doc(db, "users", userId, "profile", "data")
        );
        if (profileDoc.exists()) {
          setOwnerProfile(profileDoc.data());
        }

        // Fetch categories
        const categoriesRef = collection(db, "menus", userId, "categories");
        const categoriesSnapshot = await getDocs(query(categoriesRef));
        const categoriesData = categoriesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoriesData);

        // Fetch menu items
        const itemsRef = collection(db, "menus", userId, "items");
        const itemsSnapshot = await getDocs(query(itemsRef));
        const itemsData = itemsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItems(itemsData);

        // Debug logging
        console.log("Fetched data:", {
          userId,
          categories: categoriesData.length,
          items: itemsData.length,
          categoriesData,
          itemsData,
        });

        // Debug category matching
        if (itemsData.length > 0) {
          console.log("Category matching debug:");
          itemsData.forEach((item) => {
            console.log(`Item "${item.name}" has category: "${item.category}"`);
            const matchedCat = categoriesData.find(
              (cat) => cat.id === item.category || cat.name === item.category
            );
            console.log(
              `  Matches category: ${matchedCat ? matchedCat.name : "NONE"}`
            );
          });
        }
      } catch (error) {
        console.error("Error fetching menu data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, [subdomain, propUserId]);

  const handleAddToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      // Increase quantity
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      // Add new item
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const handleRemoveFromCart = (itemId) => {
    const existingItem = cart.find((cartItem) => cartItem.id === itemId);

    if (existingItem && existingItem.quantity > 1) {
      // Decrease quantity
      setCart(
        cart.map((cartItem) =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
      );
    } else {
      // Remove item
      setCart(cart.filter((cartItem) => cartItem.id !== itemId));
    }
  };

  const handleSubmitOrder = () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    // Submit order logic here
    console.log("Submitting order:", cart);
    alert("Order submitted successfully!");
    setCart([]);
    setIsCartOpen(false);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          {/* Animated icon container */}
          <div className="relative mx-auto mb-8 w-32 h-32">
            <div className="absolute inset-0 bg-white backdrop-blur-xl rounded-3xl border-2 border-gray-200 flex items-center justify-center shadow-xl">
              <span className="text-7xl animate-bounce">🍽️</span>
            </div>
          </div>

          {/* Loading spinner */}
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-gray-800 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>

          {/* Loading text */}
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
            Loading Menu
          </h2>
          <p className="text-gray-600 text-lg font-medium">
            Preparing something delicious for you...
          </p>
        </div>
      </div>
    );
  }

  if (!subdomain) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Subdomain not found
          </h1>
          <p className="text-gray-600">
            Please access this page from a valid subdomain.
          </p>
        </div>
      </div>
    );
  }

  // Show 404 if subdomain was not found in database
  if (subdomainNotFound) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center">
          {/* 404 Animation/GIF */}
          <div className="mb-8">
            <img
              src="https://media.giphy.com/media/14uQ3cOFteDaU/giphy.gif"
              alt="404 Not Found"
              className="mx-auto w-64 h-64 object-cover rounded-2xl shadow-2xl"
            />
          </div>

          {/* Error Message */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border border-gray-100">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Menu Not Found
            </h1>
            <p className="text-gray-600 text-lg mb-2">
              The menu{" "}
              <span className="font-semibold text-indigo-600">
                {subdomain}.guestmenu.com
              </span>{" "}
              doesn't exist.
            </p>
            <p className="text-gray-500">
              This subdomain hasn't been registered yet or may have been
              removed.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl transition duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Go to Homepage
            </a>
            {isAuthenticated ? (
              <a
                href="/dashboard"
                className="bg-white text-indigo-600 hover:bg-indigo-50 border-2 border-indigo-600 font-bold py-4 px-8 rounded-xl transition duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
                Go to Dashboard
              </a>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="bg-white text-indigo-600 hover:bg-indigo-50 border-2 border-indigo-600 font-bold py-4 px-8 rounded-xl transition duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3h6a3 3 0 013 3v1"
                  />
                </svg>
                Create Your Menu
              </button>
            )}
          </div>
        </div>

        {/* Guest Login Modal */}
        <GuestLoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={() => {
            console.log("Guest logged in successfully");
            setIsLoginModalOpen(false);
            window.location.href = "/dashboard";
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean Header with Subtle Shadow */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        {/* Clean top border */}
        <div className="h-1 bg-gray-900"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          {/* Header layout */}
          <div className="flex items-center justify-between gap-4">
            {/* Logo and Title */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Logo Container */}
              <div className="relative group">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gray-900 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-all duration-300 flex-shrink-0 border-2 border-gray-200">
                  {ownerProfile?.logo ? (
                    <img
                      src={ownerProfile.logo}
                      alt="Logo"
                      className="w-full h-full rounded-2xl object-cover"
                    />
                  ) : (
                    <span className="text-4xl sm:text-5xl">🍽️</span>
                  )}
                </div>
              </div>

              {/* Title */}
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 truncate mb-1 tracking-tight">
                  {ownerProfile?.name || subdomain}
                </h1>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                    <p className="text-xs sm:text-sm text-gray-700 font-bold truncate">
                      {subdomain}.guestmenu.com
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cart Button - Appealing Design */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative bg-white hover:bg-gray-50 p-3 sm:p-3.5 rounded-full transition-all duration-200 shadow-md hover:shadow-lg border-2 border-gray-200 hover:border-gray-900"
              >
                {/* Shopping Bag Icon */}
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7 text-gray-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>

                {/* Cart Count Badge */}
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[22px] h-[22px] flex items-center justify-center font-bold shadow-md">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* User Info Bar */}
          {isAuthenticated && (
            <div className="mt-5">
              <div className="flex items-center justify-between bg-white rounded-2xl px-5 py-4 border-2 border-gray-200 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white font-black text-lg shadow-md">
                      {(
                        user?.displayName?.[0] ||
                        user?.email?.[0] ||
                        "G"
                      ).toUpperCase()}
                    </div>
                    {/* Status indicator */}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                      <span className="text-xs">✓</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-base font-black text-gray-900">
                      {user?.displayName || user?.email?.split("@")[0]}
                    </p>
                    <p className="text-xs font-bold text-green-600 flex items-center gap-1">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                      Signed in
                    </p>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="bg-white hover:bg-red-50 text-red-600 hover:text-red-700 font-bold text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md border-2 border-red-200 hover:border-red-300"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 pb-28">
        {/* Empty State */}
        {items.length === 0 ? (
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="bg-white rounded-3xl shadow-lg p-12 sm:p-16 md:p-24 text-center border-2 border-gray-200 max-w-3xl">
              {/* Animated icon */}
              <div className="text-8xl sm:text-9xl mb-8">📋</div>

              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
                No Menu Items Yet
              </h2>
              <p className="text-gray-600 text-xl sm:text-2xl max-w-2xl mx-auto font-medium leading-relaxed">
                The host hasn't added any items to the menu yet.
                <br className="hidden sm:block" />
                Please check back later!
              </p>
            </div>
          </div>
        ) : (
          <div>
            {/* Menu Items Display */}
            {/* Show categories with items */}
            {categories.length > 0 &&
              categories.map((category) => {
                const categoryItems = items.filter(
                  (item) =>
                    item.category === category.id ||
                    item.category === category.name ||
                    item.category === category.id.replace(/-/g, " ")
                );

                if (categoryItems.length === 0) return null;

                return (
                  <div key={category.id} className="mb-8 sm:mb-10">
                    {/* Category Header - Subtle Design */}
                    <div className="mb-6">
                      <div className="flex items-center gap-3 py-3 px-2">
                        {/* Category title - subtle and smaller */}
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-700 tracking-tight">
                          {category.name}
                        </h2>
                        <div className="flex-1 h-px bg-gray-200"></div>
                      </div>
                    </div>
                    {/* Menu Items Grid - Mobile Friendly */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categoryItems.map((item) => {
                        const cartItem = cart.find((c) => c.id === item.id);
                        const cartQuantity = cartItem ? cartItem.quantity : 0;

                        return (
                          <div
                            key={item.id}
                            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200"
                          >
                            {/* Item Image */}
                            {item.imageURL && (
                              <div className="w-full h-40 sm:h-48 overflow-hidden bg-gray-100">
                                <img
                                  src={item.imageURL}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}

                            {/* Item Content */}
                            <div className="p-4">
                              {/* Item Header */}
                              <div className="mb-4">
                                <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2">
                                  {item.name}
                                </h3>
                                {item.description && (
                                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                    {item.description}
                                  </p>
                                )}
                              </div>

                              {/* Quantity Controls - Appealing Design */}
                              {cartQuantity === 0 ? (
                                <button
                                  onClick={() => handleAddToCart(item)}
                                  className="w-full bg-gray-900 hover:bg-gray-800 active:bg-gray-700 text-white font-semibold py-3.5 px-4 rounded-lg transition-colors duration-150 flex items-center justify-center gap-2 touch-manipulation"
                                >
                                  <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 4v16m8-8H4"
                                    />
                                  </svg>
                                  <span>Add to Cart</span>
                                </button>
                              ) : (
                                <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-3">
                                  {/* Minus Button */}
                                  <button
                                    onClick={() =>
                                      handleRemoveFromCart(item.id)
                                    }
                                    className="group relative flex-shrink-0 w-11 h-11 bg-white hover:bg-red-50 active:bg-red-100 rounded-full shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center touch-manipulation border-2 border-gray-200 hover:border-red-400"
                                  >
                                    <span className="text-2xl font-bold text-gray-700 group-hover:text-red-600 transition-colors">
                                      −
                                    </span>
                                  </button>

                                  {/* Quantity Display */}
                                  <div className="flex-1 text-center px-2">
                                    <div className="text-2xl font-black text-gray-900">
                                      {cartQuantity}
                                    </div>
                                  </div>

                                  {/* Plus Button */}
                                  <button
                                    onClick={() => handleAddToCart(item)}
                                    className="group relative flex-shrink-0 w-11 h-11 bg-white hover:bg-green-50 active:bg-green-100 rounded-full shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center touch-manipulation border-2 border-gray-200 hover:border-green-400"
                                  >
                                    <span className="text-2xl font-bold text-gray-700 group-hover:text-green-600 transition-colors">
                                      +
                                    </span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

            {/* Items without category */}
            {(categories.length === 0 ||
              items.filter((item) => !item.category || item.category === "")
                .length > 0) && (
              <div className="mb-8 sm:mb-10">
                {/* Category Header */}
                <div className="mb-4 sm:mb-6">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl sm:rounded-2xl p-4 shadow-md">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center">
                      {categories.length === 0 ? "Menu Items" : "Other Items"}
                    </h2>
                  </div>
                </div>

                {/* Menu Items Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {(categories.length === 0
                    ? items
                    : items.filter(
                        (item) => !item.category || item.category === ""
                      )
                  ).map((item) => {
                    const cartItem = cart.find((c) => c.id === item.id);
                    const cartQuantity = cartItem ? cartItem.quantity : 0;

                    return (
                      <div
                        key={item.id}
                        className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden border border-gray-200"
                      >
                        <div className="p-4">
                          <div className="mb-3">
                            <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1">
                              {item.name}
                            </h3>
                            {item.description && (
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {item.description}
                              </p>
                            )}
                          </div>

                          {/* Quantity Controls */}
                          {cartQuantity === 0 ? (
                            <button
                              onClick={() => handleAddToCart(item)}
                              className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold py-3 px-4 rounded-lg transition duration-150 shadow-md active:shadow-sm flex items-center justify-center gap-2"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 4v16m8-8H4"
                                />
                              </svg>
                              Add to Cart
                            </button>
                          ) : (
                            <div className="flex items-center justify-between bg-indigo-50 rounded-lg p-2 border-2 border-indigo-300">
                              <button
                                onClick={() => handleRemoveFromCart(item.id)}
                                className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-bold w-11 h-11 rounded-lg transition duration-150 shadow-md active:shadow-sm flex items-center justify-center"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20 12H4"
                                  />
                                </svg>
                              </button>
                              <span className="text-2xl sm:text-3xl font-bold text-indigo-600 px-3">
                                {cartQuantity}
                              </span>
                              <button
                                onClick={() => handleAddToCart(item)}
                                className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold w-11 h-11 rounded-lg transition duration-150 shadow-md active:shadow-sm flex items-center justify-center"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                  />
                                </svg>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Cart Modal - Modern Design */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center animate-fadeIn">
          <div className="w-full sm:max-w-lg max-h-[90vh] sm:max-h-[85vh] overflow-hidden animate-slideUp">
            <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              {/* Cart Header - Compact */}
              <div className="bg-gray-50 px-5 py-4 flex justify-between items-center border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 6H6.28l-.31-1.243A1 1 0 005 4H3z" />
                      <path d="M16 16a2 2 2 0 11-4 0 2 2 0 014 0zM4 12a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-900">Your Cart</h2>
                    <p className="text-xs text-gray-500">
                      {cartTotal} {cartTotal === 1 ? "item" : "items"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-white hover:bg-gray-800 transition-all duration-200 p-3 rounded-xl"
                >
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Cart Content */}
              <div
                className="p-6 sm:p-8 overflow-y-auto"
                style={{ maxHeight: "calc(90vh - 200px)" }}
              >
                {cart.length === 0 ? (
                  <div className="text-center py-16 sm:py-20">
                    <div className="text-7xl sm:text-8xl mb-6">🛒</div>
                    <p className="text-gray-900 text-xl sm:text-2xl font-black mb-2">
                      Your cart is empty
                    </p>
                    <p className="text-gray-600 text-base sm:text-lg font-medium">
                      Add items from the menu to get started!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-gray-200 hover:border-gray-300 shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        {/* Item Name and Controls */}
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-black text-gray-900 text-lg sm:text-xl truncate mb-1">
                              {item.name}
                            </h3>
                            {item.description && (
                              <p className="text-sm text-gray-600 line-clamp-1 font-medium">
                                {item.description}
                              </p>
                            )}
                          </div>

                          {/* Quantity controls */}
                          <div className="flex items-center gap-3 flex-shrink-0 bg-gray-100 rounded-xl p-2 border-2 border-gray-300">
                            <button
                              onClick={() => handleRemoveFromCart(item.id)}
                              className="w-10 h-10 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-xl flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth={3}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M20 12H4"
                                />
                              </svg>
                            </button>

                            <span className="text-2xl font-black text-gray-900 min-w-[2.5rem] text-center">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() => handleAddToCart(item)}
                              className="w-10 h-10 bg-green-600 hover:bg-green-700 active:scale-95 text-white rounded-xl flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth={3}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12 4v16m8-8H4"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className="border-t-2 border-gray-200 px-6 sm:px-8 py-6 bg-gray-50">
                  {/* Total items display */}
                  <div className="mb-5 flex justify-between items-center bg-white rounded-2xl p-5 border-2 border-gray-300 shadow-md">
                    <span className="text-lg sm:text-xl font-black text-gray-900">
                      Total Items:
                    </span>
                    <span className="text-4xl sm:text-5xl font-black text-gray-900">
                      {cartCount}
                    </span>
                  </div>

                  {/* Submit order button */}
                  <button
                    onClick={handleSubmitOrder}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-5 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl active:shadow-md transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                  >
                    <svg
                      className="w-6 h-6 sm:w-7 sm:h-7"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-xl sm:text-2xl">Submit Order</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Sign In Button - Compact with Hover */}
      {!isAuthenticated && (
        <div className="fixed bottom-24 right-5 sm:bottom-8 sm:right-8 z-50">
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="group bg-gray-900 hover:bg-gray-800 text-white font-semibold p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-0 hover:gap-2 overflow-hidden hover:px-6 border-2 border-gray-200"
            title="Sign in to place order"
          >
            {/* Icon */}
            <svg
              className="w-6 h-6 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3h6a3 3 0 013 3v1"
              />
            </svg>

            {/* Text - Shows on Hover */}
            <span className="max-w-0 group-hover:max-w-xs opacity-0 group-hover:opacity-100 whitespace-nowrap transition-all duration-300 overflow-hidden">
              Sign In
            </span>
          </button>
        </div>
      )}

      {/* Guest Login Modal */}
      <GuestLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => {
          // Refresh menu items after login
          console.log("Guest logged in successfully");
          setIsLoginModalOpen(false);
        }}
      />
    </div>
  );
};

export default PublicMenuPage;
