import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserMenus } from "../services/firebaseService";

const DashboardPage = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const userMenus = await getUserMenus(user.uid);
        setMenus(userMenus);
      } catch (err) {
        console.error("Error fetching menus:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMenus();
    }
  }, [user]);

  const handleCreateMenu = () => {
    navigate("/menu/new");
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              GuestMenu Dashboard
            </h1>
            <div className="space-x-4">
              <button
                onClick={() => navigate("/settings")}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome, {user?.displayName || user?.email}!
          </h2>
          <p className="text-gray-600">
            Manage your guest menus and track submissions here.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <p className="text-gray-600 text-sm font-medium mb-2">
                Total Menus
              </p>
              <p className="text-4xl font-bold text-blue-600">{menus.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <p className="text-gray-600 text-sm font-medium mb-2">
                Total Submissions
              </p>
              <p className="text-4xl font-bold text-green-600">
                {menus.reduce(
                  (sum, menu) => sum + (menu.submissionCount || 0),
                  0
                )}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <p className="text-gray-600 text-sm font-medium mb-2">
                Active Menus
              </p>
              <p className="text-4xl font-bold text-purple-600">
                {menus.filter((m) => m.isActive).length}
              </p>
            </div>
          </div>
        </div>

        {/* Menus Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Your Menus</h3>
            <button
              onClick={handleCreateMenu}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
            >
              + Create New Menu
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-600">Loading menus...</p>
            </div>
          ) : menus.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-600 mb-4">
                No menus yet. Create one to get started!
              </p>
              <button
                onClick={handleCreateMenu}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
              >
                Create Your First Menu
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menus.map((menu) => (
                <div
                  key={menu.id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">
                        {menu.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {menu.description}
                      </p>
                    </div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        menu.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {menu.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 py-4 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-600">Submissions</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {menu.submissionCount || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Created</p>
                      <p className="text-sm text-gray-900">
                        {menu.createdAt
                          ? new Date(
                              menu.createdAt.toDate?.() || menu.createdAt
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/menu/${menu.id}`)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-200 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => navigate(`/submissions/${menu.id}`)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition duration-200 text-sm"
                    >
                      Submissions
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
