export const relationships = ["PARENT", "CHILD", "PARTNER"] as const;

export type RelationshipType = (typeof relationships)[number];

export interface Relationship {
  id: string;

  treeId: string;

  type: RelationshipType;

  sourcePersonId: string;

  targetPersonId: string;
}
