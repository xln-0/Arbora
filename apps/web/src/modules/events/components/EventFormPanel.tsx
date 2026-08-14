import { useState, type FormEvent } from "react";
import { CalendarPlus, Pencil, UserRound, X } from "lucide-react";

import {
  EVENT_TYPES,
  isCoupleRelationshipType,
  type CreateEventInput,
  type Event as StoredEvent,
  type EventType,
  type Person,
  type Relationship,
} from "@arbora/shared";

import { Button } from "@/components/ui";
import { t } from "@/i18n";

export type EventFormData = Omit<CreateEventInput, "personId">;

interface EventFormPanelProps {
  personName: string;
  personId: string;
  persons: Person[];
  relationships: Relationship[];
  mode?: "create" | "edit";
  initialData?: StoredEvent;
  onSave: (data: EventFormData) => void;
  onClose: () => void;
  errorMessage?: string;
}

export default function EventFormPanel({
  personName,
  personId,
  persons,
  relationships,
  mode = "create",
  initialData,
  onSave,
  onClose,
  errorMessage,
}: EventFormPanelProps) {
  const [type, setType] = useState<EventType>(initialData?.type ?? "OTHER");
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [date, setDate] = useState(initialData?.date ?? "");
  const [place, setPlace] = useState(initialData?.place ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? "",
  );
  const [relationshipId, setRelationshipId] = useState(
    initialData?.relationshipId ?? "",
  );
  const coupleRelationships = relationships.filter(
    (relationship) =>
      isCoupleRelationshipType(relationship.type) &&
      (relationship.sourcePersonId === personId ||
        relationship.targetPersonId === personId),
  );
  const requiresRelationship = isCoupleRelationshipType(type);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!date || (requiresRelationship && !relationshipId)) return;

    onSave({
      type,
      date,
      ...(title.trim() ? { title: title.trim() } : {}),
      ...(requiresRelationship
        ? { relationshipId }
        : mode === "edit"
          ? { relationshipId: null }
          : {}),
      ...(place.trim() ? { place: place.trim() } : {}),
      ...(description.trim() ? { description: description.trim() } : {}),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="fixed inset-x-2 bottom-2 z-50 flex max-h-[calc(100dvh-1rem)] flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl sm:inset-x-auto sm:bottom-auto sm:right-6 sm:top-20 sm:max-h-[calc(100vh-6.5rem)] sm:w-[min(26rem,calc(100vw-3rem))]"
    >
      <header className="relative shrink-0 border-b border-border bg-gradient-to-br from-secondary/50 via-surface to-primary/10 px-4 pb-4 pt-5 sm:px-6 sm:pb-5 sm:pt-6">
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
            {mode === "edit" ? <Pencil size={22} /> : <CalendarPlus size={22} />}
          </span>
          <div>
            <h2 className="text-xl font-semibold">
              {t(mode === "edit" ? "event.edit" : "event.add")}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {t(
                mode === "edit"
                  ? "event.editDescription"
                  : "event.description",
              )}
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
        {errorMessage && (
          <p
            role="alert"
            className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {errorMessage}
          </p>
        )}

        <div className="flex items-center gap-3 rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <UserRound size={17} />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-primary">
              {t("event.person")}
            </p>
            <p className="truncate text-sm font-semibold">{personName}</p>
          </div>
        </div>

        <label className="block">
          <span className={labelClassName}>{t("event.fields.type")}</span>
          <select
            className={inputClassName}
            value={type}
            onChange={(event) => {
              setType(event.target.value as EventType);
              setRelationshipId("");
            }}
          >
            {EVENT_TYPES.map((eventType) => (
              <option key={eventType} value={eventType}>
                {t(`event.types.${eventType}`)}
              </option>
            ))}
          </select>
        </label>

        {requiresRelationship && (
          <label className="block">
            <span className={labelClassName}>
              {t("event.fields.relatedPerson")}
            </span>
            <select
              required
              className={inputClassName}
              value={relationshipId}
              onChange={(event) => setRelationshipId(event.target.value)}
            >
              <option value="">{t("event.selectRelatedPerson")}</option>
              {coupleRelationships.map((relationship) => {
                const relatedPersonId =
                  relationship.sourcePersonId === personId
                    ? relationship.targetPersonId
                    : relationship.sourcePersonId;
                const relatedPerson = persons.find(
                  (person) => person.id === relatedPersonId,
                );

                return (
                  <option key={relationship.id} value={relationship.id}>
                    {relatedPerson
                      ? [relatedPerson.firstName, relatedPerson.lastName]
                          .filter(Boolean)
                          .join(" ")
                      : t("elements.unknownPerson")}
                  </option>
                );
              })}
            </select>
            {coupleRelationships.length === 0 && (
              <p className="mt-2 text-xs text-amber-700">
                {t("event.noCoupleRelationship")}
              </p>
            )}
          </label>
        )}

        <label className="block">
          <span className={labelClassName}>{t("event.fields.title")}</span>
          <input
            autoFocus
            maxLength={160}
            className={inputClassName}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder={t("event.titlePlaceholder")}
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={labelClassName}>{t("event.fields.date")}</span>
            <input
              required
              type="date"
              className={inputClassName}
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </label>

          <label className="block">
            <span className={labelClassName}>{t("event.fields.place")}</span>
            <input
              maxLength={200}
              className={inputClassName}
              value={place}
              onChange={(event) => setPlace(event.target.value)}
            />
          </label>
        </div>

        <label className="block">
          <span className={labelClassName}>{t("event.fields.description")}</span>
          <textarea
            rows={4}
            maxLength={5000}
            className={`${inputClassName} resize-none`}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>
      </div>

      <footer className="flex shrink-0 items-center justify-end gap-2 border-t border-border bg-surface px-4 py-3 sm:gap-3 sm:px-6 sm:py-4">
        <Button type="button" variant="ghost" onClick={onClose}>
          {t("actions.cancel")}
        </Button>
        <Button
          type="submit"
          disabled={!date || (requiresRelationship && !relationshipId)}
        >
          {mode === "edit" ? <Pencil size={16} /> : <CalendarPlus size={16} />}
          {t(mode === "edit" ? "actions.save" : "actions.create")}
        </Button>
      </footer>
    </form>
  );
}

const labelClassName = "mb-1.5 block text-xs font-medium text-muted";
const inputClassName =
  "w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";
