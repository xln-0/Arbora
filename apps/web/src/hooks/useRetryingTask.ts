import { useEffect, useRef, useState } from "react";

const DEFAULT_RETRY_DELAY_MS = 2500;

interface RetryingTaskOptions {
  enabled?: boolean;
  retryDelayMs?: number;
  taskKey?: unknown;
}

export function useRetryingTask(
  task: () => Promise<boolean>,
  {
    enabled = true,
    retryDelayMs = DEFAULT_RETRY_DELAY_MS,
    taskKey,
  }: RetryingTaskOptions = {},
) {
  const taskRef = useRef(task);
  const runningRef = useRef(false);
  const [attempt, setAttempt] = useState(0);

  taskRef.current = task;

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let active = true;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    async function run() {
      if (runningRef.current) {
        return;
      }

      runningRef.current = true;

      try {
        const successful = await taskRef.current();

        if (active && !successful) {
          retryTimer = setTimeout(
            () => setAttempt((current) => current + 1),
            retryDelayMs,
          );
        }
      } finally {
        runningRef.current = false;
      }
    }

    void run();

    return () => {
      active = false;
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [attempt, enabled, retryDelayMs, taskKey]);

  return () => setAttempt((current) => current + 1);
}
