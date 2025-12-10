import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { getUserProfile, createUserProfile } from "../services/firebaseService";
import {
  signInWithGoogle,
  signUpWithGoogle,
} from "../services/googleAuthService";
import { isSuperAdmin } from "../services/superAdminService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = getAuth();

  // Helper function to get user role from ID token
  const getUserRole = async (authUser) => {
    try {
      if (!authUser) return null;

      // Get ID token to access custom claims
      const token = await authUser.getIdTokenResult();
      const claims = token.claims || {};

      // Check for role in custom claims
      const role = claims.role || "guest";
      const subdomain = claims.subdomain || null;

      return {
        role,
        subdomain,
      };
    } catch (error) {
      console.error("Error getting user role:", error);
      return { role: "guest", subdomain: null };
    }
  };

  // Set up auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      try {
        if (authUser) {
          setUser(authUser);
          // Fetch user profile
          const profile = await getUserProfile(authUser.uid);
          setUserProfile(profile);

          // Get user role from custom claims
          const roleInfo = await getUserRole(authUser);
          setUserRole(roleInfo);
        } else {
          setUser(null);
          setUserProfile(null);
          setUserRole(null);
        }
      } catch (err) {
        console.error("Error loading user profile:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  // Sign up with email and password
  const signup = useCallback(
    async (email, password, profileData) => {
      try {
        setError(null);
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const newUser = userCredential.user;

        // Update profile with display name
        await updateProfile(newUser, {
          displayName: profileData.name || "",
        });

        // Send email verification
        await sendEmailVerification(newUser);

        // Create user profile in Firestore
        await createUserProfile(newUser.uid, {
          name: profileData.name,
          email,
          phone: profileData.phone || "",
          avatar: null,
        });

        setUser(newUser);
        return {
          user: newUser,
          success: true,
          message: "Account created successfully. Please verify your email.",
        };
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [auth]
  );

  // Sign in with email and password
  const login = useCallback(
    async (email, password) => {
      try {
        setError(null);
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const authUser = userCredential.user;
        setUser(authUser);

        // Fetch user profile
        const profile = await getUserProfile(authUser.uid);
        setUserProfile(profile);

        // Get user role from custom claims
        const roleInfo = await getUserRole(authUser);
        setUserRole(roleInfo);

        return {
          user: authUser,
          role: roleInfo,
          success: true,
          message: "Logged in successfully.",
        };
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [auth]
  );

  // Sign out
  const logout = useCallback(async () => {
    try {
      setError(null);
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [auth]);

  // Send email verification
  const sendVerificationEmail = useCallback(async () => {
    try {
      if (user && !user.emailVerified) {
        await sendEmailVerification(user);
        return true;
      }
      return false;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [user]);

  // Google Sign Up
  const googleSignup = useCallback(async () => {
    try {
      setError(null);
      const result = await signUpWithGoogle();
      setUser(result.user);
      const profile = await getUserProfile(result.user.uid);
      setUserProfile(profile);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Google Sign In
  const googleLogin = useCallback(async () => {
    try {
      setError(null);
      const result = await signInWithGoogle();
      setUser(result.user);
      setUserProfile(result.profile);

      // Get user role from custom claims
      const roleInfo = await getUserRole(result.user);
      setUserRole(roleInfo);

      return {
        ...result,
        role: roleInfo,
      };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const value = {
    user,
    userProfile,
    userRole,
    loading,
    error,
    signup,
    login,
    logout,
    googleSignup,
    googleLogin,
    sendVerificationEmail,
    isEmailVerified: user?.emailVerified || false,
    isAuthenticated: !!user,
    isSuperAdminUser: user ? isSuperAdmin(user) : false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
