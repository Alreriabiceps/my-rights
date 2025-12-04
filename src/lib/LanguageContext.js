"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { translations } from "./translations";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState("en"); // Default to English

  // Load language preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("language");
    if (saved && (saved === "en" || saved === "tl")) {
      setCurrentLanguage(saved);
    }
  }, []);

  // Set language and save to localStorage
  const setLanguage = (lang) => {
    if (lang === "en" || lang === "tl") {
      setCurrentLanguage(lang);
      localStorage.setItem("language", lang);
    }
  };

  const t = (key) => {
    return translations[currentLanguage]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export default LanguageContext;
