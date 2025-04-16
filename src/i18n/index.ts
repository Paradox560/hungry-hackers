import { createContext, useContext, useEffect, useState, useCallback } from "react";

// Create the locale context
export const LocaleContext = createContext({
  locale: "en",
  setLocale: (locale: string) => {},
});

// Cache for translation files to improve performance
const translationsCache: Record<string, any> = {
  en: null, // Will be populated when first requested
};

// Cache for individual translation strings
const stringCache: Record<string, Record<string, string>> = {};

// Helper function to get a nested value from an object using a dot-notation path
const getNestedValue = (obj: any, path: string): string | null => {
  if (!obj) return null;

  try {
    return path.split(".").reduce((prev, curr) => {
      if (prev === null || prev === undefined || prev[curr] === undefined) {
        return null;
      }
      return prev[curr];
    }, obj);
  } catch (error) {
    console.error(`Translation error for path: ${path}`, error);
    return null;
  }
};

// Handle variable interpolation in translation strings
const interpolate = (text: string, params?: Record<string, any>): string => {
  if (!params || !text) return text || "";

  return text.replace(/\{\{([^}]+)\}\}/g, (_, key) => {
    const trimmedKey = key.trim();
    return params[trimmedKey] !== undefined
      ? String(params[trimmedKey])
      : `{{${trimmedKey}}}`;
  });
};

// Preload translations for common languages
export const preloadTranslations = async (locales: string[] = ["en"]) => {
  try {
    for (const locale of locales) {
      if (!translationsCache[locale]) {
        const module = await import(
          `../../public/locales/${locale}/common.json`
        );
        translationsCache[locale] = module.default;
      }
    }
    return true;
  } catch (error) {
    console.error("Failed to preload translations:", error);
    return false;
  }
};

// Function to load a translation file and cache it
const loadTranslationFile = async (locale: string): Promise<any> => {
  if (translationsCache[locale]) {
    return translationsCache[locale];
  }

  try {
    const module = await import(`../../public/locales/${locale}/common.json`);
    translationsCache[locale] = module.default;
    return module.default;
  } catch (error) {
    console.error(`Error loading translations for locale: ${locale}`, error);
    // Try to load English as fallback if it wasn't already the requested locale
    if (locale !== "en" && !translationsCache["en"]) {
      try {
        const enModule = await import(`../../public/locales/en/common.json`);
        translationsCache["en"] = enModule.default;
        return enModule.default;
      } catch (e) {
        console.error("Failed to load English fallback translations", e);
      }
    }
    return null;
  }
};

// Translation function that works both synchronously and asynchronously
export const translate = (
  key: string,
  locale: string = "en",
  params?: Record<string, any>
): string => {
  // Check if this specific translation is already cached
  const cacheKey = `${locale}:${key}`;
  if (stringCache[cacheKey]) {
    const cachedValue = stringCache[cacheKey];
    return params ? interpolate(cachedValue, params) : cachedValue;
  }

  // If we have the translations loaded for this locale, use them
  if (translationsCache[locale]) {
    const value = getNestedValue(translationsCache[locale], key);
    if (value && typeof value === "string") {
      // Cache this string for future use
      stringCache[cacheKey] = value;
      return params ? interpolate(value, params) : value;
    }
  }

  // If we don't have a translation, return the key as fallback
  // This could happen on first render before translations are loaded
  return key;
};

// Custom hook for using translations in components
export function useTranslation() {
    const { locale } = useContext(LocaleContext);
    const [isLoaded, setIsLoaded] = useState(false);
  
    useEffect(() => {
      let isMounted = true;
      const load = async () => {
        await loadTranslationFile(locale);
        if (isMounted) {
          setIsLoaded(true);
        }
      };
      load();
      return () => {
        isMounted = false;
      };
    }, [locale]);
  
    // Memoize the translation function so its reference is stable
    const t = useCallback(
      (key: string, params?: Record<string, any>): string => {
        return translate(key, locale, params);
      },
      [locale]
    );
  
    return { t, locale, isLoaded };
  }
  

// Initialize by preloading English translations
if (typeof window !== "undefined") {
  preloadTranslations(["en"]);
}
