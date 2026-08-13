import { useState } from "react";

import type { Person, Relationship } from "@arbora/shared";

import {
  createRelationship,
  deleteRelationship,
  editRelationship,
} from "@/api/relationshipsApi";
import type { RelationshipFormData } from "@/modules/relationship/components/RelationshipFormPanel";
import { getRelationshipErrorMessage } from "@/modules/relationship/relationshipErrorUtils";
import { buildRelationshipInput } from "@/modules/relationship/relationshipUtils";

interface Options {
  treeId?: string;
  person?: Person;
  reload: () => void;
}

export function usePersonRelationshipActions({ treeId, person, reload }: Options) {
  const [actionError, setActionError] = useState<string>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRelationship, setEditingRelationship] = useState<Relationship>();
  const [relationshipToDelete, setRelationshipToDelete] = useState<Relationship>();

  function closeForm() {
    setActionError(undefined);
    setEditingRelationship(undefined);
    setIsFormOpen(false);
  }

  function openCreateForm() {
    setActionError(undefined);
    setEditingRelationship(undefined);
    setIsFormOpen(true);
  }

  function openEditForm(relationship: Relationship) {
    setActionError(undefined);
    setEditingRelationship(relationship);
    setIsFormOpen(true);
  }

  async function save(data: RelationshipFormData) {
    if (!treeId || !person) return;

    try {
      setActionError(undefined);
      const input = buildRelationshipInput(person.id, data);

      if (editingRelationship) {
        await editRelationship(treeId, editingRelationship.id, input);
      } else {
        await createRelationship(treeId, input);
      }

      reload();
      closeForm();
    } catch (error) {
      setActionError(getRelationshipErrorMessage(error));
    }
  }

  async function confirmDelete() {
    if (!treeId || !relationshipToDelete) return;

    try {
      setActionError(undefined);
      await deleteRelationship(treeId, relationshipToDelete.id);
      reload();
    } catch (error) {
      setActionError(getRelationshipErrorMessage(error));
    } finally {
      setRelationshipToDelete(undefined);
    }
  }

  return {
    actionError,
    isFormOpen,
    editingRelationship,
    relationshipToDelete,
    openCreateForm,
    openEditForm,
    closeForm,
    save,
    requestDelete: setRelationshipToDelete,
    cancelDelete: () => setRelationshipToDelete(undefined),
    confirmDelete,
  };
}
