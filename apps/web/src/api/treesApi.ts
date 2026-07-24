import { apiClient } from "./client";

import type { FamilyTree, Person, Relationship } from "@arbora/shared";

export interface TreeGraph {
  persons: Person[];
  relationships: Relationship[];
}

export function getTrees() {
  return apiClient<FamilyTree[]>("/trees");
}

export function getTree(id: string) {
  return apiClient<FamilyTree>(`/trees/${id}`);
}

export function createTree(name: string) {
  return apiClient<FamilyTree>("/trees", {
    method: "POST",

    body: JSON.stringify({
      name,
    }),
  });
}

export function getTreeGraph(id: string) {
  return apiClient<TreeGraph>(`/trees/${id}/graph`);
}
