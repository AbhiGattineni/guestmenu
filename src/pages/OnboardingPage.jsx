import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  checkSubdomainAvailability,
  registerSubdomain,
  updateUserProfile,
} from "../services/firebaseService";

const OnboardingPage = () => {
  const [step, setStep] = useState(1); // 1: Subdomain, 2: Profile
  const [subdomain, setSubdomain] = useState("");
  const [subdomainError, setSubdomainError] = useState("");
  const [subdomainAvailable, setSubdomainAvailable] = useState(null);
  const [checkingSubdomain, setCheckingSubdomain] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    bio: "",
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check subdomain availability
  const handleCheckSubdomain = async (value) => {
    setSubdomain(value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
    setSubdomainError("");

    if (value.length < 3) {
      setSubdomainError("Subdomain must be at least 3 characters");
      setSubdomainAvailable(null);
      return;
    }

    if (!/^[a-z0-9-]+$/.test(value)) {
      setSubdomainError("Only lowercase letters, numbers, and hyphens allowed");
      setSubdomainAvailable(null);
      return;
    }

    setCheckingSubdomain(true);
    try {
      const available = await checkSubdomainAvailability(value);
      setSubdomainAvailable(available);
      if (!available) {
        setSubdomainError("This subdomain is already taken");
      }
    } catch (err) {
      setSubdomainError("Error checking availability");
    } finally {
      setCheckingSubdomain(false);
    }
  };

  const handleNextStep = async () => {
    if (subdomainAvailable && subdomain.length >= 3) {
      setLoading(true);
      try {
        await registerSubdomain(user.uid, subdomain);
        setStep(2);
      } catch (err) {
        setSubdomainError("Error registering subdomain");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCompleteOnboarding = async () => {
    setLoading(true);
    try {
      await updateUserProfile(user.uid, profileData);
      navigate("/dashboard");
    } catch (err) {
      console.error("Error completing onboarding:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome to GuestMenu
          </h1>
          <p className="text-gray-600">
            {step === 1
              ? "Set up your unique menu link"
              : "Complete your profile"}
          </p>
        </div>

        {/* Step 1: Subdomain */}
        {step === 1 && (
          <div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Menu URL
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <span className="px-4 py-2 bg-gray-100 text-gray-600 font-medium">
                  guestmenu.com/
                </span>
                <input
                  type="text"
                  value={subdomain}
                  onChange={(e) => handleCheckSubdomain(e.target.value)}
                  placeholder="your-subdomain"
                  className="flex-1 px-4 py-2 border-0 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {subdomain.length >= 3 && (
                <div className="mt-3 flex items-center">
                  {checkingSubdomain && (
                    <div className="flex items-center text-gray-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                      Checking...
                    </div>
                  )}
                  {!checkingSubdomain && subdomainAvailable === true && (
                    <div className="flex items-center text-green-600">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Available!
                    </div>
                  )}
                  {!checkingSubdomain && subdomainAvailable === false && (
                    <div className="flex items-center text-red-600">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Taken
                    </div>
                  )}
                </div>
              )}

              {subdomainError && (
                <p className="mt-2 text-sm text-red-600">{subdomainError}</p>
              )}

              <p className="mt-4 text-sm text-gray-600">
                This will be your unique menu link that you share with guests.
                <br />
                Example:{" "}
                <strong className="text-gray-800">
                  {subdomain || "yourname"}.guestmenu.com
                </strong>
              </p>
            </div>

            <button
              onClick={handleNextStep}
              disabled={!subdomainAvailable || loading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              {loading ? "Setting up..." : "Continue"}
            </button>
          </div>
        )}

        {/* Step 2: Profile Completion */}
        {step === 2 && (
          <div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio / About You (Optional)
              </label>
              <textarea
                value={profileData.bio}
                onChange={(e) =>
                  setProfileData({ ...profileData, bio: e.target.value })
                }
                placeholder="Tell your guests a bit about you..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="4"
              />
              <p className="mt-2 text-sm text-gray-600">
                This will appear on your menu page.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleCompleteOnboarding}
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
              >
                {loading ? "Completing setup..." : "Complete Setup"}
              </button>
              <button
                onClick={() => setStep(1)}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition duration-200"
              >
                Back
              </button>
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="mt-8 flex justify-center space-x-2">
          {[1, 2].map((stepNum) => (
            <div
              key={stepNum}
              className={`h-2 w-8 rounded-full transition-colors ${
                stepNum <= step ? "bg-blue-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
