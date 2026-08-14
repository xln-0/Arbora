import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Baby,
  CalendarDays,
  CalendarPlus,
  GitFork,
  Heart,
  HeartCrack,
  HeartHandshake,
  Pencil,
  Trash2,
  UserRound,
  UsersRound,
} from "lucide-react";

import {
  isCoupleRelationshipType,
  type CoupleRelationshipType,
  type Event as StoredEvent,
  type Person,
  type Relationship,
} from "@arbora/shared";

import { AppLayout, OverlayLayer } from "@/components/layout";
import { Avatar, Button, ConfirmDialog } from "@/components/ui";
import { t } from "@/i18n";
import RelationshipFormPanel, {
  type RelationshipFormData,
} from "@/modules/relationship/components/RelationshipFormPanel";
import { getRelationshipCurrentDate } from "@/modules/relationship/relationshipUtils";
import { useTreeGraphQuery } from "@/modules/graph/hooks/useTreeGraphQuery";
import type { PersonalTimelineEvent } from "@/modules/timeline/timelineUtils";
import { usePersonDetailsModel } from "@/modules/people/hooks/usePersonDetailsModel";
import { usePersonRelationshipActions } from "@/modules/people/hooks/usePersonRelationshipActions";
import EventFormPanel from "@/modules/events/components/EventFormPanel";
import { usePersonEventActions } from "@/modules/events/hooks/usePersonEventActions";
import { useSettingsStore } from "@/stores/settingsStore";
import { useTreeStore } from "@/stores/treeStore";

export default function PersonDetailsPage() {
  const { personId } = useParams<{ personId: string }>();
  const selectedTreeId = useTreeStore((state) => state.selectedTreeId);
  const selectedTree = useTreeStore((state) =>
    state.trees.find((tree) => tree.id === state.selectedTreeId),
  );
  const locale = useSettingsStore((state) => state.locale);
  const { graph, isLoading, errorMessage, reload } = useTreeGraphQuery(
    selectedTreeId,
    t("personDetails.loadError"),
  );
  const { person, personById, relations, timelineEvents, formatDate } =
    usePersonDetailsModel(graph, personId, locale);
  const relationshipActions = usePersonRelationshipActions({
    treeId: selectedTreeId,
    person,
    reload,
  });
  const eventActions = usePersonEventActions({
    treeId: selectedTreeId,
    personId: person?.id,
    reload,
  });

  const name = person ? getPersonName(person) : t("personDetails.title");
  const canEdit =
    selectedTree?.role === "OWNER" || selectedTree?.role === "EDITOR";

  return (
    <>
      <AppLayout
        title={name}
        actions={
          person && canEdit ? (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  relationshipActions.closeForm();
                  eventActions.openCreateForm();
                }}
              >
                <CalendarPlus size={17} />
                {t("event.add")}
              </Button>
              <Button
                onClick={() => {
                  eventActions.closeForm();
                  relationshipActions.openCreateForm();
                }}
              >
                <GitFork size={17} />
                {t("relationship.add")}
              </Button>
            </div>
          ) : undefined
        }
      >
        <div className="mx-auto max-w-6xl space-y-8 p-6 lg:p-8">
          <Link
            to="/elements"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-foreground"
          >
            <ArrowLeft size={16} />
            {t("personDetails.back")}
          </Link>

        {!selectedTreeId && (
          <StatusCard message={t("personDetails.noTree")} />
        )}

        {selectedTreeId && isLoading && (
          <p className="text-muted">{t("personDetails.loading")}</p>
        )}

        {errorMessage && (
          <p className="text-sm text-red-600">{errorMessage}</p>
        )}

        {relationshipActions.actionError && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {relationshipActions.actionError}
          </p>
        )}

        {eventActions.errorMessage && !eventActions.isFormOpen && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {eventActions.errorMessage}
          </p>
        )}

        {selectedTreeId && !isLoading && !errorMessage && !person && (
          <StatusCard message={t("personDetails.notFound")} />
        )}

        {person && !isLoading && !errorMessage && (
          <>
            <PersonHeader person={person} formatDate={formatDate} />

            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">
                  {t("personDetails.family")}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {t("personDetails.familyDescription")}
                </p>
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                <RelationGroup
                  title={t("person.relationships.parents")}
                  relationships={relations.parents}
                  emptyLabel={t("personDetails.noParents")}
                  currentPersonId={person.id}
                  personById={personById}
                  canEdit={canEdit}
                  formatDate={formatDate}
                  onEdit={relationshipActions.openEditForm}
                  onDelete={relationshipActions.requestDelete}
                />
                <RelationGroup
                  title={t("person.relationships.partners")}
                  relationships={relations.partners}
                  emptyLabel={t("personDetails.noPartners")}
                  currentPersonId={person.id}
                  personById={personById}
                  canEdit={canEdit}
                  formatDate={formatDate}
                  onEdit={relationshipActions.openEditForm}
                  onDelete={relationshipActions.requestDelete}
                />
                <RelationGroup
                  title={t("person.relationships.children")}
                  relationships={relations.children}
                  emptyLabel={t("personDetails.noChildren")}
                  currentPersonId={person.id}
                  personById={personById}
                  canEdit={canEdit}
                  formatDate={formatDate}
                  onEdit={relationshipActions.openEditForm}
                  onDelete={relationshipActions.requestDelete}
                />
              </div>
            </section>

            <section className="space-y-5">
              <div>
                <h2 className="text-xl font-semibold">
                  {t("personDetails.timeline.title")}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {t("personDetails.timeline.description")}
                </p>
              </div>

              {timelineEvents.length === 0 ? (
                <StatusCard message={t("personDetails.timeline.empty")} />
              ) : (
                <VerticalTimeline
                  events={timelineEvents}
                  formatDate={formatDate}
                  canEdit={canEdit}
                  onEdit={eventActions.openEditForm}
                  onDelete={eventActions.requestDelete}
                />
              )}
            </section>
          </>
        )}
        </div>
      </AppLayout>

      <OverlayLayer>
        {eventActions.isFormOpen && person && (
          <EventFormPanel
            key={eventActions.editingEvent?.id ?? "new-event"}
            personName={getPersonName(person)}
            personId={person.id}
            persons={graph.persons}
            relationships={graph.relationships}
            mode={eventActions.editingEvent ? "edit" : "create"}
            initialData={eventActions.editingEvent}
            onSave={eventActions.save}
            onClose={eventActions.closeForm}
            errorMessage={eventActions.errorMessage}
          />
        )}

        {relationshipActions.isFormOpen && person && (
          <RelationshipFormPanel
            persons={graph.persons.filter((item) => item.id !== person.id)}
            onSave={relationshipActions.save}
            onClose={relationshipActions.closeForm}
            placement="right"
            mode={relationshipActions.editingRelationship ? "edit" : "create"}
            initialData={
              relationshipActions.editingRelationship
                ? toRelationshipFormData(
                    relationshipActions.editingRelationship,
                    person.id,
                  )
                : undefined
            }
            errorMessage={relationshipActions.actionError}
          />
        )}

        {relationshipActions.relationshipToDelete && person && (
          <ConfirmDialog
            title={t("confirm.deleteRelationshipTitle")}
            message={t("confirm.deleteRelationshipMessage", {
              name: getRelatedPersonName(
                relationshipActions.relationshipToDelete,
                person.id,
                personById,
              ),
            })}
            onCancel={relationshipActions.cancelDelete}
            onConfirm={relationshipActions.confirmDelete}
          />
        )}

        {eventActions.eventToDelete && (
          <ConfirmDialog
            title={t("event.deleteTitle")}
            message={t("event.deleteMessage")}
            onCancel={eventActions.cancelDelete}
            onConfirm={eventActions.confirmDelete}
          />
        )}
      </OverlayLayer>
    </>
  );
}

function PersonHeader({
  person,
  formatDate,
}: {
  person: Person;
  formatDate: (date: string) => string;
}) {
  const name = getPersonName(person);

  return (
    <header className="overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
      <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/40" />
      <div className="px-6 pb-7 sm:px-8">
        <Avatar
          name={name}
          className="-mt-10 h-20 w-20 border-4 border-surface bg-primary-soft text-2xl text-primary shadow-sm"
        />

        <div className="mt-4">
          <h1 className="text-3xl font-semibold tracking-tight">{name}</h1>
          <p className="mt-1 text-sm text-muted">
            {t(`gender.${person.gender}`)}
          </p>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <InfoItem
            label={t("person.fields.birthDate")}
            value={person.birthDate ? formatDate(person.birthDate) : "—"}
          />
          <InfoItem
            label={t("person.fields.deathDate")}
            value={person.deathDate ? formatDate(person.deathDate) : "—"}
          />
        </dl>
      </div>
    </header>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-surface-muted px-4 py-3">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  );
}

function RelationGroup({
  title,
  relationships,
  emptyLabel,
  currentPersonId,
  personById,
  canEdit,
  formatDate,
  onEdit,
  onDelete,
}: {
  title: string;
  relationships: Relationship[];
  emptyLabel: string;
  currentPersonId: string;
  personById: Map<string, Person>;
  canEdit: boolean;
  formatDate: (date: string) => string;
  onEdit: (relationship: Relationship) => void;
  onDelete: (relationship: Relationship) => void;
}) {
  const sortedRelationships = [...relationships].sort((a, b) =>
    getRelatedPersonName(a, currentPersonId, personById).localeCompare(
      getRelatedPersonName(b, currentPersonId, personById),
    ),
  );

  return (
    <article className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
        <span className="rounded-full bg-surface-muted px-2.5 py-1 text-xs font-medium text-muted">
          {relationships.length}
        </span>
      </div>

      {relationships.length === 0 ? (
        <p className="py-4 text-sm text-muted">{emptyLabel}</p>
      ) : (
        <div className="space-y-2">
          {sortedRelationships.map((relationship) => {
            const relatedPerson = getRelatedPerson(
              relationship,
              currentPersonId,
              personById,
            );

            if (!relatedPerson) {
              return null;
            }

            const relatedPersonName = getPersonName(relatedPerson);
            const coupleType = isCoupleRelationshipType(relationship.type)
              ? relationship.type
              : undefined;
            const currentDate = getRelationshipCurrentDate(relationship);

            return (
              <div
                key={relationship.id}
                className="group grid grid-cols-[2.5rem_minmax(0,1fr)_auto] gap-x-3 gap-y-1.5 rounded-xl border border-transparent p-2.5 transition hover:border-border hover:bg-surface-muted"
              >
                <Link
                  to={`/people/${relatedPerson.id}`}
                  className={`${coupleType ? "row-span-2" : ""} self-center rounded-full`}
                  aria-label={relatedPersonName}
                >
                  <Avatar
                    name={relatedPersonName}
                    className="h-10 w-10 bg-primary-soft text-primary"
                  />
                </Link>

                <Link
                  to={`/people/${relatedPerson.id}`}
                  className={`min-w-0 truncate text-sm font-medium transition hover:text-primary ${coupleType ? "self-end" : "self-center"}`}
                >
                  {relatedPersonName}
                </Link>

                {canEdit && (
                  <div
                    className={`${coupleType ? "row-span-2" : ""} flex shrink-0 self-center opacity-70 transition group-hover:opacity-100`}
                  >
                    <button
                      type="button"
                      onClick={() => onEdit(relationship)}
                      aria-label={t("actions.edit")}
                      title={t("actions.edit")}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-surface hover:text-foreground"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(relationship)}
                      aria-label={t("actions.delete")}
                      title={t("actions.delete")}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}

                {coupleType && (
                  <div className="col-start-2 flex min-w-0 flex-wrap items-center gap-1.5 self-start">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[0.65rem] font-medium leading-4 ${getCoupleBadgeClassName(coupleType)}`}
                    >
                      {t(`relationship.types.${coupleType}`)}
                    </span>
                    {currentDate && (
                      <time className="text-[0.65rem] leading-4 text-muted">
                        {formatDate(currentDate)}
                      </time>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </article>
  );
}

function VerticalTimeline({
  events,
  formatDate,
  canEdit,
  onEdit,
  onDelete,
}: {
  events: PersonalTimelineEvent[];
  formatDate: (date: string) => string;
  canEdit: boolean;
  onEdit: (event: StoredEvent) => void;
  onDelete: (event: StoredEvent) => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface px-5 py-7 shadow-sm sm:px-8">
      <div className="relative ml-4 border-l-2 border-border">
        {events.map((event, index) => (
          <TimelineEvent
            key={event.id}
            event={event}
            formatDate={formatDate}
            isLast={index === events.length - 1}
            canEdit={canEdit}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

function TimelineEvent({
  event,
  formatDate,
  isLast,
  canEdit,
  onEdit,
  onDelete,
}: {
  event: PersonalTimelineEvent;
  formatDate: (date: string) => string;
  isLast: boolean;
  canEdit: boolean;
  onEdit: (event: StoredEvent) => void;
  onDelete: (event: StoredEvent) => void;
}) {
  const styles = event.type === "customEvent" ? {
    icon: CalendarDays,
    color: "bg-primary text-white",
  } : {
    birth: { icon: Baby, color: "bg-primary text-white" },
    freeUnion: { icon: HeartHandshake, color: "bg-cyan-500 text-white" },
    marriage: { icon: Heart, color: "bg-pink-500 text-white" },
    divorce: { icon: HeartCrack, color: "bg-amber-500 text-white" },
    childBirth: { icon: UsersRound, color: "bg-orange-400 text-white" },
    death: { icon: UserRound, color: "bg-muted text-white" },
  }[event.type];
  const Icon = styles.icon;

  return (
    <div className={`relative pl-9 ${isLast ? "" : "pb-8"}`}>
      <span
        className={`absolute -left-[17px] top-1 flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-surface ${styles.color}`}
      >
        <Icon size={15} />
      </span>

      <article className="rounded-2xl bg-surface-muted p-4 sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <h3 className="font-semibold">
            {event.type === "customEvent"
              ? event.storedEvent.title ||
                t(`event.types.${event.storedEvent.type}`)
              : t(`personDetails.timeline.events.${event.type}`)}
          </h3>
          {event.type === "customEvent" && (
            <div className="mt-1 space-y-1 text-sm text-muted">
              <p>{t(`event.types.${event.storedEvent.type}`)}</p>
              {event.storedEvent.description && (
                <p className="whitespace-pre-line">
                  {event.storedEvent.description}
                </p>
              )}
            </div>
          )}
          {event.type !== "customEvent" && event.relatedPerson && (
            <Link
              to={`/people/${event.relatedPerson.id}`}
              className="mt-1 inline-block truncate text-sm text-primary hover:underline"
            >
              {getPersonName(event.relatedPerson)}
            </Link>
          )}
        </div>
        <div className="mt-2 flex shrink-0 items-center gap-1 sm:mt-0">
          <time
            dateTime={event.date}
            className="mr-1 text-sm font-medium text-muted"
          >
            {event.storedEvent?.place
              ? t("event.dateAtPlace", {
                  date: formatDate(event.date),
                  place: event.storedEvent.place,
                })
              : formatDate(event.date)}
          </time>
          {canEdit && event.storedEvent && (
            <>
              <button
                type="button"
                onClick={() => onEdit(event.storedEvent!)}
                aria-label={t("actions.edit")}
                title={t("actions.edit")}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-surface hover:text-foreground"
              >
                <Pencil size={14} />
              </button>
              <button
                type="button"
                onClick={() => onDelete(event.storedEvent!)}
                aria-label={t("actions.delete")}
                title={t("actions.delete")}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 size={14} />
              </button>
            </>
          )}
        </div>
      </article>
    </div>
  );
}

function StatusCard({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-surface px-6 py-14 text-center">
      <CalendarDays className="mb-3 text-primary" size={24} />
      <p className="text-sm text-muted">{message}</p>
    </div>
  );
}

function getRelatedPerson(
  relationship: Relationship,
  currentPersonId: string,
  personById: Map<string, Person>,
) {
  const relatedId =
    relationship.sourcePersonId === currentPersonId
      ? relationship.targetPersonId
      : relationship.sourcePersonId;

  return personById.get(relatedId);
}

function getRelatedPersonName(
  relationship: Relationship,
  currentPersonId: string,
  personById: Map<string, Person>,
) {
  const person = getRelatedPerson(relationship, currentPersonId, personById);

  return person ? getPersonName(person) : t("elements.unknownPerson");
}

function toRelationshipFormData(
  relationship: Relationship,
  currentPersonId: string,
): RelationshipFormData {
  const targetPersonId =
    relationship.sourcePersonId === currentPersonId
      ? relationship.targetPersonId
      : relationship.sourcePersonId;
  const type =
    isCoupleRelationshipType(relationship.type)
      ? relationship.type
      : relationship.sourcePersonId === currentPersonId
        ? "CHILD"
        : "PARENT";

  return {
    targetPersonId,
    type,
    unionDate: relationship.unionDate ?? undefined,
    marriageDate: relationship.marriageDate ?? undefined,
    divorceDate: relationship.divorceDate ?? undefined,
  };
}

function getCoupleBadgeClassName(type: CoupleRelationshipType) {
  if (type === "FREE_UNION") {
    return "bg-cyan-50 text-cyan-700";
  }

  if (type === "DIVORCE") {
    return "bg-amber-50 text-amber-700";
  }

  return "bg-rose-50 text-rose-700";
}

function getPersonName(person: Person) {
  return [person.firstName, person.lastName].filter(Boolean).join(" ");
}
