import type { Person, Relationship } from "@arbora/shared";
import type { GraphNode, RelationshipEdge } from "../types";

import {
  PERSON_NODE_HEIGHT,
  PERSON_NODE_WIDTH,
  RELATIONSHIP_NODE_SIZE,
} from "../constants";

export function mapPartnerRelationships(
  persons: Person[],
  relationships: Relationship[],
): {
  nodes: GraphNode[];
  edges: RelationshipEdge[];
} {
  const nodes: GraphNode[] = [];
  const edges: RelationshipEdge[] = [];

  for (const relationship of relationships) {
    let source = persons.find((p) => p.id === relationship.sourcePersonId);

    let target = persons.find((p) => p.id === relationship.targetPersonId);

    if (!source || !target) {
      continue;
    }

    // Homme à gauche, femme à droite
    if (source.gender === "FEMALE" && target.gender === "MALE") {
      [source, target] = [target, source];
    }

    const relationshipNodeId = `relationship-${relationship.id}`;

    const sourceCenter = {
      x: (source.positionX ?? 0) + PERSON_NODE_WIDTH / 2,

      y: (source.positionY ?? 100) + PERSON_NODE_HEIGHT / 2,
    };

    const targetCenter = {
      x: (target.positionX ?? 0) + PERSON_NODE_WIDTH / 2,

      y: (target.positionY ?? 100) + PERSON_NODE_HEIGHT / 2,
    };

    nodes.push({
      id: relationshipNodeId,

      type: "relationship",

      position: {
        x: (sourceCenter.x + targetCenter.x) / 2 - RELATIONSHIP_NODE_SIZE / 2,

        y: (sourceCenter.y + targetCenter.y) / 2 - RELATIONSHIP_NODE_SIZE / 2,
      },

      data: {
        relationship,
      },
    });

    edges.push({
      id: `${relationship.id}-left`,

      source: source.id,

      target: relationshipNodeId,

      sourceHandle: "partner-right",

      targetHandle: "partner-left",

      type: "straight",

      data: {
        relationshipType: relationship.type,
      },
    });

    edges.push({
      id: `${relationship.id}-right`,

      source: target.id,

      target: relationshipNodeId,

      sourceHandle: "partner-left",

      targetHandle: "partner-right",

      type: "straight",

      data: {
        relationshipType: relationship.type,
      },
    });
  }

  return {
    nodes,
    edges,
  };
}
