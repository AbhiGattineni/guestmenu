// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDMJrhTqKqi2oomODNPTHGIGLfHRwa9uUI",
  authDomain: "guestmenu-42cb6.firebaseapp.com",
  projectId: "guestmenu-42cb6",
  storageBucket: "guestmenu-42cb6.firebasestorage.app",
  messagingSenderId: "476306458778",
  appId: "1:476306458778:web:f01910c3fef8e392edf723",
  measurementId: "G-XRP6X0XCZ0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);
const functions = getFunctions(app, "us-central1");

// Export the initialized app and services
export { app, analytics, storage, functions };
export default app;
