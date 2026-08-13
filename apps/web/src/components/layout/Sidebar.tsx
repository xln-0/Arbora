import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { t } from "@/i18n";
import TreeSelector from "@/modules/trees/components/TreeSelector";

import { SidebarFooter } from "./SidebarFooter";
import { SidebarNavigation } from "./SidebarNavigation";

export function Sidebar() {
  const [isCompact, setIsCompact] = useState(
    () => localStorage.getItem("sidebar-compact") === "true",
  );

  function toggleSidebar() {
    setIsCompact((current) => {
      const next = !current;
      localStorage.setItem("sidebar-compact", String(next));
      return next;
    });
  }

  return (
    <aside
      className={`sticky top-0 z-40 flex h-screen shrink-0 flex-col overflow-hidden border-r border-primary/10 bg-gradient-to-b from-surface via-surface to-primary-soft/35 shadow-[8px_0_32px_rgba(15,23,42,0.04)] transition-[width,padding] duration-300 ease-out ${
        isCompact ? "w-[4.75rem] px-2.5 py-3" : "w-64 px-4 py-4"
      }`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-14 top-24 h-36 w-36 rounded-full bg-primary/8 blur-3xl"
      />

      <div
        className={`relative flex min-h-12 items-center ${isCompact ? "flex-col gap-2" : "gap-3 px-1"}`}
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[0.9rem] bg-gradient-to-br from-primary-soft to-surface ring-1 ring-primary/15 shadow-lg shadow-primary/10">
          <img
            src="/brand/arbora-mark.png"
            alt=""
            className="h-8 w-8 object-contain"
          />
        </span>
        <div className={`min-w-0 flex-1 ${isCompact ? "hidden" : "block"}`}>
          <h1 className="text-[1.15rem] font-bold tracking-[-0.03em] text-foreground">
            {t("app.name")}
          </h1>
          <p className="mt-0.5 truncate text-[0.7rem] font-medium text-muted">
            {t("app.tagline")}
          </p>
        </div>

        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={t(isCompact ? "sidebar.expand" : "sidebar.collapse")}
          title={t(isCompact ? "sidebar.expand" : "sidebar.collapse")}
          className={`flex shrink-0 items-center justify-center rounded-lg text-muted transition-all hover:bg-primary-soft hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
            isCompact ? "h-8 w-8" : "h-9 w-9"
          }`}
        >
          {isCompact ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <div className="relative mt-6">
        {!isCompact && (
          <p className="mb-2 px-1 text-[0.625rem] font-bold uppercase tracking-[0.18em] text-muted/80">
            {t("navigation.currentTree")}
          </p>
        )}
        <TreeSelector compact={isCompact} />
      </div>

      <SidebarNavigation compact={isCompact} />
      <SidebarFooter compact={isCompact} />
    </aside>
  );
}
