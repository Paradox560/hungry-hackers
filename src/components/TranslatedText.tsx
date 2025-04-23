"use client";

import { useTranslation, translate } from "@/i18n";
import { useState, useEffect } from "react";

interface TranslatedTextProps {
  textKey: string;
  params?: Record<string, any>;
  fallback?: string;
  className?: string;
}

export default function TranslatedText({
  textKey,
  params,
  fallback = "",
  className = "",
}: TranslatedTextProps) {
  const { t, locale, isLoaded } = useTranslation();
  const [translatedText, setTranslatedText] = useState(
    // Use synchronous translate for initial render
    fallback || translate(textKey, locale, params) || textKey
  );

  useEffect(() => {
    // Update the text when locale changes or translations load
    setTranslatedText(t(textKey, params));
  }, [locale, textKey, params, t, isLoaded]);

  return <span className={className}>{translatedText}</span>;
}
