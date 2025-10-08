import React, { createContext, useContext, useState } from "react";

/**
 * AuthContext - Manages authentication state across the application
 */
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Mock login function
   * In production, this would call a real authentication API
   */
  const login = async (email, password) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock authentication - accept any email/password for demo
    // In production, validate credentials against backend
    if (email && password) {
      const mockUser = {
        id: 1,
        email: email,
        name: "Restaurant Manager",
        role: "manager",
      };
      setUser(mockUser);
      setIsAuthenticated(true);
      return { success: true, user: mockUser };
    }

    return { success: false, error: "Invalid credentials" };
  };

  /**
   * Logout function
   */
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
