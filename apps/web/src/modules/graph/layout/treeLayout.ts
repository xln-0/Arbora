import dagre from "@dagrejs/dagre";
import type { Edge } from "@xyflow/react";

import type { GraphNode, PersonNode, RelationshipNode } from "../types";
import {
  DAGRE_LAYOUT,
  PERSON_NODE_HEIGHT,
  PERSON_NODE_WIDTH,
  RELATIONSHIP_NODE_SIZE,
} from "../constants";

interface LayoutEdge {
  source: string;
  target: string;
}

interface Household {
  id: string;
  persons: PersonNode[];
}

/**
 * Organise le graphe par foyers plutôt que personne par personne.
 * Les conjoints restent côte à côte et les enfants sont centrés sous
 * l'ensemble du foyer parental, y compris dans les familles recomposées.
 */
export function applyFamilyLayout(
  nodes: GraphNode[],
  layoutEdges: LayoutEdge[],
): GraphNode[] {
  const persons = nodes.filter(
    (node): node is PersonNode => node.type === "person",
  );
  const relationships = nodes.filter(
    (node): node is RelationshipNode => node.type === "relationship",
  );
  const personById = new Map(persons.map((person) => [person.id, person]));
  const partnerIdsByPerson = buildPartnerAdjacency(
    relationships,
    personById,
  );
  const households = buildHouseholds(persons, partnerIdsByPerson);
  const householdIdByPersonId = new Map<string, string>();

  for (const household of households) {
    for (const person of household.persons) {
      householdIdByPersonId.set(person.id, household.id);
    }
  }

  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({
    rankdir: DAGRE_LAYOUT.RANKDIR,
    nodesep: DAGRE_LAYOUT.NODE_SEPARATION,
    ranksep: DAGRE_LAYOUT.RANK_SEPARATION,
    marginx: DAGRE_LAYOUT.MARGIN,
    marginy: DAGRE_LAYOUT.MARGIN,
    ranker: "network-simplex",
  });

  for (const household of households) {
    graph.setNode(household.id, {
      width: getHouseholdWidth(household),
      height: PERSON_NODE_HEIGHT,
    });
  }

  const registeredEdges = new Set<string>();

  for (const edge of layoutEdges) {
    const sourceHouseholdId = householdIdByPersonId.get(edge.source);
    const targetHouseholdId = householdIdByPersonId.get(edge.target);

    if (
      !sourceHouseholdId ||
      !targetHouseholdId ||
      sourceHouseholdId === targetHouseholdId
    ) {
      continue;
    }

    const edgeId = `${sourceHouseholdId}:${targetHouseholdId}`;

    if (registeredEdges.has(edgeId)) {
      continue;
    }

    graph.setEdge(sourceHouseholdId, targetHouseholdId, {
      weight: 4,
      minlen: 1,
    });
    registeredEdges.add(edgeId);
  }

  const siblingOrderConstraints = buildSiblingOrderConstraints(
    layoutEdges,
    householdIdByPersonId,
    personById,
  );

  dagre.layout(graph, {
    constraints: siblingOrderConstraints,
  });

  const positionByPersonId = new Map<
    string,
    { x: number; y: number }
  >();

  for (const household of households) {
    const layoutPosition = graph.node(household.id);
    const householdWidth = getHouseholdWidth(household);
    const startX = layoutPosition.x - householdWidth / 2;
    const y = layoutPosition.y - PERSON_NODE_HEIGHT / 2;

    household.persons.forEach((person, index) => {
      positionByPersonId.set(person.id, {
        x:
          startX +
          index * (PERSON_NODE_WIDTH + DAGRE_LAYOUT.PARTNER_SEPARATION),
        y,
      });
    });
  }

  return nodes.map((node) => {
    if (node.type !== "person") {
      return node;
    }

    const position = positionByPersonId.get(node.id);

    return position ? { ...node, position } : node;
  });
}

function buildSiblingOrderConstraints(
  layoutEdges: LayoutEdge[],
  householdIdByPersonId: Map<string, string>,
  personById: Map<string, PersonNode>,
) {
  const childrenByParentHousehold = new Map<
    string,
    Map<string, PersonNode>
  >();

  for (const edge of layoutEdges) {
    const parentHouseholdId = householdIdByPersonId.get(edge.source);
    const childHouseholdId = householdIdByPersonId.get(edge.target);
    const child = personById.get(edge.target);

    if (
      !parentHouseholdId ||
      !childHouseholdId ||
      !child ||
      parentHouseholdId === childHouseholdId
    ) {
      continue;
    }

    if (!childrenByParentHousehold.has(parentHouseholdId)) {
      childrenByParentHousehold.set(parentHouseholdId, new Map());
    }

    const childrenByHousehold = childrenByParentHousehold.get(
      parentHouseholdId,
    )!;
    const registeredChild = childrenByHousehold.get(childHouseholdId);

    if (!registeredChild || compareChildren(child, registeredChild) < 0) {
      childrenByHousehold.set(childHouseholdId, child);
    }
  }

  const constraints: Array<{ left: string; right: string }> = [];
  const registeredConstraints = new Set<string>();

  for (const childrenByHousehold of childrenByParentHousehold.values()) {
    const orderedChildren = [...childrenByHousehold.entries()].sort(
      ([, childA], [, childB]) => compareChildren(childA, childB),
    );

    for (let index = 0; index < orderedChildren.length - 1; index += 1) {
      const left = orderedChildren[index][0];
      const right = orderedChildren[index + 1][0];
      const constraintId = `${left}:${right}`;

      if (!registeredConstraints.has(constraintId)) {
        constraints.push({ left, right });
        registeredConstraints.add(constraintId);
      }
    }
  }

  return constraints;
}

function compareChildren(a: PersonNode, b: PersonNode) {
  const dateA = a.data.person.birthDate;
  const dateB = b.data.person.birthDate;

  if (dateA && dateB && dateA !== dateB) {
    return dateA.localeCompare(dateB);
  }

  if (dateA && !dateB) {
    return -1;
  }

  if (!dateA && dateB) {
    return 1;
  }

  const nameComparison = a.data.person.firstName.localeCompare(
    b.data.person.firstName,
  );

  return nameComparison || a.id.localeCompare(b.id);
}

function buildPartnerAdjacency(
  relationships: RelationshipNode[],
  personById: Map<string, PersonNode>,
) {
  const adjacency = new Map<string, Set<string>>();

  for (const node of relationships) {
    const { sourcePersonId, targetPersonId } = node.data.relationship;

    if (!personById.has(sourcePersonId) || !personById.has(targetPersonId)) {
      continue;
    }

    if (!adjacency.has(sourcePersonId)) {
      adjacency.set(sourcePersonId, new Set());
    }
    if (!adjacency.has(targetPersonId)) {
      adjacency.set(targetPersonId, new Set());
    }

    adjacency.get(sourcePersonId)!.add(targetPersonId);
    adjacency.get(targetPersonId)!.add(sourcePersonId);
  }

  return adjacency;
}

function buildHouseholds(
  persons: PersonNode[],
  partnerIdsByPerson: Map<string, Set<string>>,
) {
  const personById = new Map(persons.map((person) => [person.id, person]));
  const visited = new Set<string>();
  const households: Household[] = [];

  for (const person of persons) {
    if (visited.has(person.id)) {
      continue;
    }

    const component: PersonNode[] = [];
    const pending = [person.id];

    while (pending.length > 0) {
      const currentId = pending.pop()!;

      if (visited.has(currentId)) {
        continue;
      }

      const currentPerson = personById.get(currentId);

      if (!currentPerson) {
        continue;
      }

      visited.add(currentId);
      component.push(currentPerson);

      for (const partnerId of partnerIdsByPerson.get(currentId) ?? []) {
        pending.push(partnerId);
      }
    }

    const orderedComponent = orderHouseholdPersons(
      component,
      partnerIdsByPerson,
    );

    households.push({
      id: `household-${households.length}`,
      persons: orderedComponent,
    });
  }

  return households;
}

function orderHouseholdPersons(
  persons: PersonNode[],
  partnerIdsByPerson: Map<string, Set<string>>,
) {
  if (persons.length <= 1) {
    return persons;
  }

  const personById = new Map(persons.map((person) => [person.id, person]));
  const comparePersons = (a: PersonNode, b: PersonNode) =>
    a.position.x - b.position.x ||
    a.data.person.firstName.localeCompare(b.data.person.firstName) ||
    a.id.localeCompare(b.id);
  const endpoints = persons
    .filter((person) => (partnerIdsByPerson.get(person.id)?.size ?? 0) <= 1)
    .sort(comparePersons);
  const pending = [endpoints[0]?.id ?? [...persons].sort(comparePersons)[0].id];
  const ordered: PersonNode[] = [];
  const visited = new Set<string>();

  while (ordered.length < persons.length) {
    const currentId = pending.shift();

    if (!currentId || visited.has(currentId)) {
      const nextPerson = persons
        .filter((person) => !visited.has(person.id))
        .sort(comparePersons)[0];

      if (!nextPerson) {
        break;
      }

      pending.push(nextPerson.id);
      continue;
    }

    const currentPerson = personById.get(currentId);

    if (!currentPerson) {
      continue;
    }

    visited.add(currentId);
    ordered.push(currentPerson);

    const unvisitedPartners = [...(partnerIdsByPerson.get(currentId) ?? [])]
      .map((id) => personById.get(id))
      .filter(
        (person): person is PersonNode =>
          Boolean(person) && !visited.has(person.id),
      )
      .sort(
        (a, b) =>
          (partnerIdsByPerson.get(b.id)?.size ?? 0) -
            (partnerIdsByPerson.get(a.id)?.size ?? 0) || comparePersons(a, b),
      );

    pending.unshift(...unvisitedPartners.map((person) => person.id));
  }

  return ordered;
}

function getHouseholdWidth(household: Household) {
  return (
    household.persons.length * PERSON_NODE_WIDTH +
    Math.max(0, household.persons.length - 1) *
      DAGRE_LAYOUT.PARTNER_SEPARATION
  );
}

export function updateRelationshipNodes(nodes: GraphNode[]): GraphNode[] {
  const persons = nodes.filter(
    (node): node is PersonNode => node.type === "person",
  );

  return nodes.map((node) => {
    if (node.type !== "relationship") {
      return node;
    }

    const relationshipNode = node as RelationshipNode;
    const relationship = relationshipNode.data.relationship;
    const personA = persons.find(
      (person) => person.id === relationship.sourcePersonId,
    );
    const personB = persons.find(
      (person) => person.id === relationship.targetPersonId,
    );

    if (!personA || !personB) {
      return relationshipNode;
    }

    return {
      ...relationshipNode,
      position: {
        x:
          (personA.position.x + personB.position.x) / 2 +
          PERSON_NODE_WIDTH / 2 -
          RELATIONSHIP_NODE_SIZE / 2,
        y:
          (personA.position.y + personB.position.y) / 2 +
          PERSON_NODE_HEIGHT / 2 -
          RELATIONSHIP_NODE_SIZE / 2,
      },
    };
  });
}

export function updatePartnerEdgeHandles(edges: Edge[], nodes: GraphNode[]) {
  const nodeById = new Map(nodes.map((node) => [node.id, node]));

  return edges.map((edge) => {
    if (
      edge.data?.relationshipType !== "PARTNER" ||
      !edge.target.startsWith("relationship-")
    ) {
      return edge;
    }

    const sourceNode = nodeById.get(edge.source);
    const relationshipNode = nodeById.get(edge.target);

    if (!sourceNode || !relationshipNode) {
      return edge;
    }

    const sourceCenterX = sourceNode.position.x + PERSON_NODE_WIDTH / 2;
    const relationshipCenterX =
      relationshipNode.position.x + RELATIONSHIP_NODE_SIZE / 2;
    const sourceIsLeft = sourceCenterX <= relationshipCenterX;

    return {
      ...edge,
      sourceHandle: sourceIsLeft ? "partner-right" : "partner-left",
      targetHandle: sourceIsLeft ? "partner-left" : "partner-right",
    };
  });
}
