import { create } from "zustand";

import type { Locale } from "@/i18n/locales";
import { loadLocale } from "@/i18n/loadLocale";
import { detectLocale } from "@/i18n/detectLocale";

interface SettingsState {
  initialized: boolean;
  locale: Locale;
  messages: Record<string, any>;

  initialize(): Promise<void>;
  setLocale: (locale: Locale) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  initialized: false,
  locale: "fr",
  messages: {},

  async initialize() {
    const locale = detectLocale();

    const messages = await loadLocale(locale);

    set({
      locale,
      messages,
      initialized: true,
    });
  },

  async setLocale(locale) {
    const messages = await loadLocale(locale);

    localStorage.setItem("locale", locale);

    set({
      locale,
      messages,
    });
  },
}));
