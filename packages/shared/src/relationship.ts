/**
 * Types de relations disponibles entre deux personnes.
 */
export const RELATIONSHIP_TYPES = ["PARENT", "CHILD", "PARTNER"] as const;

export type RelationshipType = (typeof RELATIONSHIP_TYPES)[number];

/**
 * Données nécessaires à la création d'une relation.
 */
export interface CreateRelationshipInput {
  sourcePersonId: string;

  targetPersonId: string;

  type: RelationshipType;
}

/**
 * Relation entre deux personnes dans un arbre généalogique.
 */
export interface Relationship {
  id: string;

  treeId: string;

  type: RelationshipType;

  sourcePersonId: string;

  targetPersonId: string;
}
