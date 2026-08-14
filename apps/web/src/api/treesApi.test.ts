import { beforeEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "./client";
import {
  clearTreeGraphCache,
  getTreeGraph,
  invalidateTreeGraph,
  type TreeGraph,
} from "./treesApi";

vi.mock("./client", () => ({
  apiClient: vi.fn(),
}));

const graph: TreeGraph = {
  persons: [],
  relationships: [],
  events: [],
};

describe("tree graph cache", () => {
  beforeEach(() => {
    clearTreeGraphCache();
    vi.mocked(apiClient).mockReset();
  });

  it("reuses a recent graph response", async () => {
    vi.mocked(apiClient).mockResolvedValue(graph);

    await getTreeGraph("tree-id");
    await getTreeGraph("tree-id");

    expect(apiClient).toHaveBeenCalledOnce();
  });

  it("loads the graph again after invalidation", async () => {
    vi.mocked(apiClient).mockResolvedValue(graph);

    await getTreeGraph("tree-id");
    invalidateTreeGraph("tree-id");
    await getTreeGraph("tree-id");

    expect(apiClient).toHaveBeenCalledTimes(2);
  });

  it("deduplicates concurrent graph requests", async () => {
    vi.mocked(apiClient).mockResolvedValue(graph);

    await Promise.all([
      getTreeGraph("tree-id"),
      getTreeGraph("tree-id"),
    ]);

    expect(apiClient).toHaveBeenCalledOnce();
  });
});
