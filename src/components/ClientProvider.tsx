"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { LocaleContext, preloadTranslations } from "@/i18n";
import Navbar from "@/components/Navbar";
import Loading from "@/app/components/Loading";

interface ClientProviderProps {
  children: ReactNode;
}

export default function ClientProvider({ children }: ClientProviderProps) {
  const [locale, setLocale] = useState("en");
  const [isChangingLocale, setIsChangingLocale] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state when component mounts on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Try to get the stored locale from localStorage on component mount
  useEffect(() => {
    if (!isMounted) return;

    try {
      const savedLocale = localStorage.getItem("locale");
      if (savedLocale) {
        setLocale(savedLocale);
        // Preload this locale's translations
        preloadTranslations([savedLocale]);
      } else {
        // Just preload English
        preloadTranslations(["en"]);
      }
    } catch {
      console.log("Could not access localStorage");
      preloadTranslations(["en"]);
    }
  }, [isMounted]);

  // Update localStorage when locale changes
  useEffect(() => {
    if (!isMounted) return;

    try {
      localStorage.setItem("locale", locale);
      document.documentElement.lang = locale;
    } catch {
      console.log("Could not access localStorage");
    }
  }, [locale, isMounted]);

  // Load translations when locale changes
  useEffect(() => {
    if (!isMounted) return;

    setIsChangingLocale(true);
    preloadTranslations([locale]).then(() => {
      setIsChangingLocale(false);
    });
  }, [locale, isMounted]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {/* Language change indicator - only show after mounting */}
      {isMounted && isChangingLocale && (
        <Loading />
      )}

      <Navbar isChangingLocale={isChangingLocale} />

      {children}
    </LocaleContext.Provider>
  );
}
