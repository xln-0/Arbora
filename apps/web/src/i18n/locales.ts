export const locales = {
  fr: {
    label: "Français",
  },

  en: {
    label: "English",
  },
} as const;

export type Locale = keyof typeof locales;
