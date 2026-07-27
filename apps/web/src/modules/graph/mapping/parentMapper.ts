import type { Relationship } from "@arbora/shared";

import type { RelationshipEdge } from "../types";

export function mapParentRelationships(
  relationships: Relationship[],
  partnerRelationships: Relationship[],
): RelationshipEdge[] {
  const edges: RelationshipEdge[] = [];

  const parentRelationships = relationships.filter((r) => r.type === "PARENT");

  const processedRelationshipChildren = new Set<string>();

  for (const relationship of parentRelationships) {
    const childId = relationship.targetPersonId;

    const childParents = parentRelationships.filter(
      (r) => r.targetPersonId === childId,
    );

    const hasTwoParents = childParents.length >= 2;

    if (hasTwoParents) {
      const parentIds = childParents.map((r) => r.sourcePersonId);

      const couple = partnerRelationships.find(
        (r) =>
          parentIds.includes(r.sourcePersonId) &&
          parentIds.includes(r.targetPersonId),
      );

      if (couple) {
        const relationshipNodeId = `relationship-${couple.id}`;

        const edgeId = `${couple.id}-child-${childId}`;

        if (!processedRelationshipChildren.has(edgeId)) {
          edges.push({
            id: edgeId,

            source: relationshipNodeId,

            target: childId,

            sourceHandle: "children",

            targetHandle: "child",

            type: "family",

            data: {
              relationshipType: "PARENT",
            },
          });

          processedRelationshipChildren.add(edgeId);
        }

        continue;
      }
    }

    edges.push({
      id: relationship.id,

      source: relationship.sourcePersonId,

      target: relationship.targetPersonId,

      sourceHandle: "parent",

      targetHandle: "child",

      type: "family",

      data: {
        relationshipType: relationship.type,
      },
    });
  }

  return edges;
}
