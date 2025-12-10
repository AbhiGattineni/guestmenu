import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GuestLoginModal from "../components/GuestLoginModal";
import MenuItemCard from "../components/MenuItemCard";
import { createOrder, getUserOrders } from "../services/firebaseService";
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
  const location = useLocation();
  const navigate = useNavigate();
  const subdomain = propSubdomain || paramSubdomain;

  // Helper function to get display URL based on current hostname
  const getDisplayUrl = () => {
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "localhost";
    }
    return hostname;
  };
  const { user, isAuthenticated, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [ownerProfile, setOwnerProfile] = useState(null);
  const [subdomainNotFound, setSubdomainNotFound] = useState(false);
  const [hostUserId, setHostUserId] = useState(null);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Order history state
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Determine current view based on route
  const currentView = location.pathname === "/orders" ? "orders" : "menu";

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

        // Store hostUserId for order creation
        setHostUserId(userId);

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
      } catch (error) {
        console.error("Error fetching menu data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, [subdomain, propUserId]);

  // Fetch orders when on orders view
  useEffect(() => {
    if (currentView === "orders" && isAuthenticated && user) {
      const fetchOrders = async () => {
        try {
          setLoadingOrders(true);
          const userOrders = await getUserOrders(user.uid);
          setOrders(userOrders);
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchOrders();
    }
  }, [currentView, isAuthenticated, user]);

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

  const handleSubmitOrder = async () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    if (!user || !hostUserId || cart.length === 0) {
      setOrderError("Unable to submit order. Please try again.");
      return;
    }

    try {
      setSubmittingOrder(true);
      setOrderError(null); // Clear any previous errors

      // Calculate total items
      const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

      // Prepare order data
      const orderData = {
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          quantity: item.quantity,
          imageURL: item.imageURL || null,
        })),
        subdomain,
        restaurantName: ownerProfile?.name || subdomain,
        totalItems,
        customerName: user.displayName || user.email?.split("@")[0] || "Guest",
        customerEmail: user.email || null,
      };

      // Save order to Firebase
      await createOrder(hostUserId, user.uid, orderData);

      // Clear cart and close modal
      setCart([]);
      setIsCartOpen(false);
      setOrderSuccess(true);

      // Auto-hide success banner after 5 seconds
      setTimeout(() => {
        setOrderSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Error submitting order:", error);
      setOrderError(
        error.message || "Failed to submit order. Please try again."
      );
    } finally {
      setSubmittingOrder(false);
    }
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
                {getDisplayUrl()}
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
            setIsLoginModalOpen(false);
            window.location.href = "/dashboard";
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Banner */}
      {orderSuccess && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-green-600 text-white px-4 py-3 shadow-lg animate-slideDown">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="font-semibold">Order submitted successfully!</p>
            </div>
            <button
              onClick={() => setOrderSuccess(false)}
              className="hover:bg-green-700 rounded-lg p-1 transition-colors"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Clean Header with Subtle Shadow */}
      <header
        className={`sticky ${
          orderSuccess ? "top-12" : "top-0"
        } z-40 bg-white border-b border-gray-200 shadow-sm transition-all duration-300`}
      >
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
                      {getDisplayUrl()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Orders Button - Only show when authenticated and on menu view */}
              {isAuthenticated && currentView === "menu" && (
                <button
                  onClick={() => {
                    navigate("/orders");
                  }}
                  className="bg-white hover:bg-gray-50 p-3 sm:p-3.5 rounded-full transition-all duration-200 shadow-md hover:shadow-lg border-2 border-gray-200 hover:border-gray-900"
                  title="View Orders"
                >
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
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </button>
              )}

              {/* Back to Menu Button - Only show when on orders view */}
              {currentView === "orders" && (
                <button
                  onClick={() => navigate("/")}
                  className="bg-white hover:bg-gray-50 p-3 sm:p-3.5 rounded-full transition-all duration-200 shadow-md hover:shadow-lg border-2 border-gray-200 hover:border-gray-900"
                  title="Back to Menu"
                >
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
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                </button>
              )}

              {/* Logout Button - Only show when authenticated */}
              {isAuthenticated && (
                <button
                  onClick={logout}
                  className="bg-white hover:bg-gray-50 p-3 sm:p-3.5 rounded-full transition-all duration-200 shadow-md hover:shadow-lg border-2 border-gray-200 hover:border-gray-900"
                  title="Logout"
                >
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
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </button>
              )}

              {/* Cart Button - Appealing Design */}
              <div className="relative">
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
                    <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full min-w-[22px] h-[22px] flex items-center justify-center font-bold shadow-md">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 pb-28">
        {/* Orders View */}
        {currentView === "orders" ? (
          <div>
            {loadingOrders ? (
              <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                  <p className="mt-4 text-gray-600">Loading orders...</p>
                </div>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <p className="text-gray-900 text-xl font-bold mb-2">
                  No orders yet
                </p>
                <p className="text-gray-500">
                  Your order history will appear here once you place an order.
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="mt-6 bg-black hover:bg-gray-800 text-white font-semibold py-2.5 px-5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Back to Menu
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Your Orders
                  </h2>
                  <p className="text-gray-600">View all your past orders</p>
                </div>
                <div className="space-y-4">
                  {orders.map((order) => {
                    const formatDate = (timestamp) => {
                      if (!timestamp) return "N/A";
                      const date = timestamp.toDate
                        ? timestamp.toDate()
                        : new Date(timestamp);
                      return date.toLocaleString();
                    };

                    const getStatusColor = (status) => {
                      switch (status) {
                        case "pending":
                          return "bg-yellow-100 text-yellow-800 border-yellow-200";
                        case "confirmed":
                          return "bg-blue-100 text-blue-800 border-blue-200";
                        case "completed":
                          return "bg-green-100 text-green-800 border-green-200";
                        case "cancelled":
                          return "bg-red-100 text-red-800 border-red-200";
                        default:
                          return "bg-gray-100 text-gray-800 border-gray-200";
                      }
                    };

                    return (
                      <div
                        key={order.id}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
                      >
                        {/* Order Header */}
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between flex-wrap gap-4">
                          <div className="flex items-center gap-4 flex-wrap">
                            <div>
                              <p className="text-sm text-gray-500">Order ID</p>
                              <p className="text-sm font-mono text-gray-900">
                                {order.orderId || order.id.slice(0, 8)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Restaurant
                              </p>
                              <p className="text-sm font-semibold text-gray-900">
                                {order.restaurantName || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Date</p>
                              <p className="text-sm text-gray-900">
                                {formatDate(order.createdAt)}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status || "pending"}
                          </span>
                        </div>

                        {/* Order Items */}
                        <div className="px-6 py-4">
                          <div className="space-y-3">
                            {order.items?.map((item, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-4 pb-3 border-b border-gray-100 last:border-0 last:pb-0"
                              >
                                {item.imageURL && (
                                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                    <img
                                      src={item.imageURL}
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-gray-900 truncate">
                                    {item.name}
                                  </p>
                                  {item.description && (
                                    <p className="text-sm text-gray-500 line-clamp-1">
                                      {item.description}
                                    </p>
                                  )}
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <p className="text-sm font-semibold text-gray-900">
                                    Qty: {item.quantity}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Order Summary */}
                          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                            <span className="text-sm text-gray-500">
                              Total Items
                            </span>
                            <span className="text-lg font-bold text-gray-900">
                              {order.totalItems || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Menu View */}
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                          {categoryItems.map((item) => {
                            const cartItem = cart.find((c) => c.id === item.id);
                            const cartQuantity = cartItem
                              ? cartItem.quantity
                              : 0;

                            return (
                              <MenuItemCard
                                key={item.id}
                                item={item}
                                cartQuantity={cartQuantity}
                                onAddToCart={handleAddToCart}
                                onRemoveFromCart={handleRemoveFromCart}
                              />
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
                      <div className="bg-gray-900 rounded-xl sm:rounded-2xl p-4 shadow-sm">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center">
                          {categories.length === 0
                            ? "Menu Items"
                            : "Other Items"}
                        </h2>
                      </div>
                    </div>

                    {/* Menu Items Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {(categories.length === 0
                        ? items
                        : items.filter(
                            (item) => !item.category || item.category === ""
                          )
                      ).map((item) => {
                        const cartItem = cart.find((c) => c.id === item.id);
                        const cartQuantity = cartItem ? cartItem.quantity : 0;

                        return (
                          <MenuItemCard
                            key={item.id}
                            item={item}
                            cartQuantity={cartQuantity}
                            onAddToCart={handleAddToCart}
                            onRemoveFromCart={handleRemoveFromCart}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Cart Modal - Minimal Design */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
          <div className="w-full sm:max-w-lg max-h-[90vh] sm:max-h-[85vh] overflow-hidden bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-gray-100 flex flex-col">
            {/* Cart Header */}
            <div className="px-5 sm:px-6 py-4 sm:py-5 flex justify-between items-center border-b border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
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
                  <h2 className="text-lg font-bold text-gray-900">Your Cart</h2>
                  <p className="text-xs text-gray-500">
                    {cartTotal} {cartTotal === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setOrderError(null); // Clear error when closing modal
                }}
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
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
            <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 sm:py-6">
              {cart.length === 0 ? (
                <div className="text-center py-16 sm:py-20">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-900 text-xl sm:text-2xl font-bold mb-2">
                    Your cart is empty
                  </p>
                  <p className="text-gray-500 text-sm sm:text-base">
                    Add items from the menu to get started!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl p-4 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200"
                    >
                      {/* Item Info */}
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 text-base sm:text-lg truncate mb-1">
                            {item.name}
                          </h3>
                          {item.description && (
                            <p className="text-sm text-gray-500 line-clamp-1">
                              {item.description}
                            </p>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 flex-shrink-0 bg-gray-50 rounded-xl p-2 border border-gray-100">
                          <button
                            onClick={() => handleRemoveFromCart(item.id)}
                            className="w-9 h-9 bg-white hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-all duration-200 flex items-center justify-center border border-gray-200 hover:border-gray-300 shadow-sm"
                          >
                            <svg
                              className="w-4 h-4 text-gray-700"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              strokeWidth={2.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M20 12H4"
                              />
                            </svg>
                          </button>

                          <span className="text-lg font-bold text-gray-900 min-w-[2rem] text-center">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => handleAddToCart(item)}
                            className="w-9 h-9 bg-white hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-all duration-200 flex items-center justify-center border border-gray-200 hover:border-gray-300 shadow-sm"
                          >
                            <svg
                              className="w-4 h-4 text-gray-700"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              strokeWidth={2.5}
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
              <div className="border-t border-gray-200 px-5 sm:px-6 py-5 sm:py-6 bg-white">
                {/* Error Message */}
                {orderError && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-red-900 mb-1">
                          Order Failed
                        </p>
                        <p className="text-sm text-red-700">{orderError}</p>
                      </div>
                      <button
                        onClick={() => setOrderError(null)}
                        className="text-red-600 hover:text-red-800 flex-shrink-0"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {/* Total items display */}
                <div className="mb-4 flex justify-between items-center bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <span className="text-base sm:text-lg font-bold text-gray-900">
                    Total Items:
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {cartCount}
                  </span>
                </div>

                {/* Submit order button */}
                <button
                  onClick={handleSubmitOrder}
                  disabled={submittingOrder}
                  className="w-full bg-black hover:bg-gray-800 active:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                >
                  {submittingOrder ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span className="text-base sm:text-lg">
                        Submitting...
                      </span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
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
                      <span className="text-base sm:text-lg">Submit Order</span>
                    </>
                  )}
                </button>
              </div>
            )}
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
