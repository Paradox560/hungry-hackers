export type Locale = "en" | "es" | "fr";

const dictionaries = {
  en: () => import('./en.json').then((module) => module.default),
  es: () => import('./es.json').then((module) => module.default),
  fr: () => import('./fr.json').then((module) => module.default),
}

export const getDict = async (locale: Locale) => dictionaries[locale]()