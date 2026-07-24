import { useEffect } from "react";

import { getTrees } from "@/api/treesApi";
import { useTreeStore } from "@/stores/treeStore";

export default function TreeInitializer() {
  const setTrees = useTreeStore((state) => state.setTrees);

  const selectTree = useTreeStore((state) => state.selectTree);

  useEffect(() => {
    getTrees().then((trees) => {
      setTrees(trees);

      if (trees.length > 0) {
        selectTree(trees[0].id);
      }
    });
  }, []);

  return null;
}
