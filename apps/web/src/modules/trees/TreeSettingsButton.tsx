import { Settings } from "lucide-react";

import { useTreeStore } from "@/stores/treeStore";
import { t } from "@/i18n";
import { useNavigate } from "react-router-dom";

export default function TreeSettingsButton() {
  const navigate = useNavigate();

  const selectedTreeId = useTreeStore((state) => state.selectedTreeId);

  if (!selectedTreeId) {
    return null;
  }

  return (
    <button
      onClick={() => navigate("/tree-settings")}
      className="
        flex
        items-center
        gap-2

        h-9

        rounded-lg

        px-3

        text-sm

        text-muted-foreground

        hover:bg-surface-muted
        hover:text-foreground

        transition
      "
      title="Paramètres de l'arbre"
    >
      <Settings size={16} />

      <span>{t(`navigation.treeSettings`)}</span>
    </button>
  );
}
