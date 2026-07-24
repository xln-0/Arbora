import type { Person } from "@arbora/shared";

import type { GraphNode } from "../types";

export function mapPersonNodes(persons: Person[]): GraphNode[] {
  return persons.map((person, index) => ({
    id: person.id,

    type: "person",

    position: {
      x: person.positionX ?? index * 300,
      y: person.positionY ?? 100,
    },

    data: {
      person,
    },
  }));
}
