"use client";

import { useState, useEffect } from "react";
import { useTranslation, translate } from "@/i18n";

export function useLocalizedContent(contentKeys: string[]) {
  const { t, locale, isLoaded } = useTranslation();
  const [content, setContent] = useState<Record<string, string>>(() => {
    // Initialize with synchronous translations for initial render
    const initialContent: Record<string, string> = {};
    for (const key of contentKeys) {
      initialContent[key] = translate(key, locale) || key;
    }
    return initialContent;
  });

  useEffect(() => {
    // Update content when locale changes or when translations load
    const updatedContent: Record<string, string> = {};
    for (const key of contentKeys) {
      updatedContent[key] = t(key);
    }
    setContent(updatedContent);
  }, [locale, contentKeys, t, isLoaded]);

  return { content, isLoading: !isLoaded };
}
