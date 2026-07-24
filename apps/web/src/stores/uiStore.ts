import { create } from "zustand";

interface UiState {
  // UI
  selectedPersonId?: string;

  personPanelMode: "create" | "view" | "edit" | null;

  isRelationshipFormOpen: boolean;

  relationshipSourcePersonId?: string;

  // Person Form

  openCreatePerson: () => void;

  openViewPerson: (personId: string) => void;

  openEditPerson: (personId: string) => void;

  closePerson: () => void;

  // Confirm Dialog

  confirmDialog?: {
    title: string;
    message: string;
    onConfirm: () => void;
  };

  openConfirmDialog: (data: {
    title: string;
    message: string;
    onConfirm: () => void;
  }) => void;

  closeConfirmDialog: () => void;

  // Relation Form

  openCreateRelationshipForm(): void;

  closeRelationshipForm(): void;
}

export const useUiStore = create<UiState>((set) => ({
  //
  // Initial state
  //

  selectedPersonId: undefined,

  personPanelMode: null,

  confirmDialog: undefined,

  isRelationshipFormOpen: false,

  relationshipSourcePersonId: undefined,

  //
  // UI
  //

  openCreatePerson() {
    set({
      selectedPersonId: undefined,
      personPanelMode: "create",
    });
  },

  openViewPerson(personId) {
    set({
      selectedPersonId: personId,
      personPanelMode: "view",
    });
  },

  openEditPerson(personId) {
    set({
      selectedPersonId: personId,
      personPanelMode: "edit",
    });
  },

  closePerson() {
    set({
      selectedPersonId: undefined,
      personPanelMode: null,
    });
  },

  openConfirmDialog(data) {
    set({
      confirmDialog: data,
    });
  },

  closeConfirmDialog() {
    set({
      confirmDialog: undefined,
    });
  },

  openCreateRelationshipForm() {
    set({
      isRelationshipFormOpen: true,
    });
  },

  closeRelationshipForm() {
    set({
      relationshipSourcePersonId: undefined,
      isRelationshipFormOpen: false,
    });
  },
}));
