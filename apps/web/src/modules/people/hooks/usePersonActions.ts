import { t } from "@/i18n";

import { createPerson, deletePerson, editPerson } from "@/api/personsApi";

import { useGraphStore } from "@/stores/graphStore";
import { useUiStore } from "@/stores/uiStore";

export function usePersonActions() {
  const refreshGraph = useGraphStore((state) => state.refresh);

  const closePerson = useUiStore((state) => state.closePerson);

  const openConfirmDialog = useUiStore((state) => state.openConfirmDialog);

  async function savePerson(
    selectedTreeId: string | undefined,
    selectedPersonId: string | undefined,
    mode: "create" | "edit" | "view",
    data: {
      firstName: string;
      lastName?: string;
      gender?: string;
      birthDate?: string;
      deathDate?: string;
    },
  ) {
    if (!selectedTreeId) {
      return;
    }

    if (mode === "view") {
      return;
    }

    if (mode === "create") {
      await createPerson(selectedTreeId, data);
    }

    if (mode === "edit") {
      if (!selectedPersonId) {
        return;
      }

      await editPerson(selectedPersonId, data);
    }

    refreshGraph();
    closePerson();
  }

  function confirmDeletePerson(personId: string, name: string) {
    openConfirmDialog({
      title: t("confirm.deletePersonTitle", {
        name,
      }),

      message: t("confirm.deletePersonMessage"),

      onConfirm: async () => {
        await deletePerson(personId);

        refreshGraph();

        closePerson();
      },
    });
  }

  return {
    savePerson,
    confirmDeletePerson,
  };
}
