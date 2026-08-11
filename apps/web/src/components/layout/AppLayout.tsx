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
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} actions={actions} badge={topbarBadge} />

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
