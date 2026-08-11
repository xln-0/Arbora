/**
 * Genres disponibles pour une personne.
 */
export const GENDERS = ["UNKNOWN", "MALE", "FEMALE"] as const;

export type Gender = (typeof GENDERS)[number];

/**
 * Données utilisées pour créer une personne.
 */
export type CreatePersonInput = {
  firstName: string;
  lastName?: string | null;
  gender?: Gender;
  birthDate?: string;
  deathDate?: string;
};

/**
 * Données partielles utilisées pour modifier une personne.
 */
export type UpdatePersonInput = Partial<CreatePersonInput>;

/**
 * Personne appartenant à un arbre généalogique.
 */
export interface Person {
  id: string;

  treeId: string;

  firstName: string;

  lastName?: string | null;

  gender: Gender;

  birthDate?: string | null;

  deathDate?: string | null;

  /**
   * Position du nœud dans l'éditeur graphique.
   */
  positionX: number;

  positionY: number;
}
