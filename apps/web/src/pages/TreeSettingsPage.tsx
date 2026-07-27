import { useEffect, useState } from "react";

import { AppLayout } from "@/components/layout";
import { ConfirmDialog } from "@/components/ui";
import { useTreeStore } from "@/stores/treeStore";
import { deleteTree, editTree } from "@/api/treesApi";
import { t } from "@/i18n";
import { Button } from "@/components/ui";
import { useNavigate } from "react-router-dom";

export default function TreeSettingsPage() {
  const navigate = useNavigate();

  const trees = useTreeStore((state) => state.trees);

  const selectedTreeId = useTreeStore((state) => state.selectedTreeId);

  const selectedTree = trees.find((tree) => tree.id === selectedTreeId);

  const tree = trees.find((tree) => tree.id === selectedTreeId);

  const [treeName, setTreeName] = useState(selectedTree?.name ?? "");
  const [isSaving, setIsSaving] = useState(false);

  const updateTree = useTreeStore((state) => state.updateTree);

  const [showDelete, setShowDelete] = useState(false);

  const removeTree = useTreeStore((state) => state.removeTree);

  useEffect(() => {
    if (selectedTree) {
      setTreeName(selectedTree.name);
    }
  }, [selectedTreeId, selectedTree]);

  async function handleSaveTreeName() {
    if (!selectedTree) {
      return;
    }

    try {
      setIsSaving(true);

      const updatedTree = await editTree(selectedTree.id, {
        name: treeName,
      });

      updateTree(updatedTree);
    } catch (error) {
      console.error("Failed to update tree name", error);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteTree() {
    if (!tree) {
      return;
    }

    try {
      await deleteTree(tree.id);

      removeTree(tree.id);

      setShowDelete(false);

      navigate("/");
    } catch (error) {
      console.error("Failed to delete tree", error);
    }
  }

  return (
    <AppLayout title={t(`navigation.treeSettings`)}>
      <div className="flex h-screen flex-col">
        <main className="flex-1 overflow-auto p-6">
          <div
            className="
              max-w-2xl

              space-y-6
            "
          >
            {/* Tree Name */}
            <section
              className="
                bg-surface

                border
                border-border

                rounded-2xl

                p-6

                shadow-sm
              "
            >
              <h2
                className="
                  text-lg
                  font-semibold
                  mb-4
                "
              >
                {t(`settings.treeName`)}
              </h2>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveTreeName();
                }}
                className="space-y-4"
              >
                <input
                  className="
                    w-full
                    border
                    border-border
                    rounded-lg
                    px-3
                    py-2
                  "
                  value={treeName}
                  onChange={(e) => setTreeName(e.target.value)}
                />

                <button
                  type="submit"
                  disabled={
                    isSaving ||
                    !selectedTree ||
                    treeName.trim() === selectedTree.name
                  }
                  className="
                    px-4
                    py-2

                    rounded-lg

                    bg-primary
                    text-white

                    disabled:opacity-50
                  "
                >
                  {t(`actions.save`)}
                </button>
              </form>
            </section>

            {/* Delete */}
            <section
              className="
                bg-surface

                border
                border-red-200

                rounded-2xl

                p-6

                shadow-sm
              "
            >
              <h2
                className="
                  text-lg
                  font-semibold

                  text-red-600

                  mb-2
                "
              >
                Zone dangereuse
              </h2>

              <p
                className="
                  text-sm
                  text-muted

                  mb-4
                "
              >
                Supprimer cet arbre supprimera définitivement toutes les
                personnes et relations associées.
              </p>

              <Button variant="danger" onClick={() => setShowDelete(true)}>
                Supprimer l'arbre
              </Button>
            </section>
          </div>
        </main>
      </div>
      {tree && showDelete && (
        <ConfirmDialog
          title="Supprimer l'arbre"
          message="
            Cette action est définitive.
            Toutes les données associées seront supprimées.

            Tapez le nom de l'arbre pour confirmer.
          "
          confirmationText={tree.name}
          confirmLabel="Supprimer l'arbre"
          onConfirm={handleDeleteTree}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </AppLayout>
  );
}
