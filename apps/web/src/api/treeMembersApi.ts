import type { TreeMember, TreeRole } from "@arbora/shared";

import { apiClient } from "@/api/client";

export function getTreeMembers(treeId: string) {
  return apiClient<TreeMember[]>(`/trees/${treeId}/members`);
}

export function addTreeMember(
  treeId: string,
  data: {
    email: string;
    role: "EDITOR" | "VIEWER";
  },
) {
  return apiClient<TreeMember>(`/trees/${treeId}/members`, {
    method: "POST",

    body: JSON.stringify(data),
  });
}

export function updateTreeMemberRole(
  treeId: string,
  memberId: string,
  role: "EDITOR" | "VIEWER",
) {
  return apiClient<TreeMember>(`/trees/${treeId}/members/${memberId}`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
}

export function removeTreeMember(treeId: string, memberId: string) {
  return apiClient<void>(`/trees/${treeId}/members/${memberId}`, {
    method: "DELETE",
  });
}

interface MyTreeRoleResponse {
  role: TreeRole;
}

export async function getMyTreeRole(treeId: string) {
  return apiClient<MyTreeRoleResponse>(`/trees/${treeId}/my-role`);
}
