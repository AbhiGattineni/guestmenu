import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-xl text-blue-100 mb-8">Page not found</p>
        <button
          onClick={() => navigate("/")}
          className="bg-white hover:bg-gray-100 text-blue-600 font-semibold py-3 px-8 rounded-lg transition duration-200"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
