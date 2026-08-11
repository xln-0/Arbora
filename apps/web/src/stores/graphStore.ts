import { create } from "zustand";

import type { Person, Relationship } from "@arbora/shared";

/**
 * Store Zustand dédié à la gestion du graphe généalogique.
 *
 * Il contient les données utilisées par l'éditeur graphique :
 * - les personnes affichées dans le graphe ;
 * - les relations entre ces personnes.
 *
 * Les données sont stockées sous forme de Record indexé par ID
 * afin de permettre des accès et mises à jour rapides :
 *
 * persons["person-id"]
 *
 * plutôt qu'une recherche dans un tableau :
 *
 * persons.find(person => person.id === id)
 */
interface GraphState {
  /**
   * Personnes présentes dans le graphe courant.
   *
   * La clé correspond à l'identifiant de la personne.
   */
  persons: Record<string, Person>;

  /**
   * Relations présentes dans le graphe courant.
   *
   * La clé correspond à l'identifiant de la relation.
   */
  relationships: Record<string, Relationship>;

  /**
   * Version du graphe.
   *
   * Permet de forcer une synchronisation/réévaluation
   * de composants dépendant du graphe sans modifier
   * directement les données.
   *
   * Exemple :
   * - recalcul du layout ;
   * - rafraîchissement React Flow ;
   * - recalcul des positions.
   */
  revision: number;

  /**
   * Charge un graphe complet depuis l'API.
   *
   * Utilisé lors du chargement d'un arbre.
   */
  setGraph(persons: Person[], relationships: Relationship[]): void;

  /**
   * Ajoute ou met à jour une personne dans le graphe.
   */
  updatePerson(person: Person): void;

  /**
   * Supprime une personne du graphe.
   *
   * Les relations associées à cette personne
   * sont également supprimées.
   */
  deletePerson(personId: string): void;

  /**
   * Ajoute une nouvelle relation au graphe.
   */
  addRelationship(relationship: Relationship): void;

  /**
   * Supprime une relation du graphe.
   */
  deleteRelationship(relationshipId: string): void;

  /**
   * Incrémente la révision du graphe.
   *
   * Permet de notifier les composants nécessitant
   * un recalcul sans modifier les données métier.
   */
  refresh(): void;
}

export const useGraphStore = create<GraphState>((set) => ({
  //
  // Initial state
  //

  /**
   * Aucun graphe chargé au démarrage.
   */
  persons: {},

  /**
   * Aucune relation chargée au démarrage.
   */
  relationships: {},

  /**
   * Première version du graphe.
   */
  revision: 0,

  //
  // Graph loading
  //

  setGraph(persons, relationships) {
    set({
      /**
       * Transformation des tableaux reçus de l'API
       * en dictionnaires indexés par ID.
       *
       * Cela facilite :
       * - la recherche d'une personne ;
       * - la mise à jour locale ;
       * - la suppression.
       */
      persons: Object.fromEntries(persons.map((person) => [person.id, person])),

      relationships: Object.fromEntries(
        relationships.map((relationship) => [relationship.id, relationship]),
      ),

      /**
       * Nouveau chargement du graphe :
       * on force les consommateurs à se mettre à jour.
       */
      revision: 0,
    });
  },

  //
  // Persons
  //

  updatePerson(person) {
    set((state) => ({
      persons: {
        ...state.persons,

        /**
         * Remplace l'ancienne version
         * ou ajoute une nouvelle personne.
         */
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

      /**
       * Suppression automatique des relations
       * qui utilisent cette personne.
       *
       * Cela évite de conserver des relations orphelines.
       */
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
      /**
       * Modification artificielle de l'état
       * pour déclencher une nouvelle synchronisation.
       */
      revision: state.revision + 1,
    }));
  },
}));
