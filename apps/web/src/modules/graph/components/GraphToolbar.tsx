import type { ReactNode } from "react";
import { GitFork, UserPlus } from "lucide-react";

import { t } from "@/i18n";
import { useUiStore } from "@/stores/uiStore";

export default function GraphToolbar() {
  const openPersonForm = useUiStore((state) => state.openCreatePerson);
  const selectedPersonId = useUiStore((state) => state.selectedPersonId);
  const openRelationshipForm = useUiStore(
    (state) => state.openCreateRelationshipForm,
  );

  return (
    <aside
      aria-label={t("graphToolbar.label")}
      className="absolute left-4 top-4 z-20"
    >
      <div className="flex flex-col items-center gap-1 rounded-2xl border border-border/80 bg-surface/90 p-1.5 shadow-[0_14px_38px_rgba(15,23,42,0.16)] backdrop-blur-xl">
        <ToolbarAction
          icon={<UserPlus size={19} />}
          label={t("person.add")}
          onClick={openPersonForm}
        />

        <span className="h-px w-7 bg-border" aria-hidden="true" />

        <ToolbarAction
          icon={<GitFork size={19} />}
          label={
            selectedPersonId
              ? t("relationship.add")
              : t("relationship.selectSource")
          }
          onClick={openRelationshipForm}
          disabled={!selectedPersonId}
        />
      </div>
    </aside>
  );
}

function ToolbarAction({
  icon,
  label,
  onClick,
  disabled = false,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="group relative">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        className="flex h-11 w-11 items-center justify-center rounded-xl text-muted outline-none transition hover:bg-primary hover:text-white focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-muted"
      >
        {icon}
      </button>

      <span
        role="tooltip"
        className="pointer-events-none absolute left-full top-1/2 ml-3 hidden -translate-y-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 sm:block"
      >
        {label}
        <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
      </span>
    </div>
  );
}
