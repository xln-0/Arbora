import type { Person, Relationship } from "@arbora/shared";

import { mapPersonNodes } from "./mapping/personNodeMapper";
import { mapPartnerRelationships } from "./mapping/partnerMapper";
import { mapParentRelationships } from "./mapping/parentMapper";

import type { GraphNode } from "./types";
import type { RelationshipEdge } from "./types";

export function buildGraph(persons: Person[], relationships: Relationship[]) {
  const nodes: GraphNode[] = [];
  const edges: RelationshipEdge[] = [];

  const partnerRelationships = relationships.filter(
    (r) => r.type === "PARTNER",
  );

  nodes.push(...mapPersonNodes(persons));

  const partners = mapPartnerRelationships(persons, partnerRelationships);

  nodes.push(...partners.nodes);
  edges.push(...partners.edges);

  edges.push(...mapParentRelationships(relationships, partnerRelationships));

  return {
    nodes,
    edges,
  };
}
