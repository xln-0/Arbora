import { Check, Languages, MonitorCog } from "lucide-react";

import { AppLayout } from "@/components/layout";
import { locales, type Locale, t } from "@/i18n";
import { useSettingsStore } from "@/stores/settingsStore";

export default function SettingsPage() {
  const locale = useSettingsStore((state) => state.locale);
  const setLocale = useSettingsStore((state) => state.setLocale);

  return (
    <AppLayout title={t("navigation.settings")}>
      <main className="mx-auto max-w-5xl space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
        <header className="overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
          <div className="bg-gradient-to-br from-primary/15 via-surface to-secondary/40 px-6 py-8 sm:px-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-sm">
              <MonitorCog size={22} />
            </span>
            <h1 className="mt-5 text-2xl font-semibold tracking-tight">
              {t("settings.appTitle")}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              {t("settings.appDescription")}
            </p>
          </div>
        </header>

        <section className="rounded-3xl border border-border bg-surface p-4 shadow-sm sm:p-7">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
              <Languages size={20} />
            </span>
            <div>
              <h2 className="font-semibold">{t("settings.language")}</h2>
              <p className="mt-1 text-sm leading-6 text-muted">
                {t("settings.languageDescription")}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {Object.entries(locales)
              .sort(([, a], [, b]) => a.label.localeCompare(b.label))
              .map(([key, value]) => {
                const isSelected = key === locale;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setLocale(key as Locale)}
                    aria-pressed={isSelected}
                    className={`flex items-center justify-between rounded-2xl border p-4 text-left transition ${
                      isSelected
                        ? "border-primary/30 bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/20 hover:bg-surface-muted"
                    }`}
                  >
                    <span>
                      <span className="block text-sm font-semibold">
                        {value.label}
                      </span>
                      <span className="mt-1 block text-xs uppercase tracking-wider text-muted">
                        {key}
                      </span>
                    </span>
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        isSelected
                          ? "bg-primary text-white"
                          : "bg-surface-muted text-transparent"
                      }`}
                    >
                      <Check size={16} />
                    </span>
                  </button>
                );
              })}
          </div>
        </section>
      </main>
    </AppLayout>
  );
}
