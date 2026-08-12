/**
 * Types de relations disponibles entre deux personnes.
 */
export const COUPLE_RELATIONSHIP_TYPES = [
  "FREE_UNION",
  "MARRIAGE",
  "DIVORCE",
] as const;

export type CoupleRelationshipType =
  (typeof COUPLE_RELATIONSHIP_TYPES)[number];

export const RELATIONSHIP_TYPES = [
  "PARENT",
  "CHILD",
  ...COUPLE_RELATIONSHIP_TYPES,
] as const;

export type RelationshipType = (typeof RELATIONSHIP_TYPES)[number];

export function isCoupleRelationshipType(
  type: unknown,
): type is CoupleRelationshipType {
  return COUPLE_RELATIONSHIP_TYPES.includes(type as CoupleRelationshipType);
}

/**
 * Données nécessaires à la création d'une relation.
 */
export interface CreateRelationshipInput {
  sourcePersonId: string;

  targetPersonId: string;

  type: RelationshipType;

  date?: string;
}

/**
 * Une modification remplace les données métier de la relation.
 */
export type UpdateRelationshipInput = CreateRelationshipInput;

/**
 * Relation entre deux personnes dans un arbre généalogique.
 */
export interface Relationship {
  id: string;

  treeId: string;

  type: RelationshipType;

  date?: string | null;

  sourcePersonId: string;

  targetPersonId: string;
}
