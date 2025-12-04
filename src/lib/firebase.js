/**
 * Firebase Configuration
 * Initialize Firebase services for the application
 */

import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Validate environment variables
const requiredEnvVars = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check for missing environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value || value.includes("your_") || value.includes("here"))
  .map(([key]) => `NEXT_PUBLIC_FIREBASE_${key.toUpperCase().replace(/([A-Z])/g, "_$1").replace(/^_/, "")}`);

if (missingVars.length > 0 && typeof window !== "undefined") {
  console.error(
    "❌ Firebase Configuration Error:\n" +
    "Missing or invalid environment variables:\n" +
    missingVars.join("\n") +
    "\n\nPlease create a .env.local file with your Firebase credentials.\n" +
    "See .env.local.example for reference.\n" +
    "Get your credentials from: https://console.firebase.google.com/"
  );
}

const firebaseConfig = {
  apiKey: requiredEnvVars.apiKey,
  authDomain: requiredEnvVars.authDomain,
  projectId: requiredEnvVars.projectId,
  storageBucket: requiredEnvVars.storageBucket,
  messagingSenderId: requiredEnvVars.messagingSenderId,
  appId: requiredEnvVars.appId,
};

// Initialize Firebase (prevent re-initialization in development)
let app;
try {
  // Validate config before initializing
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey.includes("your_")) {
    throw new Error("Firebase API key is missing or invalid. Please check your .env.local file.");
  }
  
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  
  // Log successful initialization (only in development)
  if (process.env.NODE_ENV === "development") {
    console.log("✅ Firebase initialized successfully");
    console.log("Project ID:", firebaseConfig.projectId);
  }
} catch (error) {
  console.error("❌ Firebase initialization error:", error);
  
  // Provide helpful error messages
  if (error.code === "auth/api-key-not-valid") {
    console.error(
      "\n🔧 Fix API Key Error:\n" +
      "1. Go to Firebase Console → Project Settings\n" +
      "2. Copy your API key from 'Your apps' section\n" +
      "3. Update .env.local with the correct API key\n" +
      "4. Restart your dev server\n"
    );
  } else if (error.message?.includes("400")) {
    console.error(
      "\n🔧 Fix 400 Error:\n" +
      "1. Enable Authentication: Firebase Console → Authentication → Get Started\n" +
      "2. Enable Email/Password: Authentication → Sign-in method\n" +
      "3. Enable APIs: Google Cloud Console → APIs & Services → Enable Identity Toolkit API\n" +
      "4. Restart your dev server\n"
    );
  }
  
  throw error;
}

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;

