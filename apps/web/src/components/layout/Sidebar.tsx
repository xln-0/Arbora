import { TreePine } from "lucide-react";

import { t } from "@/i18n";
import TreeSelector from "@/modules/trees/components/TreeSelector";

import { SidebarFooter } from "./SidebarFooter";
import { SidebarNavigation } from "./SidebarNavigation";

export function Sidebar() {
  return (
    <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-border bg-surface/95 p-4 shadow-[4px_0_24px_rgba(17,24,39,0.03)] backdrop-blur">
      <div className="flex items-center gap-3 px-2 py-2">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-sm shadow-primary/20">
          <TreePine size={23} />
        </span>
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight">{t("app.name")}</h1>
          <p className="truncate text-xs text-muted">{t("app.tagline")}</p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-surface-muted/60 p-2">
        <p className="mb-2 px-2 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted">
          {t("navigation.currentTree")}
        </p>
        <TreeSelector />
      </div>

      <SidebarNavigation />
      <SidebarFooter />
    </aside>
  );
}
