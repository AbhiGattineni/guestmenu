import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        console.log("🔐 User authenticated:", user.email, "UID:", user.uid);

        // Fetch user document from single users collection
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const role = userData.role;
          console.log("✅ User role found:", role, "| User data:", userData);
          setUserRole(role);
        } else {
          console.error("❌ NO ROLE DOCUMENT FOUND!");
          console.warn(
            `No role document found for user ${user.uid} at path: users/${user.uid}`
          );
          console.info(`🔧 FIX: Go to Firebase Console → Firestore Database`);
          console.info(`📝 Create document at path: users/${user.uid}`);
          console.info(
            `📋 Add fields: { role: "superadmin" or "manager", email: "${user.email}" }`
          );
          setUserRole(null);
        }
      } else {
        console.log("👋 User logged out");
        setUserRole(null);
      }

      setLoading(false);
    });
    return unsubscribe;
  }, [auth, db]);

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const value = {
    currentUser,
    userRole,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
