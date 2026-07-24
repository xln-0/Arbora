import { useTreeStore } from "@/stores/treeStore";

export default function TreeSelector() {
  const trees = useTreeStore((state) => state.trees);

  const selectedTreeId = useTreeStore((state) => state.selectedTreeId);

  const selectTree = useTreeStore((state) => state.selectTree);

  if (trees.length === 0) {
    return <div className="text-sm text-muted-foreground">Aucun arbre</div>;
  }

  return (
    <select
      value={selectedTreeId ?? ""}
      onChange={(event) => selectTree(event.target.value)}
      className="
        h-9
        rounded-md
        border
        border-border
        bg-background
        px-3
        text-sm
        outline-none
      "
    >
      {trees.map((tree) => (
        <option key={tree.id} value={tree.id}>
          {tree.name}
        </option>
      ))}
    </select>
  );
}
