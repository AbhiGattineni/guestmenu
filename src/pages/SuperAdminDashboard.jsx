import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationModal from "../components/NotificationModal";
import ConfirmDialog from "../components/ConfirmDialog";
import {
  getAllBusinesses,
  getBusinessStatistics,
} from "../services/superAdminService";
import {
  setUserRole,
  deleteUser,
  getUserRoleInfo,
} from "../services/roleManagementService";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

const SuperAdminDashboard = () => {
  const { user, logout, isSuperAdminUser } = useAuth();
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("menu-management"); // "menu-management" or "businesses" or "users"

  // Onboarding form states
  const [onboardForm, setOnboardForm] = useState({
    email: "",
    name: "",
    subdomain: "",
    logo: null,
  });
  const [routeError, setRouteError] = useState("");
  const [onboardLoading, setOnboardLoading] = useState(false);
  const [onboardSuccess, setOnboardSuccess] = useState("");

  // Menu item management states
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [businessCategories, setBusinessCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategoryIndex, setEditingCategoryIndex] = useState(null);
  const [editingCategoryValue, setEditingCategoryValue] = useState("");

  // Notification modal states
  const [notification, setNotification] = useState({
    isOpen: false,
    type: "success",
    message: "",
  });

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const [menuItemForm, setMenuItemForm] = useState({
    name: "",
    description: "",
    category: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [businessMenuItems, setBusinessMenuItems] = useState([]);
  const [itemLoading, setItemLoading] = useState(false);
  const [itemSuccess, setItemSuccess] = useState("");

  // Role management states
  const [userRoles, setUserRoles] = useState({}); // { userId: { role, subdomain } }
  const [editingUser, setEditingUser] = useState(null);
  const [editRoleModalOpen, setEditRoleModalOpen] = useState(false);
  const [editRoleForm, setEditRoleForm] = useState({
    role: "guest",
    subdomain: "",
  });
  const [roleLoading, setRoleLoading] = useState(false);

  useEffect(() => {
    // Redirect if not super admin
    if (!isSuperAdminUser) {
      navigate("/dashboard");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const statsData = await getBusinessStatistics();
        setStats(statsData);
        setBusinesses(statsData.businesses);
        setUsers(statsData.users);

        // Fetch user roles
        await fetchUserRoles(statsData.users);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isSuperAdminUser, navigate]);

  // Fetch user roles from custom claims
  const fetchUserRoles = async (usersList) => {
    const rolesMap = {};
    for (const userData of usersList) {
      try {
        const roleInfo = await getUserRoleInfo(userData.userId);
        rolesMap[userData.userId] = roleInfo;
      } catch (err) {
        console.error(`Error fetching role for user ${userData.userId}:`, err);
        // Default to guest if error
        rolesMap[userData.userId] = { role: "guest", subdomain: null };
      }
    }
    setUserRoles(rolesMap);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  // Validate subdomain availability
  const validateSubdomain = async (subdomain) => {
    if (!subdomain) {
      setRouteError("");
      return;
    }

    const db = getFirestore();
    try {
      const subdomainDoc = await getDoc(doc(db, "subdomains", subdomain));
      if (subdomainDoc.exists()) {
        setRouteError(
          "This subdomain is already taken. Please choose another."
        );
      } else {
        setRouteError("");
      }
    } catch (err) {
      console.error("Error checking subdomain:", err);
    }
  };

  // Show notification helper
  const showNotification = (type, message) => {
    setNotification({
      isOpen: true,
      type,
      message,
    });
  };

  const closeNotification = () => {
    setNotification({
      ...notification,
      isOpen: false,
    });
  };

  // Role management functions
  const handleEditRole = (userData) => {
    const currentRole = userRoles[userData.userId] || {
      role: "guest",
      subdomain: null,
    };
    setEditingUser(userData);
    setEditRoleForm({
      role: currentRole.role || "guest",
      subdomain: currentRole.subdomain || "",
    });
    setEditRoleModalOpen(true);
  };

  const handleSaveRole = async () => {
    if (!editingUser) return;

    try {
      setRoleLoading(true);
      const { role, subdomain } = editRoleForm;

      if (role === "host" && !subdomain) {
        showNotification("error", "Please select a subdomain for host role.");
        setRoleLoading(false);
        return;
      }

      await setUserRole(
        editingUser.userId,
        role,
        role === "host" ? subdomain : null
      );

      // Update local state
      setUserRoles({
        ...userRoles,
        [editingUser.userId]: {
          role,
          subdomain: role === "host" ? subdomain : null,
        },
      });

      showNotification("success", `User role updated to ${role} successfully!`);
      setEditRoleModalOpen(false);
      setEditingUser(null);
      setEditRoleForm({ role: "guest", subdomain: "" });
    } catch (err) {
      console.error("Error updating user role:", err);
      showNotification("error", err.message || "Failed to update user role.");
    } finally {
      setRoleLoading(false);
    }
  };

  const handleDeleteUserClick = (userData) => {
    // Prevent deletion of super admin
    if (userData.profile?.email === "guestmenu0@gmail.com") {
      showNotification("error", "Cannot delete super admin user.");
      return;
    }

    setConfirmDialog({
      isOpen: true,
      title: "Delete User",
      message: `Are you sure you want to delete user "${
        userData.profile?.name || userData.profile?.email || userData.userId
      }"? This action cannot be undone and will delete all associated data.`,
      onConfirm: async () => {
        try {
          await deleteUser(userData.userId);
          showNotification("success", "User deleted successfully!");
          // Refresh users list
          const statsData = await getBusinessStatistics();
          setUsers(statsData.users);
          setBusinesses(statsData.businesses);
          // Remove from roles map
          const newRoles = { ...userRoles };
          delete newRoles[userData.userId];
          setUserRoles(newRoles);
        } catch (err) {
          console.error("Error deleting user:", err);
          showNotification("error", err.message || "Failed to delete user.");
        }
      },
    });
  };

  // Category management functions for selected business
  const handleAddCategory = async () => {
    if (!selectedBusiness || !newCategory.trim()) return;

    // Check for duplicates
    const isDuplicate = businessCategories.some(
      (cat) => cat.name.toLowerCase() === newCategory.trim().toLowerCase()
    );
    if (isDuplicate) {
      showNotification("error", "This category already exists!");
      return;
    }

    try {
      const db = getFirestore();
      const categoryId = newCategory.trim().toLowerCase().replace(/\s+/g, "-");

      await setDoc(
        doc(db, "menus", selectedBusiness.userId, "categories", categoryId),
        {
          name: newCategory.trim(),
          createdAt: new Date(),
        }
      );

      // Refresh categories
      await handleSelectBusinessForMenu(selectedBusiness);
      setNewCategory("");
      showNotification("success", "Category added successfully!");
    } catch (error) {
      console.error("Error adding category:", error);
      showNotification("error", "Failed to add category. Please try again.");
    }
  };

  const handleEditCategory = (index) => {
    setEditingCategoryIndex(index);
    setEditingCategoryValue(businessCategories[index].name);
  };

  const handleSaveEditCategory = async (index) => {
    if (!selectedBusiness || !editingCategoryValue.trim()) return;

    const category = businessCategories[index];

    try {
      const db = getFirestore();

      // Update the category name
      await setDoc(
        doc(db, "menus", selectedBusiness.userId, "categories", category.id),
        {
          name: editingCategoryValue.trim(),
          createdAt: category.createdAt,
        }
      );

      // Refresh categories
      await handleSelectBusinessForMenu(selectedBusiness);
      setEditingCategoryIndex(null);
      setEditingCategoryValue("");
      showNotification("success", "Category updated successfully!");
    } catch (error) {
      console.error("Error updating category:", error);
      showNotification("error", "Failed to update category. Please try again.");
    }
  };

  const handleCancelEditCategory = () => {
    setEditingCategoryIndex(null);
    setEditingCategoryValue("");
  };

  const handleDeleteCategory = async (index) => {
    if (!selectedBusiness) return;

    const category = businessCategories[index];

    setConfirmDialog({
      isOpen: true,
      title: "Delete Category",
      message: `Are you sure you want to delete the category "${category.name}"? This will not delete the menu items in this category.`,
      onConfirm: async () => {
        try {
          const db = getFirestore();
          await deleteDoc(
            doc(db, "menus", selectedBusiness.userId, "categories", category.id)
          );

          // Refresh categories
          await handleSelectBusinessForMenu(selectedBusiness);
          showNotification("success", "Category deleted successfully!");
        } catch (error) {
          console.error("Error deleting category:", error);
          showNotification(
            "error",
            "Failed to delete category. Please try again."
          );
        }
      },
    });
  };

  // Handle onboarding form submission
  const handleOnboardMenu = async (e) => {
    e.preventDefault();
    setOnboardLoading(true);
    setOnboardSuccess("");
    setError("");

    const db = getFirestore();
    const storage = getStorage();

    try {
      // Validate subdomain one more time
      const subdomainDoc = await getDoc(
        doc(db, "subdomains", onboardForm.subdomain)
      );
      if (subdomainDoc.exists()) {
        setRouteError(
          "This subdomain is already taken. Please choose another."
        );
        setOnboardLoading(false);
        return;
      }

      // Create a temporary user ID (in real scenario, you'd create actual user account)
      const tempUserId = `temp_${Date.now()}`;

      // Upload logo if provided
      let logoURL = null;
      if (onboardForm.logo) {
        const logoRef = ref(
          storage,
          `logos/${onboardForm.subdomain}/${onboardForm.logo.name}`
        );
        await uploadBytes(logoRef, onboardForm.logo);
        logoURL = await getDownloadURL(logoRef);
      }

      // Create subdomain entry
      await setDoc(doc(db, "subdomains", onboardForm.subdomain), {
        userId: tempUserId,
        subdomain: onboardForm.subdomain,
        createdAt: new Date(),
        createdBy: user.email,
      });

      // Create user profile
      await setDoc(doc(db, "users", tempUserId), {
        email: onboardForm.email,
        createdAt: new Date(),
        emailVerified: false,
      });

      await setDoc(doc(db, "users", tempUserId, "profile", "data"), {
        name: onboardForm.name,
        email: onboardForm.email,
        subdomain: onboardForm.subdomain,
        logo: logoURL,
      });

      setOnboardSuccess(
        `Successfully onboarded ${onboardForm.subdomain}.guestmenu.com! Select it below to add categories and menu items.`
      );

      // Reset form
      setOnboardForm({
        email: "",
        name: "",
        subdomain: "",
        logo: null,
      });

      // Refresh businesses list
      const updatedStats = await getBusinessStatistics();
      setStats(updatedStats);
      setBusinesses(updatedStats.businesses);
      setUsers(updatedStats.users);

      // Refresh data
      const statsData = await getBusinessStatistics();
      setStats(statsData);
      setBusinesses(statsData.businesses);
      setUsers(statsData.users);
    } catch (err) {
      console.error("Error onboarding menu:", err);
      setError("Failed to onboard menu. Please try again.");
    } finally {
      setOnboardLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setOnboardForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "subdomain") {
      validateSubdomain(value);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setOnboardForm((prev) => ({
      ...prev,
      logo: file,
    }));
  };

  // Fetch categories for selected business
  const handleSelectBusinessForMenu = async (business) => {
    setSelectedBusiness(business);
    setItemSuccess("");
    setImagePreview(null); // Clear image preview when switching businesses

    const db = getFirestore();
    try {
      const categoriesRef = collection(
        db,
        "menus",
        business.userId,
        "categories"
      );
      const categoriesSnapshot = await getDocs(categoriesRef);
      const categoriesData = categoriesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBusinessCategories(categoriesData);

      // Fetch menu items
      const itemsRef = collection(db, "menus", business.userId, "items");
      const itemsSnapshot = await getDocs(itemsRef);
      const itemsData = itemsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBusinessMenuItems(itemsData);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setBusinessCategories([]);
      setBusinessMenuItems([]);
    }
  };

  // Handle menu item form change
  const handleMenuItemFormChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files && files[0]) {
      const file = files[0];
      setMenuItemForm((prev) => ({
        ...prev,
        image: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setMenuItemForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle remove image
  const handleRemoveImage = () => {
    setMenuItemForm((prev) => ({
      ...prev,
      image: null,
    }));
    setImagePreview(null);
  };

  // Add menu item to business
  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    if (!selectedBusiness) return;

    // Check for duplicate item name within the same category
    const duplicateItem = businessMenuItems.find(
      (item) =>
        item.name.toLowerCase() === menuItemForm.name.trim().toLowerCase() &&
        item.category === menuItemForm.category
    );

    if (duplicateItem) {
      showNotification(
        "error",
        `An item named "${menuItemForm.name}" already exists in this category!`
      );
      return;
    }

    setItemLoading(true);
    setItemSuccess("");

    const db = getFirestore();
    const storage = getStorage();

    try {
      const itemId = `${menuItemForm.category}-${menuItemForm.name
        .toLowerCase()
        .replace(/\s+/g, "-")}-${Date.now()}`;

      // Upload image if provided
      let imageURL = null;
      if (menuItemForm.image) {
        const imageRef = ref(
          storage,
          `menu-items/${selectedBusiness.userId}/${itemId}/${menuItemForm.image.name}`
        );
        await uploadBytes(imageRef, menuItemForm.image);
        imageURL = await getDownloadURL(imageRef);
      }

      await setDoc(doc(db, "menus", selectedBusiness.userId, "items", itemId), {
        name: menuItemForm.name.trim(),
        description: menuItemForm.description.trim() || "",
        category: menuItemForm.category || "",
        imageURL: imageURL || null,
        createdAt: new Date(),
      });

      setItemSuccess(
        `Successfully added "${menuItemForm.name}" to ${selectedBusiness.subdomain}.guestmenu.com!`
      );
      showNotification(
        "success",
        `Menu item "${menuItemForm.name.trim()}" added successfully!`
      );

      // Refresh menu items list
      await handleSelectBusinessForMenu(selectedBusiness);

      // Reset form
      setMenuItemForm({
        name: "",
        description: "",
        category: "",
        image: null,
      });
      setImagePreview(null);
    } catch (error) {
      console.error("Error adding menu item:", error);
      showNotification("error", "Failed to add menu item. Please try again.");
    } finally {
      setItemLoading(false);
    }
  };

  // Delete business function
  const handleDeleteBusiness = async (business) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Business",
      message: `Are you sure you want to delete "${business.subdomain}.guestmenu.com"?\n\nThis will permanently delete:\n• Subdomain entry\n• User profile\n• All menu categories\n• All menu items\n• All submissions\n• Logo (if exists)\n\nThis action cannot be undone!`,
      onConfirm: async () => {
        setLoading(true);
        setError("");

        const db = getFirestore();
        const storage = getStorage();

        try {
          const userId = business.userId;
          const subdomain = business.subdomain || business.id;

          // 1. Delete subdomain entry
          await deleteDoc(doc(db, "subdomains", subdomain));

          // 2. Delete user profile
          const profileDoc = doc(db, "users", userId, "profile", "data");
          const profileSnap = await getDoc(profileDoc);
          if (profileSnap.exists()) {
            await deleteDoc(profileDoc);
          }

          // 3. Delete user document
          const userDoc = doc(db, "users", userId);
          const userSnap = await getDoc(userDoc);
          if (userSnap.exists()) {
            await deleteDoc(userDoc);
          }

          // 4. Delete all categories
          const categoriesRef = collection(db, "menus", userId, "categories");
          const categoriesSnapshot = await getDocs(categoriesRef);
          for (const categoryDoc of categoriesSnapshot.docs) {
            await deleteDoc(categoryDoc.ref);
          }

          // 5. Delete all items
          const itemsRef = collection(db, "menus", userId, "items");
          const itemsSnapshot = await getDocs(itemsRef);
          for (const itemDoc of itemsSnapshot.docs) {
            await deleteDoc(itemDoc.ref);
          }

          // 6. Delete all submissions (if any)
          try {
            const submissionsRef = collection(
              db,
              "submissions",
              userId,
              "entries"
            );
            const submissionsSnapshot = await getDocs(submissionsRef);
            for (const submissionDoc of submissionsSnapshot.docs) {
              await deleteDoc(submissionDoc.ref);
            }
          } catch (err) {
            console.log("No submissions to delete or already deleted:", err);
          }

          // 7. Delete logo from storage (if exists)
          if (business.owner?.logo) {
            try {
              const logoRef = ref(storage, `logos/${subdomain}/`);
              await deleteObject(logoRef);
            } catch (err) {
              console.log("No logo to delete or already deleted");
            }
          }

          // Refresh data
          const statsData = await getBusinessStatistics();
          setStats(statsData);
          setBusinesses(statsData.businesses);
          setUsers(statsData.users);

          showNotification(
            "success",
            `Successfully deleted ${subdomain}.guestmenu.com!`
          );
        } catch (err) {
          console.error("Error deleting business:", err);
          setError(`Failed to delete business: ${err.message}`);
          showNotification(
            "error",
            "Failed to delete business. Please check console for details."
          );
        } finally {
          setLoading(false);
        }
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading super admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Super Admin Dashboard
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Master Control Center
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold text-gray-900">{user?.email}</p>
                <p className="text-xs text-red-600 font-bold">👑 SUPER ADMIN</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center">
                <p className="text-gray-600 text-sm font-medium mb-2">
                  Total Businesses
                </p>
                <p className="text-5xl font-bold text-blue-600">
                  {stats.totalBusinesses}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center">
                <p className="text-gray-600 text-sm font-medium mb-2">
                  Total Users
                </p>
                <p className="text-5xl font-bold text-green-600">
                  {stats.totalUsers}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center">
                <p className="text-gray-600 text-sm font-medium mb-2">
                  Average Users/Business
                </p>
                <p className="text-5xl font-bold text-purple-600">
                  {stats.totalBusinesses > 0
                    ? (stats.totalUsers / stats.totalBusinesses).toFixed(1)
                    : 0}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("menu-management")}
              className={`py-4 px-2 font-semibold border-b-2 transition-colors ${
                activeTab === "menu-management"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-600 border-transparent hover:text-gray-900"
              }`}
            >
              <span className="flex items-center gap-2">
                <span>🍽️</span>
                Menu Management
              </span>
            </button>
            <button
              onClick={() => setActiveTab("businesses")}
              className={`py-4 px-2 font-semibold border-b-2 transition-colors ${
                activeTab === "businesses"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-600 border-transparent hover:text-gray-900"
              }`}
            >
              <span className="flex items-center gap-2">
                <span>🏢</span>
                Businesses ({businesses.length})
              </span>
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`py-4 px-2 font-semibold border-b-2 transition-colors ${
                activeTab === "users"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-600 border-transparent hover:text-gray-900"
              }`}
            >
              <span className="flex items-center gap-2">
                <span>👥</span>
                Users ({users.length})
              </span>
            </button>
          </div>
        </div>

        {/* Menu Management Tab - Combined Onboarding and Menu Items */}
        {activeTab === "menu-management" && (
          <div className="space-y-8">
            {/* Section 1: Onboard New Menu */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  ➕ Onboard New House/Guest Menu
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Create a new guest menu on behalf of a user
                </p>
              </div>

              <form onSubmit={handleOnboardMenu} className="p-6 space-y-6">
                {onboardSuccess && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800">{onboardSuccess}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* User Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      User Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={onboardForm.name}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  {/* User Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      User Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={onboardForm.email}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="user@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Subdomain */}
                <div>
                  <label
                    htmlFor="subdomain"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Starting Route (Subdomain) *
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      id="subdomain"
                      name="subdomain"
                      value={onboardForm.subdomain}
                      onChange={handleFormChange}
                      className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
                        routeError ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="myrestaurant"
                      pattern="[a-z0-9-]+"
                      required
                    />
                    <span className="text-gray-600 font-medium">
                      .guestmenu.com
                    </span>
                  </div>
                  {routeError && (
                    <p className="mt-2 text-sm text-red-600">{routeError}</p>
                  )}
                  {!routeError && onboardForm.subdomain && (
                    <p className="mt-2 text-sm text-green-600">
                      ✓ This subdomain is available!
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Only lowercase letters, numbers, and hyphens. No spaces.
                  </p>
                </div>

                {/* Logo Upload */}
                <div>
                  <label
                    htmlFor="logo"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Logo (Optional)
                  </label>
                  <input
                    type="file"
                    id="logo"
                    name="logo"
                    onChange={handleLogoChange}
                    accept="image/*"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Supported formats: JPG, PNG, GIF (Max 5MB)
                  </p>
                  <p className="mt-2 text-sm text-blue-600 font-medium">
                    After creating the menu, select it below to add categories
                    and menu items.
                  </p>
                </div>

                {/* Submit Button - Moved Up */}
                <div className="flex gap-4 pt-4 border-t">
                  <button
                    type="submit"
                    disabled={
                      onboardLoading || !!routeError || !onboardForm.subdomain
                    }
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
                  >
                    {onboardLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Creating Menu...
                      </span>
                    ) : (
                      "Create Guest Menu"
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Section 2: Manage Menu Items */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  🍽️ Manage Menu Items
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Select a business and add menu items to their menu
                </p>
              </div>

              <div className="p-6">
                {/* Business Selection */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Business
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {businesses.map((business) => (
                      <button
                        key={business.subdomain}
                        onClick={() => handleSelectBusinessForMenu(business)}
                        className={`p-4 border-2 rounded-lg text-left transition-all ${
                          selectedBusiness?.subdomain === business.subdomain
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <div className="font-semibold text-gray-900">
                          {business.subdomain}.guestmenu.com
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {business.owner?.name || "N/A"}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add Menu Item Form */}
                {selectedBusiness && (
                  <form
                    onSubmit={handleAddMenuItem}
                    className="space-y-6 border-t pt-6"
                  >
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <h3 className="font-semibold text-blue-900 mb-1">
                        Managing: {selectedBusiness.subdomain}.guestmenu.com
                      </h3>
                      <p className="text-sm text-blue-700">
                        Owner: {selectedBusiness.owner?.name || "N/A"}
                      </p>
                    </div>

                    {/* Categories Management Section */}
                    <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        📂 Manage Categories
                      </h4>

                      {/* Add New Category */}
                      <div className="flex gap-2 mb-4">
                        <input
                          type="text"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddCategory();
                            }
                          }}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                          placeholder="Enter category name (e.g., Appetizers)"
                        />
                        <button
                          type="button"
                          onClick={handleAddCategory}
                          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition duration-200 flex items-center gap-1"
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
                          Add Category
                        </button>
                      </div>

                      {/* Categories List */}
                      {businessCategories.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {businessCategories.map((category, index) => (
                            <div
                              key={category.id}
                              className="flex items-center gap-2 bg-white p-3 rounded-lg border border-gray-300"
                            >
                              {editingCategoryIndex === index ? (
                                <>
                                  <input
                                    type="text"
                                    value={editingCategoryValue}
                                    onChange={(e) =>
                                      setEditingCategoryValue(e.target.value)
                                    }
                                    className="flex-1 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-gray-900"
                                    autoFocus
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleSaveEditCategory(index)
                                    }
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition"
                                    title="Save"
                                  >
                                    ✓
                                  </button>
                                  <button
                                    type="button"
                                    onClick={handleCancelEditCategory}
                                    className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded transition"
                                    title="Cancel"
                                  >
                                    ✕
                                  </button>
                                </>
                              ) : (
                                <>
                                  <span className="flex-1 font-medium text-gray-900">
                                    {category.name}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleEditCategory(index)}
                                    className="bg-blue-100 hover:bg-blue-200 text-blue-600 px-3 py-1 rounded transition text-sm"
                                    title="Edit"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteCategory(index)}
                                    className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded transition text-sm"
                                    title="Delete"
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          No categories yet. Add your first category above.
                        </p>
                      )}
                    </div>

                    {/* Menu Items Section */}
                    <div className="p-6 bg-white rounded-lg border border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        🍽️ Add Menu Items
                      </h4>

                      {itemSuccess && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-green-800">{itemSuccess}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Item Name */}
                        <div>
                          <label
                            htmlFor="itemName"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Item Name *
                          </label>
                          <input
                            type="text"
                            id="itemName"
                            name="name"
                            value={menuItemForm.name}
                            onChange={handleMenuItemFormChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            placeholder="e.g., Grilled Salmon"
                            required
                          />
                        </div>

                        {/* Category */}
                        <div>
                          <label
                            htmlFor="itemCategory"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Category *
                          </label>
                          <select
                            id="itemCategory"
                            name="category"
                            value={menuItemForm.category}
                            onChange={handleMenuItemFormChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            required
                          >
                            <option value="">Select a category</option>
                            {businessCategories.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                          {businessCategories.length === 0 && (
                            <p className="mt-1 text-xs text-red-600">
                              No categories found. Please add categories during
                              onboarding.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <div className="md:col-span-2">
                        <label
                          htmlFor="itemDescription"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Description (Optional)
                        </label>
                        <textarea
                          id="itemDescription"
                          name="description"
                          value={menuItemForm.description}
                          onChange={handleMenuItemFormChange}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                          placeholder="Brief description of the item..."
                        />
                      </div>

                      {/* Image Upload */}
                      <div className="md:col-span-2">
                        <label
                          htmlFor="itemImage"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Item Image (Optional)
                        </label>

                        {!imagePreview ? (
                          <div className="flex items-center gap-4">
                            <label
                              htmlFor="itemImage"
                              className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                            >
                              <svg
                                className="w-12 h-12 text-gray-400 mb-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              <span className="text-sm text-gray-600 font-medium">
                                Click to upload image
                              </span>
                              <span className="text-xs text-gray-500 mt-1">
                                PNG, JPG, GIF up to 5MB
                              </span>
                            </label>
                            <input
                              type="file"
                              id="itemImage"
                              name="image"
                              accept="image/*"
                              onChange={handleMenuItemFormChange}
                              className="hidden"
                            />
                          </div>
                        ) : (
                          <div className="relative">
                            <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="max-h-64 mx-auto rounded-lg shadow-md"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={handleRemoveImage}
                              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors"
                              title="Remove image"
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
                        )}
                      </div>

                      {/* Submit Button */}
                      <div className="flex gap-4">
                        <button
                          type="submit"
                          disabled={
                            itemLoading || businessCategories.length === 0
                          }
                          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
                        >
                          {itemLoading ? (
                            <span className="flex items-center justify-center gap-2">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                              Adding Item...
                            </span>
                          ) : (
                            "Add Menu Item"
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {/* Existing Menu Items Display */}
                {selectedBusiness && businessMenuItems.length > 0 && (
                  <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      📋 Existing Menu Items ({businessMenuItems.length})
                    </h4>

                    {/* Group items by category */}
                    {businessCategories.map((category) => {
                      const categoryItems = businessMenuItems.filter(
                        (item) => item.category === category.id
                      );

                      if (categoryItems.length === 0) return null;

                      return (
                        <div key={category.id} className="mb-6">
                          <h5 className="text-md font-semibold text-indigo-700 mb-3 flex items-center gap-2">
                            <span className="bg-indigo-100 px-3 py-1 rounded-full">
                              {category.name}
                            </span>
                            <span className="text-sm text-gray-600">
                              ({categoryItems.length}{" "}
                              {categoryItems.length === 1 ? "item" : "items"})
                            </span>
                          </h5>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {categoryItems.map((item) => (
                              <div
                                key={item.id}
                                className="bg-white p-4 rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-shadow"
                              >
                                {/* Item Image */}
                                {item.imageURL && (
                                  <div className="mb-3">
                                    <img
                                      src={item.imageURL}
                                      alt={item.name}
                                      className="w-full h-32 object-cover rounded-lg"
                                    />
                                  </div>
                                )}

                                <div className="mb-2">
                                  <h6 className="font-semibold text-gray-900">
                                    {item.name}
                                  </h6>
                                </div>
                                {item.description && (
                                  <p className="text-sm text-gray-600 mb-2">
                                    {item.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
                                  <button
                                    onClick={() => {
                                      // TODO: Implement edit functionality
                                      showNotification(
                                        "info",
                                        "Edit feature coming soon!"
                                      );
                                    }}
                                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                  >
                                    Edit
                                  </button>
                                  <span className="text-gray-300">|</span>
                                  <button
                                    onClick={() => {
                                      setConfirmDialog({
                                        isOpen: true,
                                        title: "Delete Menu Item",
                                        message: `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
                                        onConfirm: async () => {
                                          try {
                                            const db = getFirestore();
                                            await deleteDoc(
                                              doc(
                                                db,
                                                "menus",
                                                selectedBusiness.userId,
                                                "items",
                                                item.id
                                              )
                                            );
                                            await handleSelectBusinessForMenu(
                                              selectedBusiness
                                            );
                                            showNotification(
                                              "success",
                                              "Menu item deleted successfully!"
                                            );
                                          } catch (error) {
                                            console.error(
                                              "Error deleting item:",
                                              error
                                            );
                                            showNotification(
                                              "error",
                                              "Failed to delete item."
                                            );
                                          }
                                        },
                                      });
                                    }}
                                    className="text-xs text-red-600 hover:text-red-800 font-medium"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}

                    {/* Items without category */}
                    {businessMenuItems.filter(
                      (item) => !item.category || item.category === ""
                    ).length > 0 && (
                      <div className="mb-6">
                        <h5 className="text-md font-semibold text-gray-700 mb-3">
                          Uncategorized Items
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {businessMenuItems
                            .filter(
                              (item) => !item.category || item.category === ""
                            )
                            .map((item) => (
                              <div
                                key={item.id}
                                className="bg-white p-4 rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-shadow"
                              >
                                <div className="mb-2">
                                  <h6 className="font-semibold text-gray-900">
                                    {item.name}
                                  </h6>
                                </div>
                                {item.description && (
                                  <p className="text-sm text-gray-600 mb-2">
                                    {item.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
                                  <button
                                    onClick={() => {
                                      showNotification(
                                        "info",
                                        "Edit feature coming soon!"
                                      );
                                    }}
                                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                  >
                                    Edit
                                  </button>
                                  <span className="text-gray-300">|</span>
                                  <button
                                    onClick={() => {
                                      setConfirmDialog({
                                        isOpen: true,
                                        title: "Delete Menu Item",
                                        message: `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
                                        onConfirm: async () => {
                                          try {
                                            const db = getFirestore();
                                            await deleteDoc(
                                              doc(
                                                db,
                                                "menus",
                                                selectedBusiness.userId,
                                                "items",
                                                item.id
                                              )
                                            );
                                            await handleSelectBusinessForMenu(
                                              selectedBusiness
                                            );
                                            showNotification(
                                              "success",
                                              "Menu item deleted successfully!"
                                            );
                                          } catch (error) {
                                            console.error(
                                              "Error deleting item:",
                                              error
                                            );
                                            showNotification(
                                              "error",
                                              "Failed to delete item."
                                            );
                                          }
                                        },
                                      });
                                    }}
                                    className="text-xs text-red-600 hover:text-red-800 font-medium"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {!selectedBusiness && businesses.length === 0 && (
                  <div className="text-center py-12 text-gray-600">
                    <p>No businesses found. Please onboard a business first.</p>
                  </div>
                )}

                {!selectedBusiness && businesses.length > 0 && (
                  <div className="text-center py-12 text-gray-600">
                    <p>Select a business above to start adding menu items.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Businesses Table */}
        {activeTab === "businesses" && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                All Businesses
              </h2>
            </div>

            {businesses.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-600">No businesses found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Subdomain
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Owner Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Owner Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        User ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {businesses.map((business) => (
                      <tr key={business.subdomain} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <a
                            href={`https://${business.subdomain}.guestmenu.com`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 font-semibold"
                          >
                            {business.subdomain}.guestmenu.com
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                          {business.owner?.name || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {business.owner?.email || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <code className="bg-gray-100 px-2 py-1 rounded">
                            {business.userId.substring(0, 8)}...
                          </code>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {business.createdAt
                            ? new Date(
                                business.createdAt.toDate?.() ||
                                  business.createdAt
                              ).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleDeleteBusiness(business)}
                            className="text-red-600 hover:text-red-800 font-semibold text-sm flex items-center gap-1"
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Users Table */}
        {activeTab === "users" && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">All Users</h2>
            </div>

            {users.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-600">No users found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Subdomain
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        User ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Email Verified
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((userData) => {
                      const roleInfo = userRoles[userData.userId] || {
                        role: "guest",
                        subdomain: null,
                      };
                      const isSuperAdmin =
                        userData.profile?.email === "guestmenu0@gmail.com" ||
                        roleInfo.role === "superadmin";

                      return (
                        <tr key={userData.userId} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                            {userData.profile?.name || "Unknown"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            {userData.profile?.email || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                isSuperAdmin
                                  ? "bg-red-100 text-red-800"
                                  : roleInfo.role === "host"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {isSuperAdmin
                                ? "👑 Super Admin"
                                : roleInfo.role === "host"
                                ? "🏪 Host"
                                : "👤 Guest"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {roleInfo.subdomain ? (
                              <span className="text-blue-600 font-medium">
                                {roleInfo.subdomain}
                              </span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            <code className="bg-gray-100 px-2 py-1 rounded">
                              {userData.userId.substring(0, 8)}...
                            </code>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${
                                userData.emailVerified
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {userData.emailVerified ? "✓ Yes" : "⏳ Pending"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {userData.createdAt
                              ? new Date(
                                  userData.createdAt.toDate?.() ||
                                    userData.createdAt
                                ).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditRole(userData)}
                                className="text-blue-600 hover:text-blue-800 font-semibold text-sm flex items-center gap-1"
                                title="Edit Role"
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
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteUserClick(userData)}
                                className="text-red-600 hover:text-red-800 font-semibold text-sm flex items-center gap-1"
                                title="Delete User"
                                disabled={isSuperAdmin}
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
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Notification Modal */}
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={closeNotification}
        type={notification.type}
        message={notification.message}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
      />

      {/* Edit Role Modal */}
      {editRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all duration-300 scale-100 opacity-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Edit User Role
            </h3>
            {editingUser && (
              <p className="text-sm text-gray-600 mb-6">
                Editing role for:{" "}
                <strong>
                  {editingUser.profile?.name ||
                    editingUser.profile?.email ||
                    editingUser.userId}
                </strong>
              </p>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  value={editRoleForm.role}
                  onChange={(e) =>
                    setEditRoleForm({
                      ...editRoleForm,
                      role: e.target.value,
                      subdomain:
                        e.target.value === "host" ? editRoleForm.subdomain : "",
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="guest">Guest</option>
                  <option value="host">Host</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>
              {editRoleForm.role === "host" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign Subdomain
                  </label>
                  <select
                    value={editRoleForm.subdomain}
                    onChange={(e) =>
                      setEditRoleForm({
                        ...editRoleForm,
                        subdomain: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a subdomain</option>
                    {businesses.map((business) => (
                      <option
                        key={business.subdomain}
                        value={business.subdomain}
                      >
                        {business.subdomain}.guestmenu.com
                      </option>
                    ))}
                  </select>
                  {editRoleForm.role === "host" && !editRoleForm.subdomain && (
                    <p className="text-xs text-red-600 mt-1">
                      Subdomain is required for host role
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setEditRoleModalOpen(false);
                  setEditingUser(null);
                  setEditRoleForm({ role: "guest", subdomain: "" });
                }}
                className="px-5 py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition-colors"
                disabled={roleLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRole}
                disabled={
                  roleLoading ||
                  (editRoleForm.role === "host" && !editRoleForm.subdomain)
                }
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {roleLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
