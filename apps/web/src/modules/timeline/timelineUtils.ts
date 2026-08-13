import {
  isCoupleRelationshipType,
  type Person,
  type Relationship,
} from "@arbora/shared";

export type CoupleTimelineEventType = "freeUnion" | "marriage" | "divorce";
export type TimelineEventType =
  | "birth"
  | "death"
  | "childBirth"
  | CoupleTimelineEventType;

interface BaseTimelineEvent {
  id: string;
  date: string;
  type: TimelineEventType;
  relatedPerson?: Person;
}

export interface TreeTimelineEvent extends BaseTimelineEvent {
  person: Person;
  type: Exclude<TimelineEventType, "childBirth">;
}

export type PersonalTimelineEvent = BaseTimelineEvent;

function compareEvents(a: BaseTimelineEvent, b: BaseTimelineEvent) {
  return (
    a.date.localeCompare(b.date) ||
    a.type.localeCompare(b.type) ||
    a.id.localeCompare(b.id)
  );
}

export function buildTreeTimeline(
  persons: Person[],
  relationships: Relationship[],
) {
  const events: TreeTimelineEvent[] = [];
  const personById = new Map(persons.map((person) => [person.id, person]));

  for (const person of persons) {
    if (person.birthDate) {
      events.push({
        id: `${person.id}-birth`,
        date: person.birthDate,
        person,
        type: "birth",
      });
    }

    if (person.deathDate) {
      events.push({
        id: `${person.id}-death`,
        date: person.deathDate,
        person,
        type: "death",
      });
    }
  }

  const knownCoupleEvents = new Set<string>();

  for (const relationship of relationships) {
    if (!isCoupleRelationshipType(relationship.type)) continue;

    const person = personById.get(relationship.sourcePersonId);
    const relatedPerson = personById.get(relationship.targetPersonId);

    if (!person || !relatedPerson) continue;

    const coupleKey = [person.id, relatedPerson.id].sort().join(":");

    function addCoupleEvent(
      type: CoupleTimelineEventType,
      date: string | null | undefined,
    ) {
      if (!date) return;

      const eventKey = `${coupleKey}:${type}:${date}`;

      if (knownCoupleEvents.has(eventKey)) return;

      knownCoupleEvents.add(eventKey);
      events.push({
        id: `${relationship.id}-${type}`,
        date,
        person: person!,
        relatedPerson,
        type,
      });
    }

    addCoupleEvent("freeUnion", relationship.unionDate);
    addCoupleEvent("marriage", relationship.marriageDate);
    addCoupleEvent("divorce", relationship.divorceDate);
  }

  return events.sort(compareEvents);
}

export function buildPersonalTimeline(
  person: Person,
  persons: Person[],
  relationships: Relationship[],
) {
  const events: PersonalTimelineEvent[] = [];
  const personById = new Map(persons.map((item) => [item.id, item]));

  if (person.birthDate) {
    events.push({
      id: `${person.id}-birth`,
      date: person.birthDate,
      type: "birth",
    });
  }

  if (person.deathDate) {
    events.push({
      id: `${person.id}-death`,
      date: person.deathDate,
      type: "death",
    });
  }

  for (const relationship of relationships) {
    if (
      isCoupleRelationshipType(relationship.type) &&
      (relationship.sourcePersonId === person.id ||
        relationship.targetPersonId === person.id)
    ) {
      const relatedId =
        relationship.sourcePersonId === person.id
          ? relationship.targetPersonId
          : relationship.sourcePersonId;
      const relatedPerson = personById.get(relatedId);

      for (const [type, date] of [
        ["freeUnion", relationship.unionDate],
        ["marriage", relationship.marriageDate],
        ["divorce", relationship.divorceDate],
      ] as const) {
        if (date) {
          events.push({
            id: `${relationship.id}-${type}`,
            date,
            type,
            relatedPerson,
          });
        }
      }
    }

    if (
      relationship.type === "PARENT" &&
      relationship.sourcePersonId === person.id
    ) {
      const child = personById.get(relationship.targetPersonId);

      if (child?.birthDate) {
        events.push({
          id: `${relationship.id}-childBirth`,
          date: child.birthDate,
          type: "childBirth",
          relatedPerson: child,
        });
      }
    }
  }

  return events.sort(compareEvents);
}
