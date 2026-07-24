import { apiClient } from "./client";
import type { Relationship, RelationshipType } from "@arbora/shared";

export function createRelationship(
  treeId: string,
  data: {
    sourcePersonId: string;
    targetPersonId: string;
    type: RelationshipType;
  },
) {
  return apiClient<Relationship>(`/trees/${treeId}/relationships`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteRelationship(id: string) {
  return apiClient(`/relationships/${id}`, {
    method: "DELETE",
  });
}
