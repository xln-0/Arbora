import type { Relationship } from "@arbora/shared";

import type { RelationshipEdge } from "../types";

export function mapParentRelationships(
  relationships: Relationship[],
  partnerRelationships: Relationship[],
): RelationshipEdge[] {
  const edges: RelationshipEdge[] = [];

  const parentRelationships = relationships.filter((r) => r.type === "PARENT");
  const parentsByChild = new Map<string, Relationship[]>();
  const coupleByPair = new Map<string, Relationship>();

  for (const relationship of parentRelationships) {
    const parents = parentsByChild.get(relationship.targetPersonId) ?? [];
    parents.push(relationship);
    parentsByChild.set(relationship.targetPersonId, parents);
  }

  for (const relationship of partnerRelationships) {
    coupleByPair.set(
      personPairKey(
        relationship.sourcePersonId,
        relationship.targetPersonId,
      ),
      relationship,
    );
  }

  const processedRelationshipChildren = new Set<string>();

  for (const relationship of parentRelationships) {
    const childId = relationship.targetPersonId;

    const childParents = parentsByChild.get(childId) ?? [];

    const hasTwoParents = childParents.length >= 2;

    if (hasTwoParents) {
      const couple = findParentCouple(childParents, coupleByPair);

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

function findParentCouple(
  parents: Relationship[],
  coupleByPair: Map<string, Relationship>,
) {
  for (let leftIndex = 0; leftIndex < parents.length; leftIndex += 1) {
    for (
      let rightIndex = leftIndex + 1;
      rightIndex < parents.length;
      rightIndex += 1
    ) {
      const couple = coupleByPair.get(
        personPairKey(
          parents[leftIndex].sourcePersonId,
          parents[rightIndex].sourcePersonId,
        ),
      );

      if (couple) return couple;
    }
  }

  return undefined;
}

function personPairKey(firstPersonId: string, secondPersonId: string) {
  return firstPersonId < secondPersonId
    ? `${firstPersonId}:${secondPersonId}`
    : `${secondPersonId}:${firstPersonId}`;
}
