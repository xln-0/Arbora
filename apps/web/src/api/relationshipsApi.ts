import { apiClient } from "./client";
import type {
  CreateRelationshipInput,
  Relationship,
  UpdateRelationshipInput,
} from "@arbora/shared";

export function createRelationship(
  treeId: string,
  data: CreateRelationshipInput,
) {
  return apiClient<Relationship>(`/trees/${treeId}/relationships`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function editRelationship(
  treeId: string,
  relationshipId: string,
  data: UpdateRelationshipInput,
) {
  return apiClient<Relationship>(
    `/trees/${treeId}/relationships/${relationshipId}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    },
  );
}

export function deleteRelationship(treeId: string, relationshipId: string) {
  return apiClient(`/trees/${treeId}/relationships/${relationshipId}`, {
    method: "DELETE",
  });
}
