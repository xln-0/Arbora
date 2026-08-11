import { LogOut, Settings, User } from "lucide-react";
import { NavLink } from "react-router-dom";

import { t } from "@/i18n";
import { useAuth } from "@/modules/auth/useAuth";
import { useAuthStore } from "@/stores/authStore";

const items = [
  { key: "settings", icon: Settings, to: "/settings" },
  { key: "account", icon: User, to: "/account" },
];

export function SidebarFooter() {
  const { logout } = useAuth();
  const user = useAuthStore((state) => state.user);
  const initial = user?.email.charAt(0).toUpperCase() ?? "?";

  return (
    <div className="mt-auto space-y-3 border-t border-border pt-4">
      <div className="flex items-center gap-3 rounded-2xl bg-surface-muted/70 p-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-sm font-semibold text-primary">
          {initial}
        </span>
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted">{t("account.profile")}</p>
          <p className="truncate text-sm font-semibold" title={user?.email}>
            {user?.email ?? "—"}
          </p>
        </div>
      </div>

      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition
                ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted hover:bg-surface-muted hover:text-foreground"
                }
              `}
            >
              <Icon size={17} />
              {t(`navigation.${item.key}`)}
            </NavLink>
          );
        })}

        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted transition hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={17} />
          {t("account.logout")}
        </button>
      </div>
    </div>
  );
}
