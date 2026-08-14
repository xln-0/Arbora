import { apiClient } from "./client";
import { invalidateTreeGraph } from "./treesApi";
import type {
  CreatePersonInput,
  Person,
  UpdatePersonInput,
} from "@arbora/shared";

export async function updatePersonPosition(
  treeId: string,
  personId: string,
  x: number,
  y: number,
) {
  const result = await apiClient(`/trees/${treeId}/persons/${personId}/position`, {
    method: "PATCH",

    body: JSON.stringify({
      x,
      y,
    }),
  });

  invalidateTreeGraph(treeId);
  return result;
}

export async function createPerson(
  treeId: string,
  data: CreatePersonInput,
) {
  const person = await apiClient<Person>(`/trees/${treeId}/persons`, {
    method: "POST",

    body: JSON.stringify(data),
  });

  invalidateTreeGraph(treeId);
  return person;
}

export async function editPerson(
  treeId: string,
  personId: string,
  data: UpdatePersonInput,
) {
  const person = await apiClient<Person>(`/trees/${treeId}/persons/${personId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  invalidateTreeGraph(treeId);
  return person;
}

export async function deletePerson(treeId: string, personId: string) {
  const result = await apiClient(`/trees/${treeId}/persons/${personId}`, {
    method: "DELETE",
  });

  invalidateTreeGraph(treeId);
  return result;
}
