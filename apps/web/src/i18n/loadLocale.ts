import type { Locale } from "./locales";

const loaders = {
  fr: () => import("./locales/fr"),
  en: () => import("./locales/en"),
} satisfies Record<Locale, () => Promise<unknown>>;

export async function loadLocale(locale: Locale) {
  const module = await loaders[locale]();

  return module.default;
}
