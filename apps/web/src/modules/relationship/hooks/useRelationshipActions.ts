import { t } from "@/i18n";

import { createRelationship, deleteRelationship } from "@/api/relationshipsApi";

import { useGraphStore } from "@/stores/graphStore";
import { useUiStore } from "@/stores/uiStore";

import type { Relationship, RelationshipType } from "@arbora/shared";

import {
  buildRelationshipInput,
  getRelatedPersonName,
} from "../relationshipUtils";

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
      date?: string;
    },
  ) {
    if (!selectedTreeId || !selectedPersonId) {
      return;
    }

    await createRelationship(
      selectedTreeId,
      buildRelationshipInput(selectedPersonId, data),
    );

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
