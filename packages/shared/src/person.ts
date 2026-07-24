export const genders = ["UNKNOWN", "MALE", "FEMALE"] as const;

export type Gender = (typeof genders)[number];

export interface Person {
  id: string;

  treeId: string;

  firstName: string;

  lastName: string;

  gender: Gender;

  birthDate?: string;

  deathDate?: string;

  positionX: number;

  positionY: number;
}
