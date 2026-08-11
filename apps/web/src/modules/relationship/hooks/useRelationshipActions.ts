import { t } from "@/i18n";

import { createRelationship, deleteRelationship } from "@/api/relationshipsApi";

import { useGraphStore } from "@/stores/graphStore";
import { useUiStore } from "@/stores/uiStore";

import type { Relationship, RelationshipType } from "@arbora/shared";

import { getRelatedPersonName } from "../relationshipUtils";

export function useRelationshipActions() {
  const refreshGraph = useGraphStore((state) => state.refresh);

  const openConfirmDialog = useUiStore((state) => state.openConfirmDialog);

  const closeRelationshipForm = useUiStore(
    (state) => state.closeRelationshipForm,
  );

  async function saveRelationship(
    selectedTreeId: string | undefined,
    selectedPersonId: string | undefined,
    data: {
      targetPersonId: string;
      type: RelationshipType;
    },
  ) {
    if (!selectedTreeId || !selectedPersonId) {
      return;
    }

    const isTargetParent = data.type === "PARENT";
    const isParentChildRelationship =
      data.type === "PARENT" || data.type === "CHILD";

    await createRelationship(selectedTreeId, {
      // The form describes the selected target relative to the current person.
      // The API and database store parent/child links canonically as
      // parent -> child, so both UI choices are normalized before sending.
      sourcePersonId: isTargetParent
        ? data.targetPersonId
        : selectedPersonId,
      targetPersonId: isTargetParent
        ? selectedPersonId
        : data.targetPersonId,
      type: isParentChildRelationship ? "PARENT" : "PARTNER",
    });

    refreshGraph();

    closeRelationshipForm();
  }

  function confirmDeleteRelationship(
    treeId: string,
    relationship: Relationship,
    selectedPersonId: string | undefined,
    persons: Parameters<typeof getRelatedPersonName>[2],
  ) {
    if (!selectedPersonId) {
      return;
    }

    openConfirmDialog({
      title: t("confirm.deleteRelationshipTitle"),

      message: t("confirm.deleteRelationshipMessage", {
        name: getRelatedPersonName(relationship, selectedPersonId, persons),
      }),

      onConfirm: async () => {
        await deleteRelationship(treeId, relationship.id);

        refreshGraph();
      },
    });
  }

  return {
    saveRelationship,
    confirmDeleteRelationship,
  };
}
