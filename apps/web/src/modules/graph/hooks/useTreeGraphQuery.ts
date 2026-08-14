import { useCallback, useEffect, useState } from "react";

import { getTreeGraph, type TreeGraph } from "@/api/treesApi";

const EMPTY_GRAPH: TreeGraph = { persons: [], relationships: [], events: [] };

export function useTreeGraphQuery(
  treeId: string | undefined,
  fallbackErrorMessage: string,
) {
  const [graph, setGraph] = useState<TreeGraph>(EMPTY_GRAPH);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [revision, setRevision] = useState(0);

  const reload = useCallback(() => {
    setRevision((current) => current + 1);
  }, []);

  useEffect(() => {
    if (!treeId) {
      setGraph(EMPTY_GRAPH);
      setErrorMessage(undefined);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function loadGraph() {
      try {
        setIsLoading(true);
        setErrorMessage(undefined);
        const result = await getTreeGraph(treeId!, { force: revision > 0 });

        if (!cancelled) setGraph(result);
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error instanceof Error ? error.message : fallbackErrorMessage,
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadGraph();

    return () => {
      cancelled = true;
    };
  }, [treeId, revision, fallbackErrorMessage]);

  return { graph, isLoading, errorMessage, reload };
}
