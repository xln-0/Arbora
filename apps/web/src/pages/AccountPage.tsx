import { AppLayout } from "@/components/layout/AppLayout";

import { t } from "@/i18n";

import { useAuthStore } from "@/stores/authStore";
import { useTreeStore } from "@/stores/treeStore";

import { Button } from "@/components/ui";
import { useState } from "react";
import { createTree } from "@/api/treesApi";

export default function AccountPage() {
  const user = useAuthStore((state) => state.user);

  const setTrees = useTreeStore((state) => state.setTrees);

  const selectTree = useTreeStore((state) => state.selectTree);

  const trees = useTreeStore((state) => state.trees);

  const [isCreatingTree, setIsCreatingTree] = useState(false);
  const [newTreeName, setNewTreeName] = useState("");

  async function handleCreateTree() {
    if (!newTreeName.trim()) {
      return;
    }

    try {
      setIsCreatingTree(true);

      const tree = await createTree(newTreeName.trim());

      setTrees([...trees, tree]);

      selectTree(tree.id);

      setNewTreeName("");
    } catch (error) {
      console.error("Failed to create tree", error);
    } finally {
      setIsCreatingTree(false);
    }
  }

  return (
    <AppLayout title={t("navigation.account")}>
      <div
        className="
          p-6

          max-w-3xl

          space-y-6
        "
      >
        {/* Profile */}
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
            {t(`account.profile`)}
          </h2>

          <div
            className="
              space-y-2
            "
          >
            <p>{user?.email}</p>
          </div>
        </section>

        {/* Trees */}
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
              "
            >
              {t(`account.trees`)}
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
                placeholder={t("tree.name")}
                value={newTreeName}
                onChange={(event) => setNewTreeName(event.target.value)}
              />

              <Button
                disabled={!newTreeName.trim() || isCreatingTree}
                onClick={handleCreateTree}
              >
                {t("tree.create")}
              </Button>
            </div>
          </div>

          <div
            className="
              space-y-2
            "
          >
            {trees.map((tree) => (
              <div
                key={tree.id}
                className="
                  rounded-lg
                  border
                  border-border

                  px-4
                  py-3
                "
              >
                🌳 {tree.name}
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
