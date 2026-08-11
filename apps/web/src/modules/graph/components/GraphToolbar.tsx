import { GitFork, UserPlus } from "lucide-react";

import { Button } from "@/components/ui";
import { t } from "@/i18n";
import { useUiStore } from "@/stores/uiStore";

export default function GraphToolbar() {
  const openPersonForm = useUiStore((state) => state.openCreatePerson);
  const selectedPersonId = useUiStore((state) => state.selectedPersonId);
  const openRelationshipForm = useUiStore(
    (state) => state.openCreateRelationshipForm,
  );

  return (
    <div
      className="
        absolute
        top-4
        left-4
        z-20
      "
    >
      <div className="flex items-center gap-2 rounded-xl border border-border bg-surface/95 p-2 shadow-md backdrop-blur">
        <Button onClick={() => openPersonForm()}>
          <UserPlus size={17} />
          {t("person.add")}
        </Button>
        <Button
          variant="secondary"
          disabled={!selectedPersonId}
          onClick={() => openRelationshipForm()}
          title={
            selectedPersonId
              ? t("relationship.add")
              : t("relationship.selectSource")
          }
        >
          <GitFork size={17} />
          {t("relationship.add")}
        </Button>
      </div>
    </div>
  );
}
