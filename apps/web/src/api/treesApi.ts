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

export function editTree(
  id: string,
  data: {
    name: string;
  },
) {
  return apiClient<FamilyTree>(`/trees/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function createTree(name: string) {
  return apiClient<FamilyTree>("/trees", {
    method: "POST",

    body: JSON.stringify({
      name,
    }),
  });
}

export function deleteTree(id: string) {
  return apiClient(`/trees/${id}`, { method: "DELETE" });
}

export function getTreeGraph(id: string) {
  return apiClient<TreeGraph>(`/trees/${id}/graph`);
}
