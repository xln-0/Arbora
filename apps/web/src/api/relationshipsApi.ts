import { apiClient } from "./client";
import type {
  CreateRelationshipInput,
  Relationship,
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

export function deleteRelationship(treeId: string, relationshipId: string) {
  return apiClient(`/trees/${treeId}/relationships/${relationshipId}`, {
    method: "DELETE",
  });
}
