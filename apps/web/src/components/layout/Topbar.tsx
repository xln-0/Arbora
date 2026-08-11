import type { ReactNode } from "react";

interface TopbarProps {
  title: string;
  badge?: ReactNode;
  actions?: ReactNode;
}

export function Topbar({ title, badge, actions }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-20 shrink-0 items-center justify-between gap-4 border-b border-border bg-surface/90 px-6 backdrop-blur-xl lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <span className="hidden h-8 w-1 shrink-0 rounded-full bg-primary sm:block" />
        <div className="min-w-0">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted">
            Arbora
          </p>
          <div className="flex min-w-0 items-center gap-3">
            <h1 className="truncate text-xl font-semibold tracking-tight lg:text-2xl">
              {title}
            </h1>
            {badge}
          </div>
        </div>
      </div>

      {actions && (
        <div className="flex shrink-0 items-center gap-2 rounded-xl border border-border bg-surface-muted/50 p-1.5 shadow-sm">
          {actions}
        </div>
      )}
    </header>
  );
}
