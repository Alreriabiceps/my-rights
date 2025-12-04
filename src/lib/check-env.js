/**
 * Temporary debug file to check if environment variables are loaded
 * Run this in browser console: window.checkEnv()
 */

export function checkEnv() {
  if (typeof window === "undefined") {
    console.log("Server-side environment variables:");
    console.log("API Key:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "✅ Set" : "❌ Missing");
    console.log("Auth Domain:", process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "❌ Missing");
    console.log("Project ID:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "❌ Missing");
  } else {
    console.log("Client-side - check browser console for NEXT_PUBLIC_ variables");
  }
}

// Make it available globally in browser
if (typeof window !== "undefined") {
  window.checkEnv = () => {
    console.log("Environment check:");
    console.log("All NEXT_PUBLIC_ variables should be available in the browser");
    console.log("Check Network tab → Headers to see if API key is being sent");
  };
}

