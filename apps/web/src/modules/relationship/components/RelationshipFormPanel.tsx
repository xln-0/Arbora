import { useState, type FormEvent, type ReactNode } from "react";
import { CalendarDays, GitFork, UserRound, X } from "lucide-react";

import {
  RELATIONSHIP_TYPES,
  type Person,
  type RelationshipType,
} from "@arbora/shared";

import { Button } from "@/components/ui";
import { t } from "@/i18n";

export interface RelationshipFormData {
  targetPersonId: string;
  type: RelationshipType;
  date?: string;
}

interface RelationshipFormPanelProps {
  persons: Person[];
  onSave: (data: RelationshipFormData) => void;
  onClose: () => void;
  placement?: "besidePerson" | "right";
}

export default function RelationshipFormPanel({
  persons,
  onSave,
  onClose,
  placement = "besidePerson",
}: RelationshipFormPanelProps) {
  const [targetPersonId, setTargetPersonId] = useState("");
  const [type, setType] = useState<RelationshipType>("PARENT");
  const [date, setDate] = useState("");

  const selectedPerson = persons.find((person) => person.id === targetPersonId);
  const selectedPersonName = selectedPerson
    ? [selectedPerson.firstName, selectedPerson.lastName]
        .filter(Boolean)
        .join(" ")
    : "";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!targetPersonId) {
      return;
    }

    onSave({
      targetPersonId,
      type,
      ...(type === "PARTNER" && date ? { date } : {}),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`
        fixed top-20 z-50 flex max-h-[calc(100vh-6rem)]
        w-[min(24rem,calc(100vw-3rem))] flex-col overflow-hidden
        rounded-3xl border border-border bg-surface shadow-2xl
        ${placement === "besidePerson" ? "right-6 lg:right-[29rem]" : "right-6"}
      `}
    >
      <header className="relative shrink-0 border-b border-border bg-gradient-to-br from-secondary/50 via-surface to-primary/10 px-6 pb-5 pt-6">
        <button
          type="button"
          onClick={onClose}
          aria-label={t("actions.close")}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-surface/80 text-muted transition hover:bg-surface hover:text-foreground"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-4 pr-9">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground shadow-sm">
            <GitFork size={22} />
          </span>
          <div>
            <h2 className="text-xl font-semibold">{t("relationship.add")}</h2>
            <p className="mt-1 text-sm text-muted">
              {t("relationship.description")}
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        {persons.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border px-5 py-8 text-center">
            <UserRound className="mx-auto text-muted" size={24} />
            <p className="mt-3 text-sm text-muted">
              {t("relationship.noAvailablePersons")}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative space-y-3">
              <RelationField number="1" label={t("relationship.thisPerson")}>
                <select
                  autoFocus
                  required
                  className={inputClassName}
                  value={targetPersonId}
                  onChange={(event) => setTargetPersonId(event.target.value)}
                >
                  <option value="">{t("relationship.selectPerson")}</option>
                  {persons.map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.firstName} {person.lastName}
                    </option>
                  ))}
                </select>
              </RelationField>

              <div className="ml-[1.15rem] h-4 w-px bg-border" />

              <RelationField number="2" label={t("relationship.isTheir")}>
                <select
                  className={inputClassName}
                  value={type}
                  onChange={(event) =>
                    setType(event.target.value as RelationshipType)
                  }
                >
                  {RELATIONSHIP_TYPES.map((relationshipType) => (
                    <option key={relationshipType} value={relationshipType}>
                      {t(`relationship.types.${relationshipType}`)}
                    </option>
                  ))}
                </select>
              </RelationField>
            </div>

            {type === "PARTNER" && (
              <label className="block rounded-2xl border border-border bg-surface-muted/60 p-4">
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <CalendarDays size={17} className="text-primary" />
                  {t("relationship.unionDate")}
                </span>
                <input
                  className={`${inputClassName} mt-3`}
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                />
                <span className="mt-2 block text-xs leading-relaxed text-muted">
                  {t("relationship.unionDateHint")}
                </span>
              </label>
            )}

            {selectedPerson && (
              <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-primary">
                  {t("relationship.summaryTitle")}
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {t("relationship.summary", {
                    name: selectedPersonName,
                    relation: t(`relationship.types.${type}`),
                  })}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <footer className="flex shrink-0 items-center justify-end gap-3 border-t border-border bg-surface px-6 py-4">
        <Button type="button" variant="ghost" onClick={onClose}>
          {t("actions.cancel")}
        </Button>
        <Button type="submit" disabled={!targetPersonId}>
          <GitFork size={16} />
          {t("actions.create")}
        </Button>
      </footer>
    </form>
  );
}

const inputClassName =
  "w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";

function RelationField({
  number,
  label,
  children,
}: {
  number: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block rounded-2xl border border-border bg-surface-muted/60 p-4">
      <span className="mb-3 flex items-center gap-3 text-sm font-semibold">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white">
          {number}
        </span>
        {label}
      </span>
      {children}
    </label>
  );
}
