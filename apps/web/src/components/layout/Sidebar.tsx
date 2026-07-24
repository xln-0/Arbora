import { LogOut } from "lucide-react";

import { Button } from "@/components/ui";

import { useAuth } from "@/modules/auth/useAuth";

import { SidebarNavigation } from "./SidebarNavigation";

import { t } from "@/i18n";

export function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside
      className="
        flex
        h-screen
        w-48
        flex-col

        border-r
        border-border

        bg-surface/80
        backdrop-blur

        p-6
      "
    >
      {/* Header */}
      <h1
        className="
            text-2xl
            font-bold
          "
      >
        🌳 Arbora
      </h1>

      <SidebarNavigation />

      {/* Footer */}
      <div
        className="
          mt-auto
          border-t
          border-border
          pt-4
        "
      >
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={logout}
        >
          <LogOut size={18} />
          {t(`account.logout`)}
        </Button>
      </div>
    </aside>
  );
}
