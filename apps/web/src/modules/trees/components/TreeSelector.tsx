import { ChevronDown, TreePine } from "lucide-react";

import { t } from "@/i18n";
import { useTreeStore } from "@/stores/treeStore";

export default function TreeSelector({
  compact = false,
}: {
  compact?: boolean;
}) {
  const trees = useTreeStore((state) => state.trees);
  const selectedTreeId = useTreeStore((state) => state.selectedTreeId);
  const selectTree = useTreeStore((state) => state.selectTree);

  if (trees.length === 0) {
    return (
      <div
        title={t("tree.empty")}
        className={`flex min-h-12 items-center rounded-2xl border border-dashed border-primary/20 bg-primary-soft/40 text-sm text-muted ${compact ? "justify-center" : "gap-3 px-3"}`}
      >
        <TreePine size={17} />
        {!compact && t("tree.empty")}
      </div>
    );
  }

  return (
    <div
      title={compact ? trees.find((tree) => tree.id === selectedTreeId)?.name : undefined}
      className={`group relative flex items-center overflow-hidden border border-border/90 bg-surface/85 shadow-sm backdrop-blur transition-all hover:border-primary/25 hover:bg-surface hover:shadow-md focus-within:border-primary/35 focus-within:ring-2 focus-within:ring-primary/10 ${compact ? "min-h-12 justify-center rounded-xl" : "min-h-[3.35rem] rounded-2xl"}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-2 left-0 w-0.5 rounded-r-full bg-primary/65"
      />
      <span
        className={`${compact ? "" : "ml-3"} relative flex h-8 w-8 shrink-0 items-center justify-center rounded-[0.7rem] bg-primary-soft text-primary ring-1 ring-primary/10 transition-colors group-hover:bg-primary/15`}
      >
        <TreePine size={15} />
      </span>

      <select
        value={selectedTreeId ?? ""}
        onChange={(event) => selectTree(event.target.value)}
        aria-label={t("navigation.currentTree")}
        className={
          compact
            ? "absolute inset-0 cursor-pointer opacity-0"
            : "relative min-w-0 flex-1 cursor-pointer appearance-none truncate bg-transparent py-2.5 pl-2.5 pr-9 text-sm font-semibold text-foreground outline-none"
        }
      >
        {trees.map((tree) => (
          <option key={tree.id} value={tree.id}>
            {tree.name}
          </option>
        ))}
      </select>

      {!compact && (
        <ChevronDown
          size={14}
          className="pointer-events-none absolute right-3.5 text-muted/70 transition-all group-hover:text-primary group-focus-within:rotate-180 group-focus-within:text-primary"
        />
      )}
    </div>
  );
}
