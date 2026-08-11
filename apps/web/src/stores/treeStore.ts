import { create } from "zustand";
import type { FamilyTree } from "@arbora/shared";

/**
 * Store Zustand dédié à la gestion du contexte arbre.
 *
 * Il contient :
 * - la liste des arbres accessibles par l'utilisateur connecté ;
 * - l'arbre actuellement sélectionné dans l'interface ;
 * - les actions permettant de modifier cette liste.
 */
interface TreeState {
  /**
   * Liste des arbres accessibles par l'utilisateur.
   *
   * Chaque arbre peut contenir le rôle de l'utilisateur courant
   * (OWNER, EDITOR, VIEWER).
   */
  trees: FamilyTree[];

  /**
   * Identifiant de l'arbre actuellement affiché dans l'application.
   */
  selectedTreeId?: string;

  /**
   * Initialise ou remplace la liste des arbres accessibles.
   */
  setTrees(trees: FamilyTree[]): void;

  /**
   * Sélectionne un arbre comme contexte courant.
   */
  selectTree(treeId: string): void;

  /**
   * Réinitialise la sélection d'arbre.
   */
  clearSelectedTree(): void;

  /**
   * Ajoute un nouvel arbre dans la liste locale.
   */
  addTree(tree: FamilyTree): void;

  /**
   * Met à jour un arbre existant dans la liste locale.
   */
  updateTree(tree: FamilyTree): void;

  /**
   * Supprime un arbre de la liste locale.
   *
   * Si l'arbre supprimé était sélectionné,
   * sélectionne automatiquement le premier arbre restant.
   */
  removeTree(treeId: string): void;

  /**
   * Retourne l'arbre actuellement sélectionné.
   */
  getSelectedTree(): FamilyTree | undefined;
}

export const useTreeStore = create<TreeState>((set, get) => ({
  /**
   * Aucun arbre chargé au démarrage.
   * La liste est remplie après récupération depuis l'API.
   */
  trees: [],

  /**
   * Aucun arbre sélectionné initialement.
   */
  selectedTreeId: undefined,

  setTrees(trees) {
    set((state) => ({
      trees,
      selectedTreeId: trees.some(
        (tree) => tree.id === state.selectedTreeId,
      )
        ? state.selectedTreeId
        : trees[0]?.id,
    }));
  },

  selectTree(treeId) {
    set({
      selectedTreeId: treeId,
    });
  },

  clearSelectedTree() {
    set({
      selectedTreeId: undefined,
    });
  },

  addTree(tree) {
    set((state) => ({
      trees: [...state.trees, tree],
    }));
  },

  updateTree(tree) {
    set((state) => ({
      trees: state.trees.map((item) =>
        item.id === tree.id ? { ...item, ...tree } : item,
      ),
    }));
  },

  removeTree(treeId) {
    set((state) => {
      const trees = state.trees.filter((tree) => tree.id !== treeId);

      let selectedTreeId = state.selectedTreeId;

      /**
       * Si l'arbre supprimé était celui affiché,
       * on bascule automatiquement vers un autre arbre disponible.
       */
      if (selectedTreeId === treeId) {
        selectedTreeId = trees[0]?.id;
      }

      return {
        trees,
        selectedTreeId,
      };
    });
  },

  getSelectedTree() {
    const state = get();

    /**
     * Recherche l'arbre correspondant à la sélection courante.
     *
     * Exemple :
     * selectedTreeId = "abc"
     *
     * retourne :
     * {
     *   id: "abc",
     *   name: "Famille Dupont",
     *   role: "EDITOR"
     * }
     */
    return state.trees.find((tree) => tree.id === state.selectedTreeId);
  },
}));
