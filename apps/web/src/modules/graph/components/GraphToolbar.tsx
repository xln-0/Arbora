import { Button } from "@/components/ui";
import { t } from "@/i18n";
import { useUiStore } from "@/stores/uiStore";

export default function GraphToolbar() {
  const openPersonForm = useUiStore((state) => state.openCreatePerson);

  return (
    <div
      className="
        absolute
        top-4
        left-4
        z-20
      "
    >
      <Button onClick={() => openPersonForm()}>{t("person.add")}</Button>
    </div>
  );
}
