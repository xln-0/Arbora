import { LogOut, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";

import { t } from "@/i18n";
import { useAuth } from "@/modules/auth/useAuth";
import { useAuthStore } from "@/stores/authStore";

const items = [
  { key: "settings", icon: Settings, to: "/settings" },
];

export function SidebarFooter({ compact = false }: { compact?: boolean }) {
  const { logout } = useAuth();
  const user = useAuthStore((state) => state.user);
  const initial = user?.email.charAt(0).toUpperCase() ?? "?";

  return (
    <div
      className={`relative mt-auto border-t border-primary/10 pt-4 ${compact ? "space-y-2" : "space-y-3"}`}
    >
      <NavLink
        to="/account"
        title={compact ? user?.email : undefined}
        aria-label={t("account.profile")}
        className={`group flex items-center rounded-2xl transition-all hover:bg-white hover:shadow-[0_5px_18px_rgba(15,23,42,0.05)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 ${compact ? "justify-center py-2" : "gap-3 p-2.5"}`}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-soft to-white text-sm font-bold text-primary ring-1 ring-primary/15 transition group-hover:shadow-sm">
          {initial}
        </span>
        {!compact && (
          <div className="min-w-0">
            <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted">
              {t("account.profile")}
            </p>
            <p className="truncate text-sm font-semibold" title={user?.email}>
              {user?.email ?? "—"}
            </p>
          </div>
        )}
      </NavLink>

      <div className="space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              title={compact ? t(`navigation.${item.key}`) : undefined}
              aria-label={t(`navigation.${item.key}`)}
              className={({ isActive }) => `
                group flex min-h-9 items-center rounded-xl text-sm font-medium transition-all
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25
                ${compact ? "justify-center px-1" : "gap-3 px-2.5"}
                ${
                  isActive
                    ? "bg-primary-soft/70 text-primary"
                    : "text-muted hover:bg-white hover:text-foreground"
                }
              `}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg transition group-hover:text-primary">
                <Icon size={16} />
              </span>
              {!compact && t(`navigation.${item.key}`)}
            </NavLink>
          );
        })}

        <button
          type="button"
          onClick={logout}
          title={compact ? t("account.logout") : undefined}
          aria-label={t("account.logout")}
          className={`group flex min-h-9 w-full items-center rounded-xl text-sm font-medium text-muted transition hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200 ${compact ? "justify-center px-1" : "gap-3 px-2.5"}`}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg">
            <LogOut size={16} />
          </span>
          {!compact && t("account.logout")}
        </button>
      </div>
    </div>
  );
}
