import { create } from "zustand";
import type { FamilyTree } from "@arbora/shared";

interface TreeState {
  trees: FamilyTree[];

  selectedTreeId?: string;

  setTrees(trees: FamilyTree[]): void;

  selectTree(treeId: string): void;

  clearSelectedTree(): void;
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
}));
