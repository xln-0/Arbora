import { useEffect, useState } from "react";

import { AppLayout } from "@/components/layout/AppLayout";
import { useTreeStore } from "@/stores/treeStore";
import { editTree } from "@/api/treesApi";
import { t } from "@/i18n";

export default function TreeSettingsPage() {
  const trees = useTreeStore((state) => state.trees);

  const selectedTreeId = useTreeStore((state) => state.selectedTreeId);

  const selectedTree = trees.find((tree) => tree.id === selectedTreeId);

  const updateTree = useTreeStore((state) => state.updateTree);

  const [treeName, setTreeName] = useState(selectedTree?.name ?? "");

  const [isSaving, setIsSaving] = useState(false);

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
          </div>
        </main>
      </div>
    </AppLayout>
  );
}
