import { useEffect, useState } from "react";

import { AppLayout } from "@/components/layout";
import { ConfirmDialog } from "@/components/ui";
import { useTreeStore } from "@/stores/treeStore";
import { deleteTree, editTree } from "@/api/treesApi";
import { t } from "@/i18n";
import { Button } from "@/components/ui";
import { useNavigate } from "react-router-dom";
import TreeMembers from "@/modules/trees/components/TreeMembers";
import { addTreeMember } from "@/api/treeMembersApi";

export default function TreeSettingsPage() {
  const navigate = useNavigate();

  const trees = useTreeStore((state) => state.trees);

  const selectedTreeId = useTreeStore((state) => state.selectedTreeId);

  const tree = trees.find((tree) => tree.id === selectedTreeId);

  const [treeName, setTreeName] = useState(tree?.name ?? "");
  const [isSaving, setIsSaving] = useState(false);

  const updateTree = useTreeStore((state) => state.updateTree);

  const [showDelete, setShowDelete] = useState(false);

  const removeTree = useTreeStore((state) => state.removeTree);

  const [memberEmail, setMemberEmail] = useState("");
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [membersRefreshKey, setMembersRefreshKey] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    if (tree) {
      setTreeName(tree.name);
    }
  }, [selectedTreeId, tree]);

  if (!tree || tree.role !== "OWNER") {
    return (
      <AppLayout title={t("navigation.treeSettings")}>
        <div className="p-6 text-muted">
          {tree ? t("settings.ownerOnly") : t("tree.empty")}
        </div>
      </AppLayout>
    );
  }

  async function handleSaveTreeName() {
    try {
      setIsSaving(true);
      setErrorMessage(undefined);

      const updatedTree = await editTree(tree.id, {
        name: treeName.trim(),
      });

      updateTree(updatedTree);
    } catch (error) {
      console.error("Failed to update tree name", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to update tree",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAddMember() {
    if (!tree || !memberEmail.trim()) {
      return;
    }

    try {
      setIsAddingMember(true);
      setErrorMessage(undefined);

      await addTreeMember(tree.id, {
        email: memberEmail.trim(),
        role: "VIEWER",
      });

      setMemberEmail("");

      // Force TreeMembers à recharger
      setMembersRefreshKey((value) => value + 1);
    } catch (error) {
      console.error("Failed to add member", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to add member",
      );
    } finally {
      setIsAddingMember(false);
    }
  }

  async function handleDeleteTree() {
    if (!tree) {
      return;
    }

    try {
      setErrorMessage(undefined);
      await deleteTree(tree.id);

      removeTree(tree.id);

      setShowDelete(false);

      navigate("/");
    } catch (error) {
      console.error("Failed to delete tree", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to delete tree",
      );
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
            {errorMessage && (
              <p className="text-sm text-red-600">{errorMessage}</p>
            )}

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
                    !treeName.trim() ||
                    treeName.trim() === tree.name
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

            {/* Members */}
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
              <div
                className="
                  flex
                  items-center
                  justify-between

                  mb-4
                "
              >
                <h2
                  className="
                text-lg
                font-semibold
                mb-4
                "
                >
                  {t(`settings.members`)}
                </h2>
                <div
                  className="
                flex
                gap-2
              "
                >
                  <input
                    className="
                      h-10
                      flex-1

                      rounded-lg

                      border
                      border-border

                      px-3

                      text-sm
                      "
                    placeholder={t("settings.email")}
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                  />
                  <Button onClick={handleAddMember} disabled={isAddingMember}>
                    {t("settings.addMember")}
                  </Button>
                </div>
              </div>
              {tree && (
                <TreeMembers treeId={tree.id} refreshKey={membersRefreshKey} />
              )}
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
                {t(`settings.dangerZone`)}
              </h2>

              <p
                className="
                  text-sm
                  text-muted

                  mb-4
                "
              >
                {t(`settings.deleteTreeWarning`)}
              </p>

              <Button variant="danger" onClick={() => setShowDelete(true)}>
                {t(`confirm.deleteTreeTitle`)}
              </Button>
            </section>
          </div>
        </main>
      </div>
      {tree && showDelete && (
        <ConfirmDialog
          title={t(`confirm.deleteTreeTitle`)}
          message={
            t(`confirm.deleteTreeMessage`) +
            "\n\n" +
            t(`confirm.deleteTypeToConfirm`)
          }
          confirmationText={tree.name}
          confirmLabel={t(`actions.delete`)}
          onConfirm={handleDeleteTree}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </AppLayout>
  );
}
