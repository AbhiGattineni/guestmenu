import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { Box, CircularProgress, Typography } from "@mui/material";
import "../firebase"; // Initialize Firebase

/**
 * RoleBasedRedirect Component
 *
 * Handles role-based routing for authenticated users.
 * Fetches user role from Firestore and redirects based on:
 * - superadmin -> /superadmin-dashboard
 * - manager -> /manager-dashboard
 * - other/missing -> /not-authorized
 * - not logged in -> /login
 */
const RoleBasedRedirect = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // No user logged in, redirect to login
        navigate("/login");
        return;
      }

      try {
        // First check if user is a superadmin (stored in top-level collection)
        const superAdminDocRef = doc(db, "superadmins", user.uid);
        const superAdminDoc = await getDoc(superAdminDocRef);

        if (superAdminDoc.exists()) {
          navigate("/superadmin-dashboard");
          setLoading(false);
          return;
        }

        // If not superadmin, check for manager role in client-specific collection
        const clientId =
          window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1"
            ? "demo-restaurant"
            : window.location.hostname.split(".")[0];

        const userDocRef = doc(db, "clients", clientId, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const role = userData.role;

          // Navigate based on role
          switch (role) {
            case "manager":
              navigate("/manager-dashboard");
              break;
            default:
              // Unknown role
              navigate("/not-authorized");
              break;
          }
        } else {
          // User document doesn't exist
          navigate("/not-authorized");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        navigate("/not-authorized");
      } finally {
        setLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth, db, navigate]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "background.default",
          gap: 2,
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Loading…
        </Typography>
      </Box>
    );
  }

  return null;
};

export default RoleBasedRedirect;
