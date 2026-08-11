import { SidebarNavigation } from "./SidebarNavigation";
import { SidebarFooter } from "./SidebarFooter";

import TreeSelector from "@/modules/trees/components/TreeSelector";

export function Sidebar() {
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
      <h1
        className="
          text-2xl
          font-bold
          mb-4
        "
      >
        🌳 Arbora
      </h1>

      <TreeSelector />

      <SidebarNavigation />

      <SidebarFooter />
    </aside>
  );
}
