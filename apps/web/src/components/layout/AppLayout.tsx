import { useCallback, useState } from "react";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

import "@xyflow/react/dist/style.css";

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
  actions?: React.ReactNode;
  topbarBadge?: React.ReactNode;
}

export function AppLayout({
  children,
  title,
  actions,
  topbarBadge,
}: AppLayoutProps) {
  const [isMobileNavigationOpen, setIsMobileNavigationOpen] = useState(false);
  const closeMobileNavigation = useCallback(
    () => setIsMobileNavigationOpen(false),
    [],
  );

  return (
    <div className="flex min-h-screen">
      <Sidebar
        isMobileOpen={isMobileNavigationOpen}
        onMobileClose={closeMobileNavigation}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          title={title}
          actions={actions}
          badge={topbarBadge}
          onOpenNavigation={() => setIsMobileNavigationOpen(true)}
          isNavigationOpen={isMobileNavigationOpen}
        />

        <main className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</main>
      </div>
    </div>
  );
}
