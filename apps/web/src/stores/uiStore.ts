import { create } from "zustand";

/**
 * Store Zustand dédié à l'état temporaire de l'interface.
 *
 * Contrairement aux autres stores :
 * - authStore -> état utilisateur/session
 * - treeStore -> données et contexte arbre
 *
 * uiStore contient uniquement les éléments nécessaires
 * au comportement des composants :
 * - panneaux ouverts ;
 * - formulaires actifs ;
 * - dialogues de confirmation ;
 * - sélections courantes.
 */
interface UiState {
  /**
   * Identifiant de la personne actuellement sélectionnée.
   *
   * Utilisé par les panneaux de consultation/modification
   * d'une personne.
   */
  selectedPersonId?: string;

  /**
   * Mode d'affichage du panneau personne.
   *
   * null    : aucun panneau ouvert
   * create  : création d'une nouvelle personne
   * view    : consultation d'une personne
   * edit    : modification d'une personne
   */
  personPanelMode: "create" | "view" | "edit" | null;

  /**
   * Indique si le formulaire de création/modification
   * d'une relation est ouvert.
   */
  isRelationshipFormOpen: boolean;

  /**
   * Personne utilisée comme source lors de la création
   * d'une relation.
   *
   * Exemple :
   * "Ajouter un enfant à Jean Dupont"
   * => Jean Dupont devient la source.
   */
  relationshipSourcePersonId?: string;

  //
  // Person Form
  //

  /**
   * Ouvre le formulaire de création d'une personne.
   */
  openCreatePerson(): void;

  /**
   * Ouvre le panneau de consultation d'une personne.
   */
  openViewPerson(personId: string): void;

  /**
   * Ouvre le panneau de modification d'une personne.
   */
  openEditPerson(personId: string): void;

  /**
   * Ferme le panneau personne courant.
   */
  closePerson(): void;

  //
  // Confirm Dialog
  //

  /**
   * Dialogue de confirmation actuellement affiché.
   *
   * Exemple :
   * "Voulez-vous supprimer cette personne ?"
   */
  confirmDialog?: {
    title: string;
    message: string;

    /**
     * Action exécutée après confirmation.
     */
    onConfirm: () => void;
  };

  /**
   * Affiche un dialogue de confirmation.
   */
  openConfirmDialog(data: {
    title: string;
    message: string;
    onConfirm: () => void;
  }): void;

  /**
   * Ferme le dialogue de confirmation.
   */
  closeConfirmDialog(): void;

  //
  // Relation Form
  //

  /**
   * Ouvre le formulaire de création d'une relation.
   */
  openCreateRelationshipForm(): void;

  /**
   * Ferme le formulaire de relation.
   */
  closeRelationshipForm(): void;
}

export const useUiStore = create<UiState>((set) => ({
  //
  // Initial state
  //

  /**
   * Aucune personne sélectionnée au démarrage.
   */
  selectedPersonId: undefined,

  /**
   * Aucun panneau personne ouvert.
   */
  personPanelMode: null,

  /**
   * Aucun dialogue de confirmation affiché.
   */
  confirmDialog: undefined,

  /**
   * Le formulaire de relation est fermé par défaut.
   */
  isRelationshipFormOpen: false,

  /**
   * Aucune personne source de relation sélectionnée.
   */
  relationshipSourcePersonId: undefined,

  //
  // Person Form
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

  //
  // Confirm Dialog
  //

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

  //
  // Relation Form
  //

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
