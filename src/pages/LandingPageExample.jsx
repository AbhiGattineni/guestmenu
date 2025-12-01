import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import RestaurantLogo from "../components/RestaurantLogo";
import PromoSlider from "../components/PromoSlider";
import MenuCategories from "../components/MenuCategories";
import CategoryDetail from "../components/CategoryDetail";
import LoginModal from "../components/LoginModal";
import AdminPanel from "../components/AdminPanel";
import {
  fetchRestaurantInfo,
  fetchBanners,
  fetchMenuCategories,
} from "../services/firebaseService";

/**
 * LandingPage Component (Tailwind Version)
 * Main landing page that displays when user scans the QR code
 * Shows restaurant logo, promotional banners, and menu categories
 * Mobile-first design with beautiful gradients and animations
 */
const LandingPage = () => {
  const { isAuthenticated, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [restaurantInfo, setRestaurantInfo] = useState(null);
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);

  // Fetch all data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all data in parallel
        const [restaurantData, bannersData, categoriesData] = await Promise.all(
          [fetchRestaurantInfo(), fetchBanners(), fetchMenuCategories()]
        );

        setRestaurantInfo(restaurantData);
        setBanners(bannersData);
        setCategories(categoriesData);
      } catch (err) {
        console.error("Error fetching data:", err);
        // Show specific error message if store doesn't exist
        if (err.message && err.message.includes("does not exist")) {
          setError(err.message);
        } else {
          setError("Failed to load menu. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Handle category click
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    // Scroll to top when showing category details
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle back to categories
  const handleBackToCategories = () => {
    setSelectedCategory(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    setAdminPanelOpen(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-800 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading menu...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center px-4 bg-gray-50">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-red-600 mb-3">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 bg-gradient-to-r from-amber-800 to-amber-600 hover:from-amber-900 hover:to-amber-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Restaurant Logo Section */}
      {restaurantInfo && (
        <RestaurantLogo
          logo={restaurantInfo.logo}
          name={restaurantInfo.name}
          description={restaurantInfo.description}
        />
      )}

      {/* Promotional Banners Slider - Only show on main view */}
      {!selectedCategory && <PromoSlider banners={banners} />}

      {/* Conditional Rendering: Categories or Category Detail */}
      {selectedCategory ? (
        <CategoryDetail
          category={selectedCategory}
          onBack={handleBackToCategories}
        />
      ) : (
        <MenuCategories
          categories={categories}
          onCategoryClick={handleCategoryClick}
        />
      )}

      {/* Floating Action Buttons - Mobile Optimized */}
      <div className="fixed bottom-6 right-4 sm:right-6 flex flex-col gap-3 z-50">
        {isAuthenticated ? (
          <>
            {/* Admin Panel Button */}
            <button
              onClick={() => setAdminPanelOpen(true)}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-800 to-amber-600 hover:from-amber-900 hover:to-amber-700 text-white shadow-2xl transition duration-200 transform hover:scale-110 active:scale-95 flex items-center justify-center"
              title="Admin Panel"
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-14 h-14 rounded-full bg-gray-700 hover:bg-gray-800 text-white shadow-2xl transition duration-200 transform hover:scale-110 active:scale-95 flex items-center justify-center"
              title="Logout"
            >
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </>
        ) : (
          /* Login Button */
          <button
            onClick={() => setLoginModalOpen(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-800 to-amber-600 hover:from-amber-900 hover:to-amber-700 text-white shadow-2xl transition duration-200 transform hover:scale-110 active:scale-95 flex items-center justify-center"
            title="Login"
          >
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
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3h6a3 3 0 013 3v1"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-amber-50 py-8 text-center mt-12 border-t-4 border-amber-800">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-base sm:text-lg font-medium tracking-wide mb-2">
            © 2025 {restaurantInfo?.name || "Restaurant"}. All rights reserved.
          </p>
          <p className="text-xs sm:text-sm text-amber-200 opacity-90">
            Powered by MenuScanner ✨
          </p>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />

      {/* Admin Panel */}
      <AdminPanel
        open={adminPanelOpen}
        onClose={() => setAdminPanelOpen(false)}
      />
    </div>
  );
};

export default LandingPage;
