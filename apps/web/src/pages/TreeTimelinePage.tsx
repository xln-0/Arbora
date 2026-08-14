import { useMemo } from "react";
import { Link } from "react-router-dom";

import { CalendarDays, Heart, HeartCrack, HeartHandshake } from "lucide-react";

import { AppLayout } from "@/components/layout";
import { Avatar } from "@/components/ui";
import { t } from "@/i18n";
import { useTreeGraphQuery } from "@/modules/graph/hooks/useTreeGraphQuery";
import {
  buildTreeTimeline,
  type CoupleTimelineEventType,
  type TimelineEventType,
  type TreeTimelineEvent as TimelineEvent,
} from "@/modules/timeline/timelineUtils";
import { useSettingsStore } from "@/stores/settingsStore";
import { useTreeStore } from "@/stores/treeStore";

export default function TreeTimelinePage() {
  const selectedTreeId = useTreeStore((state) => state.selectedTreeId);
  const selectedTree = useTreeStore((state) =>
    state.trees.find((tree) => tree.id === state.selectedTreeId),
  );
  const locale = useSettingsStore((state) => state.locale);

  const { graph, isLoading, errorMessage } = useTreeGraphQuery(
    selectedTreeId,
    t("timeline.loadError"),
  );
  const { persons, relationships } = graph;

  const events = useMemo(
    () => buildTreeTimeline(persons, relationships),
    [persons, relationships],
  );

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
      <div className="mx-auto min-w-0 max-w-6xl space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
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
            <header>
              <h2 className="text-2xl font-semibold">{t("timeline.title")}</h2>
              <p className="mt-1 text-sm text-muted">
                {t("timeline.description")}
              </p>
            </header>

            {events.length === 0 ? (
              <EmptyState message={t("timeline.empty")} />
            ) : (
              <section className="min-w-0 overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
                <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5 sm:py-4">
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
                  <div className="relative flex h-[25rem] min-w-max items-stretch gap-5 px-5 py-6 sm:h-[28rem] sm:gap-8 sm:px-10 sm:py-8">
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
  const coupleStyle = isCoupleTimelineEventType(event.type)
    ? getCoupleTimelineStyle(event.type)
    : undefined;
  const isCoupleEvent = coupleStyle !== undefined;
  const relatedName = event.relatedPerson
    ? [event.relatedPerson.firstName, event.relatedPerson.lastName]
        .filter(Boolean)
        .join(" ")
    : "";

  const personCard = (
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

  const coupleCard = event.relatedPerson && coupleStyle ? (
    <div
      className={`w-64 rounded-2xl border bg-surface p-4 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg ${coupleStyle.border}`}
    >
      <div className="flex items-center gap-3">
        <div className="flex shrink-0 -space-x-3">
          <Avatar
            name={name}
            className={`h-10 w-10 border-2 border-surface ${coupleStyle.avatar}`}
          />
          <Avatar
            name={relatedName}
            className={`h-10 w-10 border-2 border-surface ${coupleStyle.secondAvatar}`}
          />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">
            <Link
              to={`/people/${event.person.id}`}
              className={coupleStyle.link}
            >
              {name}
            </Link>
            <span className="mx-1 text-muted">&amp;</span>
            <Link
              to={`/people/${event.relatedPerson.id}`}
              className={coupleStyle.link}
            >
              {relatedName}
            </Link>
          </p>
          <p className="text-xs text-muted">{formattedDate}</p>
        </div>
      </div>

      <p
        className={`mt-4 flex items-center gap-2 text-sm font-medium ${coupleStyle.text}`}
      >
        <coupleStyle.icon size={15} />
        {t(`timeline.events.${event.type}`)}
      </p>
    </div>
  ) : null;
  const card = isCoupleEvent ? coupleCard : personCard;

  return (
    <div className="relative grid w-64 shrink-0 grid-rows-[1fr_auto_1fr]">
      <div className="flex items-end pb-7">{position === "top" && card}</div>

      <div className="relative flex h-5 items-center justify-center">
        <span
          className={`z-10 h-4 w-4 rounded-full border-4 border-surface shadow-sm ${
            coupleStyle?.dot ?? (isBirth ? "bg-primary" : "bg-muted")
          }`}
        />
      </div>

      <div className="flex items-start pt-7">
        {position === "bottom" && card}
      </div>
    </div>
  );
}

function isCoupleTimelineEventType(
  type: TimelineEventType,
): type is CoupleTimelineEventType {
  return type === "freeUnion" || type === "marriage" || type === "divorce";
}

function getCoupleTimelineStyle(type: CoupleTimelineEventType) {
  if (type === "freeUnion") {
    return {
      icon: HeartHandshake,
      border: "border-cyan-100",
      avatar: "bg-cyan-50 text-cyan-600",
      secondAvatar: "bg-cyan-100 text-cyan-700",
      link: "hover:text-cyan-600",
      text: "text-cyan-700",
      dot: "bg-cyan-500",
    };
  }

  if (type === "divorce") {
    return {
      icon: HeartCrack,
      border: "border-amber-100",
      avatar: "bg-amber-50 text-amber-600",
      secondAvatar: "bg-amber-100 text-amber-700",
      link: "hover:text-amber-600",
      text: "text-amber-700",
      dot: "bg-amber-500",
    };
  }

  return {
    icon: Heart,
    border: "border-rose-100",
    avatar: "bg-rose-50 text-rose-600",
    secondAvatar: "bg-rose-100 text-rose-700",
    link: "hover:text-rose-600",
    text: "text-rose-600",
    dot: "bg-rose-400",
  };
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
