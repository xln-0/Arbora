import { ChevronDown, TreePine } from "lucide-react";

import { t } from "@/i18n";
import { useTreeStore } from "@/stores/treeStore";

export default function TreeSelector() {
  const trees = useTreeStore((state) => state.trees);
  const selectedTreeId = useTreeStore((state) => state.selectedTreeId);
  const selectTree = useTreeStore((state) => state.selectTree);

  if (trees.length === 0) {
    return (
      <div className="flex min-h-11 items-center gap-3 rounded-xl bg-surface px-3 text-sm text-muted shadow-sm">
        <TreePine size={17} />
        {t("tree.empty")}
      </div>
    );
  }

  return (
    <div className="relative flex min-h-11 items-center rounded-xl bg-surface shadow-sm ring-1 ring-border transition hover:ring-primary/30 focus-within:ring-2 focus-within:ring-primary/20">
      <span className="ml-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
        <TreePine size={15} />
      </span>

      <select
        value={selectedTreeId ?? ""}
        onChange={(event) => selectTree(event.target.value)}
        aria-label={t("navigation.currentTree")}
        className="min-w-0 flex-1 cursor-pointer appearance-none truncate bg-transparent py-2 pl-2 pr-8 text-sm font-semibold outline-none"
      >
        {trees.map((tree) => (
          <option key={tree.id} value={tree.id}>
            {tree.name}
          </option>
        ))}
      </select>

      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-3 text-muted"
      />
    </div>
  );
}
