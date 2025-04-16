"use client";

import { Locale, getDict } from "../lib/dictionaries";
import { createContext, JSX, useContext, useEffect, useState } from "react";
import Loading from "./loading";

export interface I18nContextType {
  locale: Locale;
  dict: { [key: string]: any };
  loading: boolean;
}

const I18nContext = createContext<I18nContextType>(null!);

export default function I18nProvider({
  children,
  locale,
}: {
  children: JSX.Element;
  locale: Locale;
}): JSX.Element {
  const [dict, setDict] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    getDict(locale)
      .then((res) => setDict(res))
      .catch((e) => setError("Unable to load this page. Please try again later."))
      .finally(() => setLoading(false));
  }, [locale]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <I18nContext.Provider value={{ locale, dict, loading }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}