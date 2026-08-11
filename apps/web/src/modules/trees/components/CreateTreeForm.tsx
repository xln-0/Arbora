import { useState } from "react";

import { Button } from "@/components/ui";

import { createTree } from "@/api/treesApi";

import { useTreeStore } from "@/stores/treeStore";

export default function CreateTreeForm() {
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const addTree = useTreeStore((state) => state.addTree);

  const selectTree = useTreeStore((state) => state.selectTree);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!name.trim()) {
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(undefined);

      const tree = await createTree({ name: name.trim() });

      addTree(tree);

      selectTree(tree.id);

      setName("");
    } catch (error) {
      console.error("Failed to create tree", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to create tree",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-2"
    >
      <div className="flex gap-2">
        <input
          className="
            flex-1

            rounded-lg

            border
            border-border

            px-3
            py-2
          "
          placeholder="Nom de votre famille"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <Button disabled={loading || !name.trim()}>
          {loading ? "Création..." : "Créer mon arbre"}
        </Button>
      </div>

      {errorMessage && (
        <p className="text-sm text-red-600">{errorMessage}</p>
      )}
    </form>
  );
}
