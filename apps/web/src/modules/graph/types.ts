import type { Edge, Node } from "@xyflow/react";
import type { Person, Relationship, RelationshipType } from "@arbora/shared";

export type PersonNodeData = {
  person: Person;
};

export type RelationshipNodeData = {
  relationship: Relationship;
};

export type PersonNode = Node<PersonNodeData, "person">;

export type RelationshipNode = Node<RelationshipNodeData, "relationship">;

export type GraphNode = PersonNode | RelationshipNode;

export type RelationshipEdge = Edge<{
  relationshipType: RelationshipType;
}>;
