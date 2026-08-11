import type { Person } from "./person";
import type { Relationship } from "./relationship";
import type { TreeMember, TreeRole } from "./treeMember";

/**
 * Données nécessaires à la création d'un arbre.
 */
export interface CreateTreeInput {
  name: string;
}

/**
 * Données partielles utilisées pour modifier un arbre.
 */
export type UpdateTreeInput = Partial<CreateTreeInput>;

/**
 * Arbre généalogique.
 */
export interface FamilyTree {
  id: string;

  name: string;

  ownerId: string;

  createdAt: string;

  /**
   * Rôle de l'utilisateur courant sur cet arbre.
   */
  role: TreeRole;

  persons?: Person[];

  relationships?: Relationship[];

  /**
   * Membres de l'arbre avec leurs permissions.
   *
   * Chargé uniquement lors de la gestion du partage.
   */
  members?: TreeMember[];
}
