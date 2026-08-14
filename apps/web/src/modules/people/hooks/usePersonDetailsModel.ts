import { useMemo } from "react";

import { isCoupleRelationshipType, type Relationship } from "@arbora/shared";

import type { TreeGraph } from "@/api/treesApi";
import { buildPersonalTimeline } from "@/modules/timeline/timelineUtils";

const EMPTY_RELATIONSHIPS: Relationship[] = [];

export function usePersonDetailsModel(
  graph: TreeGraph,
  personId: string | undefined,
  locale: string,
) {
  const person = graph.persons.find((item) => item.id === personId);
  const personById = useMemo(
    () => new Map(graph.persons.map((item) => [item.id, item])),
    [graph.persons],
  );
  const relations = useMemo(() => {
    if (!person) {
      return {
        parents: EMPTY_RELATIONSHIPS,
        partners: EMPTY_RELATIONSHIPS,
        children: EMPTY_RELATIONSHIPS,
      };
    }

    return {
      parents: graph.relationships.filter(
        (relation) =>
          relation.type === "PARENT" &&
          relation.targetPersonId === person.id,
      ),
      partners: graph.relationships.filter(
        (relation) =>
          isCoupleRelationshipType(relation.type) &&
          (relation.sourcePersonId === person.id ||
            relation.targetPersonId === person.id),
      ),
      children: graph.relationships.filter(
        (relation) =>
          relation.type === "PARENT" &&
          relation.sourcePersonId === person.id,
      ),
    };
  }, [graph.relationships, person]);
  const timelineEvents = useMemo(
    () =>
      person
        ? buildPersonalTimeline(
            person,
            graph.persons,
            graph.relationships,
            graph.events,
          )
        : [],
    [graph.events, graph.persons, graph.relationships, person],
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

  return {
    person,
    personById,
    relations,
    timelineEvents,
    formatDate(date: string) {
      return dateFormatter.format(new Date(`${date}T00:00:00.000Z`));
    },
  };
}
