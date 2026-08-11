import { History, List, Network } from "lucide-react";
import { NavLink } from "react-router-dom";

import { t } from "@/i18n";

const items = [
  { key: "tree", icon: Network, to: "/" },
  { key: "elements", icon: List, to: "/elements" },
  { key: "timeline", icon: History, to: "/timeline" },
];

export function SidebarNavigation() {
  return (
    <nav className="mt-6">
      <p className="mb-2 px-3 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted">
        {t("navigation.explore")}
      </p>

      <div className="flex flex-col gap-1.5">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                group flex items-center gap-3 rounded-xl px-2.5 py-2.5
                text-sm font-medium transition-all
                ${
                  isActive
                    ? "bg-primary/10 text-primary shadow-sm shadow-primary/5"
                    : "text-muted hover:bg-surface-muted hover:text-foreground"
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary text-white"
                        : "bg-surface-muted text-muted group-hover:bg-surface"
                    }`}
                  >
                    <Icon size={17} />
                  </span>
                  <span className="truncate">{t(`navigation.${item.key}`)}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
