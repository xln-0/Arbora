import { describe, expect, it } from "vitest";

import type { Event, Person, Relationship } from "@arbora/shared";

import { buildPersonalTimeline, buildTreeTimeline } from "./timelineUtils";

const people: Person[] = [
  {
    id: "parent",
    treeId: "tree",
    firstName: "Parent",
    gender: "UNKNOWN",
    birthDate: "1980-01-01",
    deathDate: null,
    positionX: 0,
    positionY: 0,
  },
  {
    id: "partner",
    treeId: "tree",
    firstName: "Partner",
    gender: "UNKNOWN",
    birthDate: "1982-01-01",
    deathDate: null,
    positionX: 0,
    positionY: 0,
  },
  {
    id: "child",
    treeId: "tree",
    firstName: "Child",
    gender: "UNKNOWN",
    birthDate: "2012-05-10",
    deathDate: null,
    positionX: 0,
    positionY: 0,
  },
];

const relationships: Relationship[] = [
  {
    id: "couple",
    treeId: "tree",
    sourcePersonId: "parent",
    targetPersonId: "partner",
    type: "MARRIAGE",
    unionDate: "2005-01-01",
    marriageDate: "2008-06-14",
    divorceDate: null,
  },
  {
    id: "parent-child",
    treeId: "tree",
    sourcePersonId: "parent",
    targetPersonId: "child",
    type: "PARENT",
    unionDate: null,
    marriageDate: null,
    divorceDate: null,
  },
];

const customEvent: Event = {
  id: "move",
  treeId: "tree",
  type: "RESIDENCE",
  title: "Moved to Lyon",
  date: "2001-03-12",
  place: "Lyon",
  description: null,
  personId: "parent",
  relationshipId: null,
  createdAt: "2026-08-13T00:00:00.000Z",
  updatedAt: "2026-08-13T00:00:00.000Z",
};

const birthEvent: Event = {
  ...customEvent,
  id: "birth",
  type: "BIRTH",
  title: null,
  date: "1980-01-01",
};

const marriageEvent: Event = {
  ...customEvent,
  id: "marriage",
  type: "MARRIAGE",
  title: null,
  date: "2008-06-14",
  relationshipId: "couple",
};

describe("timeline builders", () => {
  it("builds and orders the full tree timeline", () => {
    expect(buildTreeTimeline(people, relationships).map(({ type }) => type)).toEqual([
      "birth",
      "birth",
      "freeUnion",
      "marriage",
      "birth",
    ]);
  });

  it("includes births of children in a personal timeline", () => {
    expect(
      buildPersonalTimeline(people[0], people, relationships).map(
        ({ type }) => type,
      ),
    ).toEqual(["birth", "freeUnion", "marriage", "childBirth"]);
  });

  it("includes stored events attached to the person", () => {
    const timeline = buildPersonalTimeline(
      people[0],
      people,
      relationships,
      [customEvent],
    );

    expect(timeline.map(({ type }) => type)).toEqual([
      "birth",
      "customEvent",
      "freeUnion",
      "marriage",
      "childBirth",
    ]);
  });

  it("links life and couple milestones to their stored events", () => {
    const timeline = buildPersonalTimeline(
      people[0],
      people,
      relationships,
      [birthEvent, marriageEvent],
    );

    expect(timeline.find(({ type }) => type === "birth")?.storedEvent).toBe(
      birthEvent,
    );
    expect(timeline.find(({ type }) => type === "marriage")?.storedEvent).toBe(
      marriageEvent,
    );
    expect(
      timeline.find(({ type }) => type === "childBirth")?.storedEvent,
    ).toBeUndefined();
  });
});
