import type { ReactNode } from "react";

interface TopbarProps {
  title: string;
  badge?: ReactNode;
  actions?: ReactNode;
}

export function Topbar({ title, badge, actions }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 overflow-hidden border-b border-primary/10 bg-gradient-to-r from-primary/10 via-surface to-secondary/60 px-5 shadow-[0_6px_22px_rgba(15,23,42,0.05)] backdrop-blur-xl lg:px-7">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-20 h-36 w-36 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="flex min-w-0 items-center gap-3">
        <span className="hidden h-8 w-1 shrink-0 rounded-full bg-gradient-to-b from-primary to-primary/35 shadow-sm sm:block" />
        <div className="min-w-0">
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-primary/75">
            Arbora
          </p>
          <div className="flex min-w-0 items-center gap-3">
            <h1 className="truncate text-lg font-semibold tracking-tight lg:text-xl">
              {title}
            </h1>
            {badge}
          </div>
        </div>
      </div>

      {actions && (
        <div className="relative flex shrink-0 items-center gap-2">
          {actions}
        </div>
      )}
    </header>
  );
}
