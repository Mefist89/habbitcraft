"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import en from "@/locales/en.json";
import ro from "@/locales/ro.json";

// Type definition for available languages
export type Language = "en" | "ro";

// Dictionary mapping
const dictionaries = {
  en,
  ro,
};

// Define structure of the context
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (targetPath: string) => string;
}

// Helper to access nested object properties via string path like "settings.profile.title"
const getNestedValue = (obj: any, path: string): string => {
  return path.split(".").reduce((currentObject, key) => {
    return currentObject && currentObject[key] !== undefined ? currentObject[key] : path;
  }, obj) as string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [isMounted, setIsMounted] = useState(false);

  // Load saved language from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    const savedLang = localStorage.getItem("habbitcraft-language") as Language;
    if (savedLang && (savedLang === "en" || savedLang === "ro")) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("habbitcraft-language", lang);
  };

  // Translation function
  const t = (path: string): string => {
    const dictionary = dictionaries[language];
    return getNestedValue(dictionary, path);
  };

  // Prevent hydration mismatch by optionally rendering a loader or nothing until mounted,
  // but for text, it's usually okay. We'll just render it. If hydration mismatch occurs, 
  // we might need to handle it. For now, we render the children directly.
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook for easier consumption
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
