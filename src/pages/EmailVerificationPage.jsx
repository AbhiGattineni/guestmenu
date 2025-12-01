import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAuth } from "firebase/auth";

const EmailVerificationPage = () => {
  const [verificationSent, setVerificationSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingVerification, setCheckingVerification] = useState(false);
  const { user, sendVerificationEmail } = useAuth();
  const navigate = useNavigate();
  const auth = getAuth();

  // Auto-check verification status
  useEffect(() => {
    const interval = setInterval(async () => {
      setCheckingVerification(true);
      try {
        await auth.currentUser?.reload();
        if (auth.currentUser?.emailVerified) {
          navigate("/onboarding");
        }
      } catch (err) {
        console.error("Error checking verification:", err);
      } finally {
        setCheckingVerification(false);
      }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, [navigate, auth]);

  const handleResendVerification = async () => {
    setLoading(true);
    try {
      await sendVerificationEmail();
      setVerificationSent(true);
    } catch (err) {
      console.error("Error sending verification email:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center">
          <div className="mb-6">
            <div className="inline-block p-4 bg-blue-100 rounded-full">
              <svg
                className="w-12 h-12 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Verify Your Email
          </h1>
          <p className="text-gray-600 mb-6">
            We've sent a verification email to <strong>{user?.email}</strong>
          </p>

          {verificationSent && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">
                ✓ Verification email sent! Check your inbox.
              </p>
            </div>
          )}

          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-left">
            <p className="text-sm text-gray-700 mb-3">
              <strong>What's next?</strong>
            </p>
            <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
              <li>Click the link in the email we sent you</li>
              <li>Verify your email address</li>
              <li>
                You'll be automatically redirected to complete your profile
              </li>
            </ul>
          </div>

          {checkingVerification && (
            <p className="text-sm text-gray-500 mb-4">
              Checking verification status...
            </p>
          )}

          <button
            onClick={handleResendVerification}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 mb-3"
          >
            {loading ? "Sending..." : "Resend Verification Email"}
          </button>

          <p className="text-sm text-gray-600">
            Didn't receive an email? Check your spam folder or try resending
            above.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
