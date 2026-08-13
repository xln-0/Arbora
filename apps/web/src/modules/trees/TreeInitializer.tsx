import { useEffect, useState, type ReactNode } from "react";

import { getTrees } from "@/api/treesApi";
import StartupScreen from "@/components/feedback/StartupScreen";
import { useAuthStore } from "@/stores/authStore";
import { useTreeStore } from "@/stores/treeStore";

const RETRY_DELAY_MS = 2500;

export default function TreeInitializer({ children }: { children: ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const loadStatus = useTreeStore((state) => state.loadStatus);
  const loadedForUserId = useTreeStore((state) => state.loadedForUserId);
  const beginLoading = useTreeStore((state) => state.beginLoading);
  const setTrees = useTreeStore((state) => state.setTrees);
  const setLoadError = useTreeStore((state) => state.setLoadError);
  const resetTrees = useTreeStore((state) => state.resetTrees);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    if (!user) {
      resetTrees();
      return;
    }

    const userId = user.id;
    beginLoading(userId);

    getTrees()
      .then((trees) => {
        if (active) setTrees(trees, userId);
      })
      .catch(() => {
        if (!active) return;

        setLoadError();
        retryTimer = setTimeout(
          () => setAttempt((current) => current + 1),
          RETRY_DELAY_MS,
        );
      });

    return () => {
      active = false;
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [user?.id, attempt, beginLoading, resetTrees, setLoadError, setTrees]);

  if (!user) {
    return children;
  }

  const isReady = loadStatus === "ready" && loadedForUserId === user.id;

  if (!isReady) {
    return (
      <StartupScreen
        scope="trees"
        unavailable={loadStatus === "error"}
        onRetry={() => setAttempt((current) => current + 1)}
      />
    );
  }

  return children;
}
