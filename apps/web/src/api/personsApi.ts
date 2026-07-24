import { apiClient } from "./client";
import type { Person } from "@arbora/shared";

export function updatePersonPosition(id: string, x: number, y: number) {
  return apiClient(`/persons/${id}/position`, {
    method: "PATCH",

    body: JSON.stringify({
      x,
      y,
    }),
  });
}

export function createPerson(
  treeId: string,
  data: {
    firstName: string;
    lastName?: string;
    gender?: string;
    birthDate?: string;
    deathDate?: string;
  },
) {
  return apiClient<Person>(`/trees/${treeId}/persons`, {
    method: "POST",

    body: JSON.stringify(data),
  });
}

export function editPerson(
  id: string,
  data: {
    firstName: string;
    lastName?: string;
    gender?: string;
    birthDate?: string;
    deathDate?: string;
  },
) {
  return apiClient<Person>(`/persons/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deletePerson(id: string) {
  return apiClient(`/persons/${id}`, {
    method: "DELETE",
  });
}
