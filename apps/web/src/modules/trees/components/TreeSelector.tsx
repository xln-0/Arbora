import { ChevronDown, TreePine } from "lucide-react";

import { useTreeStore } from "@/stores/treeStore";

export default function TreeSelector() {
  const trees = useTreeStore((state) => state.trees);
  const selectedTreeId = useTreeStore((state) => state.selectedTreeId);
  const selectTree = useTreeStore((state) => state.selectTree);

  if (trees.length === 0) {
    return (
      <div
        className="
          flex
          h-10
          items-center
          gap-2

          rounded-lg

          border
          border-border

          bg-background

          px-3
        "
      >
        <TreePine size={16} />
        Aucun arbre
      </div>
    );
  }

  return (
    <div
      className="
        relative

        flex
        items-center
        gap-2
      "
    >
      <div
        className="
          flex
          items-center
          gap-2

          w-full
          
          h-9

          rounded-lg

          border
          border-border

          bg-surface

          px-3

          shadow-sm

          transition

          hover:bg-surface-muted
        "
      >
        <select
          value={selectedTreeId ?? ""}
          onChange={(event) => selectTree(event.target.value)}
          className="
            w-full
            appearance-none
            bg-transparent

            text-sm
            font-medium

            outline-none

            cursor-pointer

            pr-5

            truncate
          "
        >
          {trees.map((tree) => (
            <option key={tree.id} value={tree.id}>
              {tree.name}
            </option>
          ))}
        </select>

        <ChevronDown
          size={14}
          className="
            pointer-events-none

            absolute
            right-3

            text-muted-foreground
          "
        />
      </div>
    </div>
  );
}
