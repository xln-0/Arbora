import { Settings2 } from "lucide-react";

import { useTreeStore } from "@/stores/treeStore";
import { t } from "@/i18n";
import { useNavigate } from "react-router-dom";

export default function TreeSettingsButton() {
  const navigate = useNavigate();

  const selectedTree = useTreeStore((state) =>
    state.trees.find((tree) => tree.id === state.selectedTreeId),
  );

  if (selectedTree?.role !== "OWNER") {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => navigate("/tree-settings")}
      className="flex h-11 w-11 items-center justify-center rounded-xl border border-border/80 bg-surface/80 text-muted shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-primary/25 hover:bg-surface hover:text-primary hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 sm:h-10 sm:w-10"
      title={t("navigation.treeSettings")}
      aria-label={t("navigation.treeSettings")}
    >
      <Settings2 size={18} />
    </button>
  );
}
