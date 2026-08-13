import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

import fr from "@/i18n/locales/fr";
import { useSettingsStore } from "@/stores/settingsStore";

useSettingsStore.setState({
  initialized: true,
  locale: "fr",
  messages: fr,
});

afterEach(() => cleanup());
