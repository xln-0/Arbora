import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  ExternalLink,
  Pencil,
  Trash2,
  UserPlus,
  X,
} from "lucide-react";

import {
  GENDERS,
  isCoupleRelationshipType,
  type Gender,
  type Person,
  type Relationship,
} from "@arbora/shared";

import { Avatar, Button } from "@/components/ui";
import { t } from "@/i18n";
import { RelationshipSection } from "@/modules/people/components/RelationshipSection";
import { formatDate, toInputDate } from "@/utils/dateUtils";

interface PersonFormData {
  firstName: string;
  lastName?: string;
  gender: Gender;
  birthDate?: string;
  deathDate?: string;
}

interface PersonFormPanelProps {
  person?: Person;
  persons: Person[];
  relationships: Relationship[];
  mode: "create" | "view" | "edit";
  onSave: (data: PersonFormData) => void;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onDeleteRelationship: (relationship: Relationship) => void;
  canEdit: boolean;
}

export default function PersonFormPanel({
  person,
  persons,
  relationships,
  mode,
  onSave,
  onClose,
  onEdit,
  onDelete,
  onDeleteRelationship,
  canEdit,
}: PersonFormPanelProps) {
  const [firstName, setFirstName] = useState(person?.firstName ?? "");
  const [lastName, setLastName] = useState(person?.lastName ?? "");
  const [gender, setGender] = useState<Gender>(person?.gender || "UNKNOWN");
  const [birthDate, setBirthDate] = useState(person?.birthDate ?? "");
  const [deathDate, setDeathDate] = useState(person?.deathDate ?? "");

  const isReadonly = mode === "view";
  const name = person
    ? [person.firstName, person.lastName].filter(Boolean).join(" ")
    : "";

  const parents = relationships.filter(
    (relationship) =>
      relationship.type === "PARENT" &&
      relationship.targetPersonId === person?.id,
  );
  const partners = relationships.filter(
    (relationship) =>
      isCoupleRelationshipType(relationship.type) &&
      (relationship.sourcePersonId === person?.id ||
        relationship.targetPersonId === person?.id),
  );
  const children = relationships.filter(
    (relationship) =>
      relationship.type === "PARENT" &&
      relationship.sourcePersonId === person?.id,
  );

  useEffect(() => {
    if (mode === "create") {
      setFirstName("");
      setLastName("");
      setGender("UNKNOWN");
      setBirthDate("");
      setDeathDate("");
      return;
    }

    if (person) {
      setFirstName(person.firstName);
      setLastName(person.lastName ?? "");
      setGender(person.gender);
      setBirthDate(toInputDate(person.birthDate));
      setDeathDate(toInputDate(person.deathDate));
    }
  }, [person, mode]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onSave({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      gender,
      birthDate,
      deathDate,
    });
  }

  const panelTitle =
    mode === "create" ? t("person.add") : mode === "edit" ? t("person.edit") : name;
  const panelDescription =
    mode === "create"
      ? t("person.form.createDescription")
      : mode === "edit"
        ? t("person.form.editDescription")
        : t("person.form.viewDescription");

  return (
    <form
      onSubmit={handleSubmit}
      className="fixed right-6 top-20 z-50 flex max-h-[calc(100vh-6rem)] w-[min(26rem,calc(100vw-3rem))] flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl"
    >
      <div className="relative shrink-0 border-b border-border bg-gradient-to-br from-primary/15 via-surface to-secondary/30 px-6 pb-5 pt-6">
        <button
          type="button"
          onClick={onClose}
          aria-label={t("actions.close")}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-surface/80 text-muted transition hover:bg-surface hover:text-foreground"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-4 pr-9">
          {mode === "view" && person ? (
            <Avatar
              name={name}
              className="h-14 w-14 shrink-0 border-2 border-surface bg-primary-soft text-lg text-primary shadow-sm"
            />
          ) : (
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-sm">
              {mode === "create" ? <UserPlus size={22} /> : <Pencil size={21} />}
            </span>
          )}

          <div className="min-w-0">
            <h2 className="truncate text-xl font-semibold">{panelTitle}</h2>
            <p className="mt-1 text-sm text-muted">{panelDescription}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        {isReadonly ? (
          person && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3">
                <ReadonlyField
                  label={t("person.fields.gender")}
                  value={t(`gender.${person.gender}`)}
                  className="col-span-2"
                />
                <ReadonlyField
                  label={t("person.fields.birthDate")}
                  value={formatDate(person.birthDate) || "—"}
                />
                <ReadonlyField
                  label={t("person.fields.deathDate")}
                  value={formatDate(person.deathDate) || "—"}
                />
              </div>

              <Link
                to={`/people/${person.id}`}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-white transition hover:bg-primary-hover"
              >
                {t("personDetails.open")}
                <ExternalLink size={16} />
              </Link>

              <div className="space-y-4 border-t border-border pt-5">
                <div>
                  <h3 className="font-semibold">{t("personDetails.family")}</h3>
                  <p className="mt-1 text-xs text-muted">
                    {t("person.form.relationshipDescription")}
                  </p>
                </div>

                <RelationshipSection
                  title={t("person.relationships.parents")}
                  relationships={parents}
                  persons={persons}
                  currentPersonId={person.id}
                  onDelete={onDeleteRelationship}
                  canEdit={canEdit}
                />
                <RelationshipSection
                  title={t("person.relationships.partners")}
                  relationships={partners}
                  persons={persons}
                  currentPersonId={person.id}
                  onDelete={onDeleteRelationship}
                  canEdit={canEdit}
                />
                <RelationshipSection
                  title={t("person.relationships.children")}
                  relationships={children}
                  persons={persons}
                  currentPersonId={person.id}
                  onDelete={onDeleteRelationship}
                  canEdit={canEdit}
                />
              </div>
            </div>
          )
        ) : (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label={t("person.fields.firstName")} required>
                <input
                  autoFocus
                  required
                  className={inputClassName}
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  placeholder={t("person.fields.firstName")}
                />
              </FormField>

              <FormField label={t("person.fields.lastName")}>
                <input
                  className={inputClassName}
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  placeholder={t("person.fields.lastName")}
                />
              </FormField>
            </div>

            <FormField label={t("person.fields.gender")}>
              <select
                className={inputClassName}
                value={gender}
                onChange={(event) => setGender(event.target.value as Gender)}
              >
                {GENDERS.map((item) => (
                  <option key={item} value={item}>
                    {t(`gender.${item}`)}
                  </option>
                ))}
              </select>
            </FormField>

            <div className="rounded-2xl border border-border bg-surface-muted/60 p-4">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
                <CalendarDays size={17} className="text-primary" />
                {t("person.form.lifeDates")}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label={t("person.fields.birthDate")}>
                  <input
                    type="date"
                    className={inputClassName}
                    value={birthDate}
                    onChange={(event) => setBirthDate(event.target.value)}
                  />
                </FormField>
                <FormField label={t("person.fields.deathDate")}>
                  <input
                    type="date"
                    className={inputClassName}
                    value={deathDate}
                    onChange={(event) => setDeathDate(event.target.value)}
                  />
                </FormField>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-border bg-surface px-6 py-4">
        {mode === "view" ? (
          <>
            <Button type="button" variant="ghost" onClick={onClose}>
              {t("actions.close")}
            </Button>

            {canEdit && (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="danger"
                  onClick={onDelete}
                  className="px-3"
                  title={t("actions.delete")}
                >
                  <Trash2 size={17} />
                </Button>
                <Button type="button" variant="secondary" onClick={onEdit}>
                  <Pencil size={16} />
                  {t("actions.edit")}
                </Button>
              </div>
            )}
          </>
        ) : (
          <>
            <Button type="button" variant="ghost" onClick={onClose}>
              {t("actions.cancel")}
            </Button>
            <Button type="submit" disabled={!firstName.trim()}>
              {t("actions.save")}
            </Button>
          </>
        )}
      </footer>
    </form>
  );
}

const inputClassName =
  "w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}

function ReadonlyField({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl bg-surface-muted px-4 py-3 ${className}`}>
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}
