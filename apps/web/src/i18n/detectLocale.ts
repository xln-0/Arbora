import type { Locale } from "./locales";

import { locales } from "./locales";

export function detectLocale(): Locale {
  // 1. Choix utilisateur
  const savedLocale = localStorage.getItem("locale");

  if (savedLocale && savedLocale in locales) {
    return savedLocale as Locale;
  }

  // 2. Langue navigateur
  const browserLocale = navigator.language.split("-")[0];

  if (browserLocale in locales) {
    return browserLocale as Locale;
  }

  // 3. Défaut
  return "fr";
}
