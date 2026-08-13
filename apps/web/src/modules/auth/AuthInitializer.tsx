import type { ReactNode } from "react";

import StartupScreen from "@/components/feedback/StartupScreen";
import { useRetryingTask } from "@/hooks/useRetryingTask";
import { useAuth } from "@/modules/auth/useAuth";
import { useAuthStore } from "@/stores/authStore";

export default function AuthInitializer({ children }: { children: ReactNode }) {
  const { restoreSession } = useAuth();
  const startupStatus = useAuthStore((state) => state.startupStatus);
  const retry = useRetryingTask(restoreSession);

  if (startupStatus !== "ready") {
    return (
      <StartupScreen
        unavailable={startupStatus === "unavailable"}
        onRetry={retry}
      />
    );
  }

  return children;
}
