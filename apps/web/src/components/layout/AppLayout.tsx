import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

import "@xyflow/react/dist/style.css";

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
  actions?: React.ReactNode;
}

export function AppLayout({ children, title, actions }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Topbar title={title} actions={actions} />

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
