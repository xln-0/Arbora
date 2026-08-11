import { apiClient } from "./client";
import type {
  CreatePersonInput,
  Person,
  UpdatePersonInput,
} from "@arbora/shared";

export function updatePersonPosition(
  treeId: string,
  personId: string,
  x: number,
  y: number,
) {
  return apiClient(`/trees/${treeId}/persons/${personId}/position`, {
    method: "PATCH",

    body: JSON.stringify({
      x,
      y,
    }),
  });
}

export function createPerson(
  treeId: string,
  data: CreatePersonInput,
) {
  return apiClient<Person>(`/trees/${treeId}/persons`, {
    method: "POST",

    body: JSON.stringify(data),
  });
}

export function editPerson(
  treeId: string,
  personId: string,
  data: UpdatePersonInput,
) {
  return apiClient<Person>(`/trees/${treeId}/persons/${personId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deletePerson(treeId: string, personId: string) {
  return apiClient(`/trees/${treeId}/persons/${personId}`, {
    method: "DELETE",
  });
}
