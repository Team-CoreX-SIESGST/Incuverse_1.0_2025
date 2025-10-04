"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export function LanguageProvider({ children, initialLocale = "en" }) {
  const [locale, setLocale] = useState(initialLocale);
  const [messages, setMessages] = useState({});

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const messages = await import(`../messages/${locale}.json`);
        setMessages(messages.default);
      } catch (error) {
        console.error("Failed to load messages:", error);
        // Fallback to English
        const fallbackMessages = await import("../messages/en.json");
        setMessages(fallbackMessages.default);
      }
    };

    loadMessages();
  }, [locale]);

  const changeLanguage = (newLocale) => {
    setLocale(newLocale);
    // Save to localStorage for persistence
    if (typeof window !== "undefined") {
      localStorage.setItem("preferred-language", newLocale);
    }
  };

  return (
    <LanguageContext.Provider value={{ locale, messages, changeLanguage }}>
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
