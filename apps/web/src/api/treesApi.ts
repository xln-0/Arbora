import { apiClient } from "./client";

import type {
  CreateTreeInput,
  FamilyTree,
  Person,
  Relationship,
  UpdateTreeInput,
} from "@arbora/shared";

export interface TreeGraph {
  persons: Person[];
  relationships: Relationship[];
}

const GRAPH_CACHE_TTL_MS = 30_000;
const graphCache = new Map<
  string,
  { graph: TreeGraph; fetchedAt: number }
>();
const graphRequests = new Map<string, Promise<TreeGraph>>();
let graphCacheGeneration = 0;

export function getTrees() {
  return apiClient<FamilyTree[]>("/trees");
}

export function getTree(id: string) {
  return apiClient<FamilyTree>(`/trees/${id}`);
}

export function editTree(
  id: string,
  data: UpdateTreeInput,
) {
  return apiClient<FamilyTree>(`/trees/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function createTree(data: CreateTreeInput) {
  return apiClient<FamilyTree>("/trees", {
    method: "POST",

    body: JSON.stringify(data),
  });
}

export async function deleteTree(id: string) {
  const result = await apiClient(`/trees/${id}`, { method: "DELETE" });
  invalidateTreeGraph(id);
  return result;
}

export function getTreeGraph(id: string, options?: { force?: boolean }) {
  const cached = graphCache.get(id);

  if (
    !options?.force &&
    cached &&
    Date.now() - cached.fetchedAt < GRAPH_CACHE_TTL_MS
  ) {
    return Promise.resolve(cached.graph);
  }

  const pendingRequest = graphRequests.get(id);

  if (pendingRequest) return pendingRequest;

  const requestGeneration = graphCacheGeneration;
  const request = apiClient<TreeGraph>(`/trees/${id}/graph`)
    .then((graph) => {
      if (requestGeneration === graphCacheGeneration) {
        graphCache.set(id, { graph, fetchedAt: Date.now() });
      }
      return graph;
    })
    .finally(() => {
      if (graphRequests.get(id) === request) {
        graphRequests.delete(id);
      }
    });

  graphRequests.set(id, request);
  return request;
}

export function invalidateTreeGraph(id: string) {
  graphCacheGeneration += 1;
  graphCache.delete(id);
  graphRequests.delete(id);
}

export function clearTreeGraphCache() {
  graphCacheGeneration += 1;
  graphCache.clear();
  graphRequests.clear();
}
