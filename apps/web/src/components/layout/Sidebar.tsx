import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useLocation } from "react-router-dom";

import { t } from "@/i18n";
import TreeSelector from "@/modules/trees/components/TreeSelector";

import { SidebarFooter } from "./SidebarFooter";
import { SidebarNavigation } from "./SidebarNavigation";

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({
  isMobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia("(max-width: 767px)").matches,
  );
  const [isCompact, setIsCompact] = useState(
    () => localStorage.getItem("sidebar-compact") === "true",
  );
  const compact = !isMobile && isCompact;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleChange = (event: MediaQueryListEvent) =>
      setIsMobile(event.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    onMobileClose?.();
  }, [location.pathname, onMobileClose]);

  useEffect(() => {
    if (!isMobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onMobileClose?.();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileOpen, onMobileClose]);

  function toggleSidebar() {
    setIsCompact((current) => {
      const next = !current;
      localStorage.setItem("sidebar-compact", String(next));
      return next;
    });
  }

  return (
    <>
      {isMobileOpen && (
        <button
          type="button"
          aria-label={t("sidebar.close")}
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-[2px] md:hidden"
        />
      )}
      <aside
        id="mobile-navigation"
        aria-label={t("navigation.explore")}
        inert={isMobile && !isMobileOpen}
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-[min(20rem,calc(100vw-2rem))] shrink-0 flex-col overflow-x-hidden overflow-y-auto border-r border-primary/10 bg-gradient-to-b from-surface via-surface to-primary-soft/35 px-4 py-4 shadow-[8px_0_32px_rgba(15,23,42,0.12)] transition-[width,padding,transform] duration-300 ease-out md:sticky md:top-0 md:z-40 md:h-screen md:translate-x-0 md:shadow-[8px_0_32px_rgba(15,23,42,0.04)] ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${
          compact ? "md:w-[4.75rem] md:px-2.5 md:py-3" : "md:w-64 md:px-4 md:py-4"
        }`}
      >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-14 top-24 h-36 w-36 rounded-full bg-primary/8 blur-3xl"
      />

      <div
        className={`relative flex min-h-12 items-center ${compact ? "flex-col gap-2" : "gap-3 px-1"}`}
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[0.9rem] bg-gradient-to-br from-primary-soft to-surface ring-1 ring-primary/15 shadow-lg shadow-primary/10">
          <img
            src="/brand/arbora-mark.png"
            alt=""
            className="h-8 w-8 object-contain"
          />
        </span>
        <div className={`min-w-0 flex-1 ${compact ? "hidden" : "block"}`}>
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
          aria-label={t(compact ? "sidebar.expand" : "sidebar.collapse")}
          title={t(compact ? "sidebar.expand" : "sidebar.collapse")}
          className={`hidden shrink-0 items-center justify-center rounded-lg text-muted transition-all hover:bg-primary-soft hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 md:flex ${
            compact ? "h-8 w-8" : "h-9 w-9"
          }`}
        >
          {compact ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
        <button
          type="button"
          onClick={onMobileClose}
          aria-label={t("sidebar.close")}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-muted transition hover:bg-primary-soft hover:text-primary md:hidden"
        >
          <X size={19} />
        </button>
      </div>

      <div className="relative mt-6">
        {!compact && (
          <p className="mb-2 px-1 text-[0.625rem] font-bold uppercase tracking-[0.18em] text-muted/80">
            {t("navigation.currentTree")}
          </p>
        )}
        <TreeSelector compact={compact} />
      </div>

      <SidebarNavigation compact={compact} />
      <SidebarFooter compact={compact} />
      </aside>
    </>
  );
}
