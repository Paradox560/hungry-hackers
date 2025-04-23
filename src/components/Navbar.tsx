"use client";

import React, { useEffect, useState } from "react";
import { SignedIn, UserButton, useUser, SignedOut } from "@clerk/nextjs";
import { useContext } from "react";
import { LocaleContext } from "@/i18n";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Button from "@mui/material/Button";
import Link from "next/link";

// Supported languages configuration
const supportedLocales = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "ar", name: "العربية" },
  { code: "zh", name: "中文" },
  { code: "vi", name: "Tiếng Việt" },
  { code: "am", name: "አማርኛ" },
];

// App title translations
const appTitleTranslations: Record<string, string> = {
  en: "Capital Area Food Chat",
  es: "Chat de Alimentos del Área Capital",
  fr: "Discussion sur l'Alimentation de la Région Capitale",
  ar: "دردشة الغذاء في منطقة العاصمة",
  zh: "首都地区食品聊天",
  vi: "Trò Chuyện về Thực Phẩm Khu Vực Thủ Đô",
  am: "የካፒታል አካባቢ የምግብ ቻት",
};

interface NavbarProps {
  isChangingLocale?: boolean;
}

export default function Navbar({ isChangingLocale = false }: NavbarProps) {
  const { locale, setLocale } = useContext(LocaleContext);
  const { user, isSignedIn, isLoaded } = useUser();
  // Add a mounting state to prevent hydration mismatch
  const [isMounted, setIsMounted] = useState(false);

  // Get the translated app title based on current locale
  const getAppTitle = () => {
    return appTitleTranslations[locale] || appTitleTranslations.en;
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Save language preference to Firestore
  const saveLanguagePreference = async (languageCode: string) => {
    if (!isSignedIn || !user) return;

    if (!db) return;

    try {
      const userDocRef = doc(db, "users", user.id);
      await setDoc(userDocRef, { language: languageCode }, { merge: true });
      console.log(`User language preference saved: ${languageCode}`);
    } catch (error) {
      console.error("Error saving language preference:", error);
    }
  };

  // Load user's language preference from Firestore
  const loadLanguagePreference = async () => {
    if (!isSignedIn || !user) return;

    if (!db) return;

    try {
      const userDocRef = doc(db, "users", user.id);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.language && userData.language !== locale) {
          setLocale(userData.language);
        }
      } else {
        // User document doesn't exist yet, create it with default language
        await setDoc(userDocRef, { language: locale }, { merge: true });
      }
    } catch (error) {
      console.error("Error loading language preference:", error);
    }
  };

  // Effect to load user's language preference when user is loaded
  useEffect(() => {
    if (isLoaded && isSignedIn && isMounted) {
      loadLanguagePreference();
    }
  }, [isLoaded, isSignedIn, isMounted]);

  // Language selector handler
  const handleLanguageChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newLocale = e.target.value;
    setLocale(newLocale);

    // Save to localStorage for persistence (keeping this for non-signed-in users)
    try {
      localStorage.setItem("locale", newLocale);
    } catch {
      console.log("Could not access localStorage");
    }

    // If user is signed in, save to Firestore
    if (isSignedIn && user) {
      await saveLanguagePreference(newLocale);
    }
  };

  // Only render the fully interactive component after client-side hydration
  if (!isMounted) {
    return (
      <header className="p-4 bg-gray-50 border-b">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="text-xl text-black font-bold">{getAppTitle()}</div>
          <div className="flex items-center space-x-3">
            {/* Static placeholder for select during SSR */}
            <div className="p-2 text-black border rounded-md">
              {locale === "en" ? "English" : "..."}
            </div>
            {/* Placeholder for user button */}
            <div className="ml-2 w-8 h-8"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="p-4 bg-gray-50 border-b">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-xl text-black font-bold">
          <Link href="/" className="hover:underline">{getAppTitle()}</Link>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={locale}
            onChange={handleLanguageChange}
            className="p-2 text-black border rounded-md"
            aria-label="Select language"
            disabled={isChangingLocale}
          >
            {supportedLocales.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
          <SignedIn>
            <div className="ml-2">
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
          <SignedOut>
            <div className="ml-2">
              <Button href="/sign-in">Sign In</Button>
            </div>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
