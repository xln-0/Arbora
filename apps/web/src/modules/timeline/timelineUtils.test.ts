import { describe, expect, it } from "vitest";

import type { Person, Relationship } from "@arbora/shared";

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
});
