import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { CalendarDays } from "lucide-react";

import type { Person } from "@arbora/shared";

import { getTreeGraph } from "@/api/treesApi";
import { AppLayout } from "@/components/layout";
import { Avatar } from "@/components/ui";
import { t } from "@/i18n";
import { useSettingsStore } from "@/stores/settingsStore";
import { useTreeStore } from "@/stores/treeStore";

type TimelineEventType = "birth" | "death";

interface TimelineEvent {
  id: string;
  date: string;
  person: Person;
  type: TimelineEventType;
}

export default function TreeTimelinePage() {
  const selectedTreeId = useTreeStore((state) => state.selectedTreeId);
  const selectedTree = useTreeStore((state) =>
    state.trees.find((tree) => tree.id === state.selectedTreeId),
  );
  const locale = useSettingsStore((state) => state.locale);

  const [persons, setPersons] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    if (!selectedTreeId) {
      setPersons([]);
      setErrorMessage(undefined);
      return;
    }

    const treeId = selectedTreeId;
    let cancelled = false;

    async function loadTimeline() {
      try {
        setIsLoading(true);
        setErrorMessage(undefined);

        const graph = await getTreeGraph(treeId);

        if (!cancelled) {
          setPersons(graph.persons);
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error instanceof Error ? error.message : t("timeline.loadError"),
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadTimeline();

    return () => {
      cancelled = true;
    };
  }, [selectedTreeId]);

  const events = useMemo(() => {
    const timelineEvents: TimelineEvent[] = [];

    for (const person of persons) {
      if (person.birthDate) {
        timelineEvents.push({
          id: `${person.id}-birth`,
          date: person.birthDate,
          person,
          type: "birth",
        });
      }

      if (person.deathDate) {
        timelineEvents.push({
          id: `${person.id}-death`,
          date: person.deathDate,
          person,
          type: "death",
        });
      }
    }

    return timelineEvents.sort(
      (a, b) =>
        a.date.localeCompare(b.date) ||
        a.person.id.localeCompare(b.person.id) ||
        a.type.localeCompare(b.type),
    );
  }, [persons]);

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }),
    [locale],
  );

  const title = selectedTree
    ? `${t("navigation.timeline")} - ${selectedTree.name}`
    : t("navigation.timeline");

  return (
    <AppLayout title={title}>
      <div className="min-w-0 space-y-6 p-6 lg:p-8">
        {!selectedTreeId && (
          <EmptyState message={t("timeline.noTree")} />
        )}

        {selectedTreeId && isLoading && (
          <p className="text-muted">{t("timeline.loading")}</p>
        )}

        {errorMessage && (
          <p className="text-sm text-red-600">{errorMessage}</p>
        )}

        {selectedTreeId && !isLoading && !errorMessage && (
          <>
            <header className="mx-auto max-w-6xl">
              <h2 className="text-2xl font-semibold">{t("timeline.title")}</h2>
              <p className="mt-1 text-sm text-muted">
                {t("timeline.description")}
              </p>
            </header>

            {events.length === 0 ? (
              <EmptyState message={t("timeline.empty")} />
            ) : (
              <section className="min-w-0 overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                  <p className="text-sm text-muted">
                    {t("timeline.eventCount", {
                      count: String(events.length),
                    })}
                  </p>
                  <p className="hidden text-xs text-muted sm:block">
                    {t("timeline.scrollHint")}
                  </p>
                </div>

                <div className="max-w-full overflow-x-auto overscroll-x-contain pb-2">
                  <div className="relative flex h-[28rem] min-w-max items-stretch gap-8 px-10 py-8">
                    <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-border" />

                    {events.map((event, index) => (
                      <TimelineItem
                        key={event.id}
                        event={event}
                        position={index % 2 === 0 ? "top" : "bottom"}
                        formattedDate={dateFormatter.format(
                          new Date(`${event.date}T00:00:00.000Z`),
                        )}
                      />
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}

function TimelineItem({
  event,
  position,
  formattedDate,
}: {
  event: TimelineEvent;
  position: "top" | "bottom";
  formattedDate: string;
}) {
  const name = [event.person.firstName, event.person.lastName]
    .filter(Boolean)
    .join(" ");
  const isBirth = event.type === "birth";

  const card = (
    <Link
      to={`/people/${event.person.id}`}
      className="block w-64 rounded-2xl border border-border bg-surface p-4 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="flex items-center gap-3">
        <Avatar
          name={name}
          className={
            isBirth
              ? "h-10 w-10 bg-primary-soft text-primary"
              : "h-10 w-10 bg-surface-muted text-muted"
          }
        />

        <div className="min-w-0">
          <h3 className="truncate font-semibold">{name}</h3>
          <p className="text-xs text-muted">{formattedDate}</p>
        </div>
      </div>

      <p
        className={`mt-4 text-sm font-medium ${
          isBirth ? "text-primary" : "text-muted"
        }`}
      >
        {t(`timeline.events.${event.type}`)}
      </p>
    </Link>
  );

  return (
    <div className="relative grid w-64 shrink-0 grid-rows-[1fr_auto_1fr]">
      <div className="flex items-end pb-7">{position === "top" && card}</div>

      <div className="relative flex h-5 items-center justify-center">
        <span
          className={`z-10 h-4 w-4 rounded-full border-4 border-surface shadow-sm ${
            isBirth ? "bg-primary" : "bg-muted"
          }`}
        />
      </div>

      <div className="flex items-start pt-7">
        {position === "bottom" && card}
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center">
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <CalendarDays size={22} />
      </span>
      <p className="text-sm text-muted">{message}</p>
    </div>
  );
}
