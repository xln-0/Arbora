import { useShallow } from "zustand/shallow";
import { Crown } from "lucide-react";

import { t } from "@/i18n";

import { AppLayout, OverlayLayer } from "@/components/layout";
import { Badge, ConfirmDialog } from "@/components/ui";

import FamilyGraph from "@/modules/graph/components/FamilyGraph";
import PersonFormPanel from "@/modules/people/components/PersonFormPanel";
import RelationshipFormPanel, {
  type RelationshipFormData,
} from "@/modules/relationship/components/RelationshipFormPanel";

import { usePersonActions } from "@/modules/people/hooks/usePersonActions";
import { useRelationshipActions } from "@/modules/relationship/hooks/useRelationshipActions";

import type { Relationship } from "@arbora/shared";

import { useGraphStore, useTreeStore, useUiStore } from "@/stores";
import TreeSettingsButton from "@/modules/trees/components/TreeSettingsButton";
import { WelcomePage } from "@/pages";

export default function DashboardPage() {
  //
  // UI
  //

  const {
    personPanelMode,
    selectedPersonId,
    confirmDialog,
    isRelationshipFormOpen,

    closePerson,
    openEditPerson,
    closeConfirmDialog,

    closeRelationshipForm,
  } = useUiStore(
    useShallow((state) => ({
      personPanelMode: state.personPanelMode,
      selectedPersonId: state.selectedPersonId,
      confirmDialog: state.confirmDialog,
      isRelationshipFormOpen: state.isRelationshipFormOpen,

      closePerson: state.closePerson,
      openEditPerson: state.openEditPerson,

      closeConfirmDialog: state.closeConfirmDialog,

      closeRelationshipForm: state.closeRelationshipForm,
    })),
  );

  //
  // Graph
  //

  const personsMap = useGraphStore((state) => state.persons);

  const relationshipsMap = useGraphStore((state) => state.relationships);

  const persons = Object.values(personsMap);

  const relationships = Object.values(relationshipsMap);

  const selectedPerson = selectedPersonId
    ? personsMap[selectedPersonId]
    : undefined;

  const selectedRelationships = relationships.filter(
    (relationship) =>
      relationship.sourcePersonId === selectedPersonId ||
      relationship.targetPersonId === selectedPersonId,
  );

  //
  // Tree
  //

  const trees = useTreeStore((state) => state.trees);

  const selectedTreeId = useTreeStore((state) => state.selectedTreeId);

  const selectedTree = trees.find((tree) => tree.id === selectedTreeId);
  const canEdit =
    selectedTree?.role === "OWNER" || selectedTree?.role === "EDITOR";

  //
  // Actions
  //

  const { savePerson, confirmDeletePerson } = usePersonActions();

  const {
    saveRelationship,
    confirmDeleteRelationship,
    relationshipError,
    clearRelationshipError,
  } = useRelationshipActions();

  //
  // Handlers
  //

  function handleEditPerson() {
    if (!canEdit || !selectedPersonId) {
      return;
    }

    openEditPerson(selectedPersonId);
  }

  function handleSaveRelationship(data: RelationshipFormData) {
    return saveRelationship(selectedTreeId, selectedPersonId, data);
  }

  function handleDeleteRelationship(relationship: Relationship) {
    if (!selectedTreeId) {
      return;
    }

    return confirmDeleteRelationship(
      selectedTreeId,
      relationship,
      selectedPersonId,
      persons,
    );
  }

  function handleCloseRelationshipForm() {
    clearRelationshipError();
    closeRelationshipForm();
  }

  function handleGraphPaneClick() {
    closePerson();
    handleCloseRelationshipForm();
  }

  return (
    <>
      <AppLayout
        title={
          selectedTree
            ? `${t("navigation.dashboard")} - ${selectedTree.name}`
            : t("navigation.dashboard")
        }
        actions={
          selectedTree?.role === "OWNER" ? <TreeSettingsButton /> : undefined
        }
        topbarBadge={
          selectedTree?.role ? (
            <Badge
              className={
                selectedTree.role === "OWNER"
                  ? "border-amber-200 bg-amber-50/90 text-amber-700 shadow-sm"
                  : selectedTree.role === "EDITOR"
                    ? "border-blue-200 bg-blue-50/90 text-blue-700"
                    : "border-slate-200 bg-slate-50/90 text-slate-600"
              }
            >
              {selectedTree.role === "OWNER" && (
                <Crown className="mr-1.5 text-amber-500" size={13} />
              )}
              {t(`settings.roles.${selectedTree.role.toLowerCase()}`)}
            </Badge>
          ) : undefined
        }
      >
        {selectedTreeId ? (
          <FamilyGraph onPaneClick={handleGraphPaneClick} />
        ) : (
          <WelcomePage />
        )}
      </AppLayout>

      <OverlayLayer>
        {personPanelMode && (
          <PersonFormPanel
            person={selectedPerson}
            persons={persons}
            relationships={selectedRelationships}
            mode={personPanelMode}
            onClose={closePerson}
            onSave={(data) =>
              savePerson(
                selectedTreeId,
                selectedPersonId,
                personPanelMode,
                data,
              )
            }
            onEdit={handleEditPerson}
            onDelete={() =>
              selectedTreeId &&
              selectedPerson &&
              confirmDeletePerson(
                selectedTreeId,
                selectedPerson.id,
                `${selectedPerson.firstName} ${selectedPerson.lastName}`,
              )
            }
            onDeleteRelationship={handleDeleteRelationship}
            canEdit={canEdit}
          />
        )}

        {isRelationshipFormOpen && (
          <RelationshipFormPanel
            persons={persons.filter((person) => person.id !== selectedPersonId)}
            onClose={handleCloseRelationshipForm}
            onSave={handleSaveRelationship}
            errorMessage={relationshipError}
          />
        )}

        {confirmDialog && (
          <ConfirmDialog
            title={confirmDialog.title}
            message={confirmDialog.message}
            onCancel={closeConfirmDialog}
            onConfirm={() => {
              confirmDialog.onConfirm();

              closeConfirmDialog();
            }}
          />
        )}
      </OverlayLayer>
    </>
  );
}
