import { create } from "zustand";
import type { FamilyTree } from "@arbora/shared";

interface TreeState {
  trees: FamilyTree[];

  selectedTreeId?: string;

  setTrees(trees: FamilyTree[]): void;

  selectTree(treeId: string): void;

  clearSelectedTree(): void;

  addTree(tree: FamilyTree): void;

  updateTree(tree: FamilyTree): void;

  removeTree(treeId: string): void;
}

export const useTreeStore = create<TreeState>((set) => ({
  trees: [],

  selectedTreeId: undefined,

  setTrees(trees) {
    set({
      trees,
    });
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
      trees: state.trees.map((item) => (item.id === tree.id ? tree : item)),
    }));
  },

  removeTree(treeId) {
    set((state) => {
      const trees = state.trees.filter((tree) => tree.id !== treeId);

      let selectedTreeId = state.selectedTreeId;

      if (selectedTreeId === treeId) {
        selectedTreeId = trees[0]?.id;
      }

      return {
        trees,
        selectedTreeId,
      };
    });
  },
}));
