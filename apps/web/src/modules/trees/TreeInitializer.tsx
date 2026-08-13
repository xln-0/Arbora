import { useEffect, type ReactNode } from "react";

import { getTrees } from "@/api/treesApi";
import StartupScreen from "@/components/feedback/StartupScreen";
import { useRetryingTask } from "@/hooks/useRetryingTask";
import { useAuthStore } from "@/stores/authStore";
import { useTreeStore } from "@/stores/treeStore";

export default function TreeInitializer({ children }: { children: ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const loadStatus = useTreeStore((state) => state.loadStatus);
  const loadedForUserId = useTreeStore((state) => state.loadedForUserId);
  const beginLoading = useTreeStore((state) => state.beginLoading);
  const setTrees = useTreeStore((state) => state.setTrees);
  const setLoadError = useTreeStore((state) => state.setLoadError);
  const resetTrees = useTreeStore((state) => state.resetTrees);

  useEffect(() => {
    if (!user) resetTrees();
  }, [user, resetTrees]);

  const retry = useRetryingTask(
    async () => {
      if (!user) return true;

      beginLoading(user.id);

      try {
        setTrees(await getTrees(), user.id);
        return true;
      } catch {
        setLoadError();
        return false;
      }
    },
    { enabled: Boolean(user), taskKey: user?.id },
  );

  if (!user) {
    return children;
  }

  const isReady = loadStatus === "ready" && loadedForUserId === user.id;

  if (!isReady) {
    return (
      <StartupScreen
        scope="trees"
        unavailable={loadStatus === "error"}
        onRetry={retry}
      />
    );
  }

  return children;
}
