"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "./firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Load user profile from Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
          } else {
            // Create user profile if it doesn't exist
            const newProfile = {
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || "",
              createdAt: new Date().toISOString(),
              cases: [],
              savedLawyers: [],
              preferences: {
                language: "en",
                notifications: true,
              },
            };
            await setDoc(doc(db, "users", firebaseUser.uid), newProfile);
            setUserProfile(newProfile);
          }
        } catch (error) {
          console.error("Error loading user profile:", error);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      
      // Update display name
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }

      // Create user profile in Firestore
      const userProfile = {
        email: email,
        displayName: displayName || "",
        createdAt: new Date().toISOString(),
        cases: [],
        savedLawyers: [],
        preferences: {
          language: "en",
          notifications: true,
        },
      };

      await setDoc(doc(db, "users", userCredential.user.uid), userProfile);
      setUserProfile(userProfile);

      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // Check if user profile exists, create if not
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      if (!userDoc.exists()) {
        const userProfile = {
          email: userCredential.user.email,
          displayName: userCredential.user.displayName || "",
          createdAt: new Date().toISOString(),
          cases: [],
          savedLawyers: [],
          preferences: {
            language: "en",
            notifications: true,
          },
        };
        await setDoc(doc(db, "users", userCredential.user.uid), userProfile);
      }
      
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateUserProfile = async (updates) => {
    if (!user) return { success: false, error: "No user logged in" };

    try {
      await updateDoc(doc(db, "users", user.uid), {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
      
      // Reload user profile
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data());
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;

