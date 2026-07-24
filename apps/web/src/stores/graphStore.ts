import { create } from "zustand";

import type { Person, Relationship } from "@arbora/shared";

interface GraphState {
  // Données du graphe
  persons: Record<string, Person>;

  relationships: Record<string, Relationship>;

  // Synchronisation
  revision: number;

  setGraph(persons: Person[], relationships: Relationship[]): void;

  updatePerson(person: Person): void;

  deletePerson(personId: string): void;

  addRelationship(relationship: Relationship): void;

  deleteRelationship(relationshipId: string): void;

  refresh(): void;
}

export const useGraphStore = create<GraphState>((set) => ({
  //
  // Initial state
  //

  persons: {},

  relationships: {},

  revision: 0,

  //
  // Graph loading
  //

  setGraph(persons, relationships) {
    set({
      persons: Object.fromEntries(persons.map((person) => [person.id, person])),

      relationships: Object.fromEntries(
        relationships.map((relationship) => [relationship.id, relationship]),
      ),
    });
  },

  //
  // Persons
  //

  updatePerson(person) {
    set((state) => ({
      persons: {
        ...state.persons,

        [person.id]: person,
      },
    }));
  },

  deletePerson(personId) {
    set((state) => {
      const persons = {
        ...state.persons,
      };

      delete persons[personId];

      const relationships = Object.fromEntries(
        Object.entries(state.relationships).filter(
          ([, relationship]) =>
            relationship.sourcePersonId !== personId &&
            relationship.targetPersonId !== personId,
        ),
      );

      return {
        persons,

        relationships,
      };
    });
  },

  //
  // Relationships
  //

  addRelationship(relationship) {
    set((state) => ({
      relationships: {
        ...state.relationships,

        [relationship.id]: relationship,
      },
    }));
  },

  deleteRelationship(relationshipId) {
    set((state) => {
      const relationships = {
        ...state.relationships,
      };

      delete relationships[relationshipId];

      return {
        relationships,
      };
    });
  },

  //
  // Synchronisation
  //

  refresh() {
    set((state) => ({
      revision: state.revision + 1,
    }));
  },
}));
