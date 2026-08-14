import type { ReactNode } from "react";
import { Menu } from "lucide-react";

import { t } from "@/i18n";

interface TopbarProps {
  title: string;
  badge?: ReactNode;
  actions?: ReactNode;
  onOpenNavigation?: () => void;
  isNavigationOpen?: boolean;
}

export function Topbar({
  title,
  badge,
  actions,
  onOpenNavigation,
  isNavigationOpen = false,
}: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex min-h-16 shrink-0 flex-wrap items-center justify-between gap-2 overflow-hidden border-b border-primary/10 bg-gradient-to-r from-primary/10 via-surface to-secondary/60 px-3 py-2 shadow-[0_6px_22px_rgba(15,23,42,0.05)] backdrop-blur-xl sm:gap-4 sm:px-5 md:flex-nowrap md:py-0 lg:px-7">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-20 h-36 w-36 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenNavigation}
          aria-label={t("sidebar.open")}
          aria-controls="mobile-navigation"
          aria-expanded={isNavigationOpen}
          title={t("sidebar.open")}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/10 bg-surface/80 text-foreground shadow-sm transition hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 md:hidden"
        >
          <Menu size={19} />
        </button>
        <span className="hidden h-8 w-1 shrink-0 rounded-full bg-gradient-to-b from-primary to-primary/35 shadow-sm sm:block" />
        <div className="min-w-0">
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-primary/75">
            Arbora
          </p>
          <div className="flex min-w-0 items-center gap-3">
            <h1 className="truncate text-base font-semibold tracking-tight sm:text-lg lg:text-xl">
              {title}
            </h1>
            {badge}
          </div>
        </div>
      </div>

      {actions && (
        <div className="relative flex w-full shrink-0 items-center justify-end gap-2 overflow-x-auto md:w-auto">
          {actions}
        </div>
      )}
    </header>
  );
}
