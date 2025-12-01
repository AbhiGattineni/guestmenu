/**
 * Google Authentication Service
 * Handles Google SSO login and signup
 */

import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { createUserProfile, getUserProfile } from "./firebaseService";

const auth = getAuth();
const googleProvider = new GoogleAuthProvider();

/**
 * Configure Google Sign-In provider
 */
googleProvider.setCustomParameters({
  prompt: "select_account",
});

/**
 * Sign up with Google
 * Creates a new user account using Google credentials
 * @returns {Promise<Object>} User data and auth info
 */
export const signUpWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if user profile already exists
    const existingProfile = await getUserProfile(user.uid);

    // If first time, create profile
    if (!existingProfile) {
      await createUserProfile(user.uid, {
        name: user.displayName || "User",
        email: user.email,
        phone: "",
        avatar: user.photoURL || null,
      });
    }

    return {
      user,
      success: true,
      isNewUser: !existingProfile,
      message: "Google sign up successful!",
    };
  } catch (error) {
    console.error("Error signing up with Google:", error);
    throw error;
  }
};

/**
 * Sign in with Google
 * Logs in an existing user using Google credentials
 * @returns {Promise<Object>} User data and auth info
 */
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Fetch or create user profile
    let profile = await getUserProfile(user.uid);

    // If profile doesn't exist, create it
    if (!profile) {
      await createUserProfile(user.uid, {
        name: user.displayName || "User",
        email: user.email,
        phone: "",
        avatar: user.photoURL || null,
      });
      profile = await getUserProfile(user.uid);
    }

    return {
      user,
      profile,
      success: true,
      message: "Google sign in successful!",
    };
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

/**
 * Get auth provider
 * @returns {GoogleAuthProvider} Google provider instance
 */
export const getGoogleProvider = () => {
  return googleProvider;
};

export default {
  signInWithGoogle,
  signUpWithGoogle,
  getGoogleProvider,
};
