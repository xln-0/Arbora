import { useState } from "react";

import type { Event } from "@arbora/shared";

import { createEvent, deleteEvent, editEvent } from "@/api/eventsApi";
import { t } from "@/i18n";
import type { EventFormData } from "../components/EventFormPanel";

interface Options {
  treeId?: string;
  personId?: string;
  reload: () => void;
}

export function usePersonEventActions({ treeId, personId, reload }: Options) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event>();
  const [eventToDelete, setEventToDelete] = useState<Event>();
  const [errorMessage, setErrorMessage] = useState<string>();

  function openCreateForm() {
    setErrorMessage(undefined);
    setEditingEvent(undefined);
    setIsFormOpen(true);
  }

  function openEditForm(event: Event) {
    setErrorMessage(undefined);
    setEditingEvent(event);
    setIsFormOpen(true);
  }

  function closeForm() {
    setErrorMessage(undefined);
    setEditingEvent(undefined);
    setIsFormOpen(false);
  }

  async function save(data: EventFormData) {
    if (!treeId || !personId) return;

    try {
      setErrorMessage(undefined);
      if (editingEvent) {
        await editEvent(treeId, editingEvent.id, {
          ...data,
          personId: editingEvent.personId,
          title: data.title ?? null,
          place: data.place ?? null,
          description: data.description ?? null,
        });
      } else {
        await createEvent(treeId, { ...data, personId });
      }
      reload();
      closeForm();
    } catch {
      setErrorMessage(t("event.errors.generic"));
    }
  }

  function requestDelete(event: Event) {
    setErrorMessage(undefined);
    setEventToDelete(event);
  }

  function cancelDelete() {
    setEventToDelete(undefined);
  }

  async function confirmDelete() {
    if (!treeId || !eventToDelete) return;

    try {
      setErrorMessage(undefined);
      await deleteEvent(treeId, eventToDelete.id);
      setEventToDelete(undefined);
      reload();
    } catch {
      setEventToDelete(undefined);
      setErrorMessage(t("event.errors.delete"));
    }
  }

  return {
    isFormOpen,
    editingEvent,
    eventToDelete,
    errorMessage,
    openCreateForm,
    openEditForm,
    closeForm,
    save,
    requestDelete,
    cancelDelete,
    confirmDelete,
  };
}
