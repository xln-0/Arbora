import { create } from "zustand";
import type { FamilyTree } from "@arbora/shared";

interface TreeState {
  trees: FamilyTree[];

  selectedTreeId?: string;

  setTrees(trees: FamilyTree[]): void;

  selectTree(treeId: string): void;

  clearSelectedTree(): void;

  updateTree(tree: FamilyTree): void;
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

  updateTree(tree) {
    set((state) => ({
      trees: state.trees.map((item) => (item.id === tree.id ? tree : item)),
    }));
  },
}));
