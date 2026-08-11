import { locales, type Locale, t } from "@/i18n";
import { useSettingsStore } from "@/stores/settingsStore";

import { AppLayout } from "@/components/layout/AppLayout";

export default function SettingsPage() {
  const locale = useSettingsStore((state) => state.locale);

  const setLocale = useSettingsStore((state) => state.setLocale);

  return (
    <AppLayout title={t(`navigation.settings`)}>
      <div className="flex h-screen flex-col">
        <main className="flex-1 overflow-auto p-6">
          <div
            className="
              max-w-2xl

              space-y-6
            "
          >
            <section
              className="
                bg-surface

                border
                border-border

                rounded-2xl

                p-6

                shadow-sm
              "
            >
              <h2
                className="
                  text-lg
                  font-semibold
                  mb-4
                "
              >
                {t(`settings.language`)}
              </h2>

              <select
                className="
                  w-full

                  border
                  border-border

                  rounded-lg

                  px-3
                  py-2
                "
                value={locale}
                onChange={(e) => setLocale(e.target.value as Locale)}
              >
                {Object.entries(locales)
                  .sort(([, a], [, b]) => a.label.localeCompare(b.label))
                  .map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.label}
                    </option>
                  ))}
              </select>
            </section>
          </div>
        </main>
      </div>
    </AppLayout>
  );
}
