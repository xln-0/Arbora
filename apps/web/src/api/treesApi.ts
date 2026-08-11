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

export function deleteTree(id: string) {
  return apiClient(`/trees/${id}`, { method: "DELETE" });
}

export function getTreeGraph(id: string) {
  return apiClient<TreeGraph>(`/trees/${id}/graph`);
}
