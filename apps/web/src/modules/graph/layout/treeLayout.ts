import dagre from "@dagrejs/dagre";

import type { GraphNode } from "../types";

import {
  DAGRE_LAYOUT,
  PERSON_NODE_HEIGHT,
  PERSON_NODE_WIDTH,
} from "../constants";

export function applyTreeLayout(
  nodes: GraphNode[],
  layoutEdges: { source: string; target: string }[],
): GraphNode[] {
  const graph = new dagre.graphlib.Graph();

  graph.setDefaultEdgeLabel(() => ({}));

  graph.setGraph({
    rankdir: DAGRE_LAYOUT.RANKDIR,
    nodesep: DAGRE_LAYOUT.NODE_SEPARATION,
    ranksep: DAGRE_LAYOUT.RANK_SEPARATION,
  });

  nodes.forEach((node) => {
    graph.setNode(node.id, {
      width: PERSON_NODE_WIDTH,
      height: PERSON_NODE_HEIGHT,
    });
  });

  layoutEdges.forEach((edge) => {
    graph.setEdge(edge.source, edge.target);
  });

  dagre.layout(graph);

  return nodes.map((node) => {
    const position = graph.node(node.id);

    return {
      ...node,
      position: {
        x: position.x - PERSON_NODE_WIDTH / 2,
        y: position.y - PERSON_NODE_HEIGHT / 2,
      },
    };
  });
}

export function updateRelationshipNodes(nodes: GraphNode[]): GraphNode[] {
  const result = [...nodes];

  const persons = result.filter((node) => node.type === "person");

  const relationships = result.filter((node) => node.type === "relationship");

  for (const relationshipNode of relationships) {
    const relationship = relationshipNode.data.relationship;

    let personA = persons.find((p) => p.id === relationship.sourcePersonId);

    let personB = persons.find((p) => p.id === relationship.targetPersonId);

    if (!personA || !personB) {
      continue;
    }

    relationshipNode.position = {
      x:
        (personA.position.x + personB.position.x) / 2 +
        DAGRE_LAYOUT.NODE_SEPARATION,

      y:
        (personA.position.y + personB.position.y) / 2 +
        PERSON_NODE_HEIGHT / 2 -
        10,
    };
  }

  return result;
}
