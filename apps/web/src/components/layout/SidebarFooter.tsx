import { LogOut, Settings, User } from "lucide-react";
import { NavLink } from "react-router-dom";

import { Button } from "@/components/ui";

import { t } from "@/i18n";
import { useAuth } from "@/modules/auth/useAuth";

export function SidebarFooter() {
  const { logout } = useAuth();

  return (
    <div
      className="
        mt-auto

        border-t
        border-border

        pt-4

        flex
        flex-col
        gap-2
      "
    >
      <NavLink
        to="/settings"
        className={({ isActive }) =>
          `
            flex
            items-center
            gap-3

            rounded-lg

            px-3
            py-2

            text-sm

            transition

            ${
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-surface-muted"
            }
          `
        }
      >
        <Settings size={18} />

        {t("navigation.settings")}
      </NavLink>

      <Button
        variant="secondary"
        className="
          w-full
          justify-start
          gap-3
        "
        onClick={logout}
      >
        <LogOut size={18} />

        {t("account.logout")}
      </Button>
    </div>
  );
}
