import { History, List, Network } from "lucide-react";
import { NavLink } from "react-router-dom";

import { t } from "@/i18n";

const items = [
  { key: "tree", icon: Network, to: "/" },
  { key: "elements", icon: List, to: "/elements" },
  { key: "timeline", icon: History, to: "/timeline" },
];

export function SidebarNavigation({ compact = false }: { compact?: boolean }) {
  return (
    <nav className="relative mt-7">
      {!compact && (
        <p className="mb-2 px-1 text-[0.625rem] font-bold uppercase tracking-[0.18em] text-muted/80">
          {t("navigation.explore")}
        </p>
      )}

      <div className="flex flex-col gap-1">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              title={compact ? t(`navigation.${item.key}`) : undefined}
              aria-label={t(`navigation.${item.key}`)}
              className={({ isActive }) => `
                group relative flex min-h-11 items-center rounded-xl text-sm font-semibold transition-all duration-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25
                ${compact ? "justify-center px-1" : "gap-3 px-2.5"}
                ${
                  isActive
                    ? "bg-white text-primary shadow-[0_5px_18px_rgba(15,23,42,0.06)] ring-1 ring-primary/10"
                    : "text-muted hover:bg-white/80 hover:text-foreground"
                }
              `}
            >
              {({ isActive }) => (
                <>
                  {isActive && !compact && (
                    <span className="absolute -left-4 h-6 w-1 rounded-r-full bg-primary shadow-md shadow-primary/35" />
                  )}
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[0.65rem] transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-br from-primary to-primary-hover text-white shadow-md shadow-primary/20"
                        : "text-muted group-hover:bg-primary-soft group-hover:text-primary"
                    }`}
                  >
                    <Icon size={17} />
                  </span>
                  {!compact && (
                    <span className="truncate">
                      {t(`navigation.${item.key}`)}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
