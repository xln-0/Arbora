import { useEffect, useRef, useState, type ReactNode } from "react";

import StartupScreen from "@/components/feedback/StartupScreen";
import { useAuth } from "@/modules/auth/useAuth";
import { useAuthStore } from "@/stores/authStore";

const RETRY_DELAY_MS = 2500;

export default function AuthInitializer({ children }: { children: ReactNode }) {
  const { restoreSession } = useAuth();
  const startupStatus = useAuthStore((state) => state.startupStatus);
  const [attempt, setAttempt] = useState(0);
  const running = useRef(false);

  useEffect(() => {
    let active = true;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    async function initialize() {
      if (running.current) {
        return;
      }

      running.current = true;
      const ready = await restoreSession();
      running.current = false;

      if (active && !ready) {
        retryTimer = setTimeout(
          () => setAttempt((current) => current + 1),
          RETRY_DELAY_MS,
        );
      }
    }

    void initialize();

    return () => {
      active = false;
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [attempt]);

  if (startupStatus !== "ready") {
    return (
      <StartupScreen
        unavailable={startupStatus === "unavailable"}
        onRetry={() => setAttempt((current) => current + 1)}
      />
    );
  }

  return children;
}
