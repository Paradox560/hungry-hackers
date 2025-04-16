"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider, SignedIn, UserButton } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { LocaleContext, preloadTranslations, translate } from "@/i18n";

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

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [locale, setLocale] = useState("en");
  const [appTitle, setAppTitle] = useState(() => {
    // Use synchronous translate for initial title
    return translate("app.title", "en") || "Get Food Support Near You";
  });
  const [isChangingLocale, setIsChangingLocale] = useState(false);

  // Try to get the stored locale from localStorage on component mount
  useEffect(() => {
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
    } catch (e) {
      console.log("Could not access localStorage");
      preloadTranslations(["en"]);
    }
  }, []);

  // Update localStorage when locale changes
  useEffect(() => {
    try {
      localStorage.setItem("locale", locale);
      document.documentElement.lang = locale;
    } catch (e) {
      console.log("Could not access localStorage");
    }
  }, [locale]);

  // Load app title based on current locale, waiting for translations to load
  useEffect(() => {
    setIsChangingLocale(true);
    preloadTranslations([locale]).then(() => {
      setAppTitle(translate("app.title", locale) || "Get Food Support Near You");
      setIsChangingLocale(false);
    });
  }, [locale]);

  // Language selector handler
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    setLocale(newLocale);
  };

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <LocaleContext.Provider value={{ locale, setLocale }}>
        <html lang={locale}>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            {/* Language change indicator */}
            {isChangingLocale && (
              <div className="fixed top-0 left-0 w-full bg-blue-500 text-white text-center py-1 text-sm z-50">
                Loading translations...
              </div>
            )}

            <header className="p-4 bg-gray-50 border-b">
              <div className="flex justify-between items-center max-w-7xl mx-auto">
                <div className="text-xl font-bold">{appTitle}</div>
                <div>
                  <select
                    value={locale}
                    onChange={handleLanguageChange}
                    className="p-2 border rounded-md"
                    aria-label="Select language"
                    disabled={isChangingLocale}
                  >
                    {supportedLocales.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
                <SignedIn>
                    <UserButton />
                </SignedIn>
              </div>
            </header>
            {children}
          </body>
        </html>
      </LocaleContext.Provider>
    </ClerkProvider>
  );
}
