import { useShallow } from "zustand/shallow";

import { t } from "@/i18n";

import { AppLayout, OverlayLayer } from "@/components/layout";
import { Badge, ConfirmDialog } from "@/components/ui";

import FamilyGraph from "@/modules/graph/components/FamilyGraph";
import PersonFormPanel from "@/modules/people/components/PersonFormPanel";
import RelationshipFormPanel from "@/modules/relationship/components/RelationshipFormPanel";

import { usePersonActions } from "@/modules/people/hooks/usePersonActions";
import { useRelationshipActions } from "@/modules/relationship/hooks/useRelationshipActions";

import type { Relationship, RelationshipType } from "@arbora/shared";

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

  const { saveRelationship, confirmDeleteRelationship } =
    useRelationshipActions();

  //
  // Handlers
  //

  function handleEditPerson() {
    if (!canEdit || !selectedPersonId) {
      return;
    }

    openEditPerson(selectedPersonId);
  }

  function handleSaveRelationship(data: {
    targetPersonId: string;
    type: RelationshipType;
    date?: string;
  }) {
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

  return (
    <>
      <AppLayout
        title={
          selectedTree
            ? `${t("navigation.dashboard")} - ${selectedTree.name}`
            : t("navigation.dashboard")
        }
        actions={<TreeSettingsButton />}
        topbarBadge={
          selectedTree?.role ? (
            <Badge>
              {t(`settings.roles.${selectedTree.role.toLowerCase()}`)}
            </Badge>
          ) : undefined
        }
      >
        {selectedTreeId ? <FamilyGraph /> : <WelcomePage />}
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
            onClose={closeRelationshipForm}
            onSave={handleSaveRelationship}
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
