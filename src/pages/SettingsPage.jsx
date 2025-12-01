import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600 mb-4">User Settings & Preferences</p>
          <p className="text-gray-600">🚀 Coming soon...</p>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
