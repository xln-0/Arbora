import { useEffect } from "react";

import { useSettingsStore } from "@/stores/settingsStore";

export default function I18nInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialized = useSettingsStore((state) => state.initialized);

  const initialize = useSettingsStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!initialized) {
    return null; // ou un loader
  }

  return children;
}
