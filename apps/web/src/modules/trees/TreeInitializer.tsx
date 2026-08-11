import { useEffect } from "react";

import { getTrees } from "@/api/treesApi";
import { useTreeStore } from "@/stores/treeStore";
import { useAuthStore } from "@/stores/authStore";

export default function TreeInitializer() {
  const setTrees = useTreeStore((state) => state.setTrees);

  const user = useAuthStore((state) => state.user);
  const initialized = useAuthStore((state) => state.initialized);

  useEffect(() => {
    if (!initialized) {
      return;
    }

    if (!user) {
      setTrees([]);
      return;
    }

    getTrees()
      .then(setTrees)
      .catch((error) => console.error("Failed to load trees", error));
  }, [initialized, user, setTrees]);

  return null;
}
