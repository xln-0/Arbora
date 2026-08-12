import { useState } from "react";

import { t } from "@/i18n";

import { createRelationship, deleteRelationship } from "@/api/relationshipsApi";

import { useGraphStore } from "@/stores/graphStore";
import { useUiStore } from "@/stores/uiStore";

import type { Relationship } from "@arbora/shared";
import type { RelationshipFormData } from "../components/RelationshipFormPanel";

import {
  buildRelationshipInput,
  getRelatedPersonName,
} from "../relationshipUtils";
import { getRelationshipErrorMessage } from "../relationshipErrorUtils";

export function useRelationshipActions() {
  const [relationshipError, setRelationshipError] = useState<string>();
  const refreshGraph = useGraphStore((state) => state.refresh);

  const openConfirmDialog = useUiStore((state) => state.openConfirmDialog);

  const closeRelationshipForm = useUiStore(
    (state) => state.closeRelationshipForm,
  );

  async function saveRelationship(
    selectedTreeId: string | undefined,
    selectedPersonId: string | undefined,
    data: RelationshipFormData,
  ) {
    if (!selectedTreeId || !selectedPersonId) {
      return;
    }

    try {
      setRelationshipError(undefined);
      await createRelationship(
        selectedTreeId,
        buildRelationshipInput(selectedPersonId, data),
      );
      refreshGraph();
      closeRelationshipForm();
    } catch (error) {
      setRelationshipError(getRelationshipErrorMessage(error));
    }
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
    relationshipError,
    clearRelationshipError: () => setRelationshipError(undefined),
  };
}
