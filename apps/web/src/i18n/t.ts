import { useSettingsStore } from "@/stores/settingsStore";

export function t(path: string, params?: Record<string, string>): string {
  const { messages } = useSettingsStore.getState();

  let value: unknown = messages;

  for (const key of path.split(".")) {
    if (typeof value !== "object" || value === null) {
      return path;
    }

    value = (value as Record<string, unknown>)[key];
  }

  if (typeof value !== "string") {
    return path;
  }

  if (!params) {
    return value;
  }

  return Object.entries(params).reduce(
    (text, [key, replacement]) => text.replace(`{{${key}}}`, replacement),
    value,
  );
}
