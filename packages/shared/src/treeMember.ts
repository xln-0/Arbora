/**
 * Rôles disponibles pour un membre d'un arbre.
 */
export const TREE_ROLES = ["OWNER", "EDITOR", "VIEWER"] as const;

export type TreeRole = (typeof TREE_ROLES)[number];

/**
 * Données nécessaires pour ajouter un membre à un arbre.
 */
export interface AddTreeMemberInput {
  email: string;

  /**
   * Un membre ajouté ne peut pas devenir propriétaire.
   */
  role: Exclude<TreeRole, "OWNER">;
}

/**
 * Données modifiables d'un membre.
 */
export interface UpdateTreeMemberInput {
  /**
   * Le rôle OWNER ne peut pas être attribué par modification.
   */
  role: Exclude<TreeRole, "OWNER">;
}

/**
 * Utilisateur ayant accès à un arbre.
 */
export interface TreeMember {
  id: string;

  treeId: string;

  userId: string;

  role: TreeRole;

  /**
   * Informations utilisateur chargées si nécessaire.
   */
  user: {
    id: string;
    email: string;
  };
}
