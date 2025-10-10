import React from "react";
import HomePage from "../pages/HomePage";
import CustomerMenu from "../pages/CustomerMenu";

/**
 * SmartHome Component
 * Routes to either HomePage (no subdomain) or CustomerMenu (with subdomain)
 */
const SmartHome = () => {
  // Check if there's a subdomain
  const hostname = window.location.hostname;
  const hostnameParts = hostname.split(".");

  // Determine if we should show the store menu or the app homepage
  const hasSubdomain =
    hostnameParts.length >= 2 &&
    hostnameParts[0] !== "www" &&
    (hostnameParts[hostnameParts.length - 1] === "localhost" ||
      hostnameParts.length > 2);

  // Plain localhost without subdomain
  const isPlainLocalhost =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "www.localhost";

  console.log("🌐 SmartHome:", {
    hostname,
    hasSubdomain,
    isPlainLocalhost,
    showingStore: hasSubdomain && !isPlainLocalhost,
  });

  // Show HomePage for plain localhost, CustomerMenu for subdomains
  if (hasSubdomain && !isPlainLocalhost) {
    return <CustomerMenu />;
  }

  return <HomePage />;
};

export default SmartHome;
