import { apiClient } from "./client";
import { invalidateTreeGraph } from "./treesApi";
import type {
  CreateRelationshipInput,
  Relationship,
  UpdateRelationshipInput,
} from "@arbora/shared";

export async function createRelationship(
  treeId: string,
  data: CreateRelationshipInput,
) {
  const relationship = await apiClient<Relationship>(`/trees/${treeId}/relationships`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  invalidateTreeGraph(treeId);
  return relationship;
}

export async function editRelationship(
  treeId: string,
  relationshipId: string,
  data: UpdateRelationshipInput,
) {
  const relationship = await apiClient<Relationship>(
    `/trees/${treeId}/relationships/${relationshipId}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    },
  );

  invalidateTreeGraph(treeId);
  return relationship;
}

export async function deleteRelationship(treeId: string, relationshipId: string) {
  const result = await apiClient(`/trees/${treeId}/relationships/${relationshipId}`, {
    method: "DELETE",
  });

  invalidateTreeGraph(treeId);
  return result;
}
