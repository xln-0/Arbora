import assert from "node:assert/strict";
import test from "node:test";

import { createRelationship } from "../../dist/services/relationshipsService.js";

function createPrisma(existingRelationships = []) {
  return {
    person: {
      count: async () => 2,
    },
    relationship: {
      findMany: async () => existingRelationships,
      create: async ({ data }) => ({ id: "relationship-id", ...data }),
    },
  };
}

test("preserves every known couple milestone", async () => {
  const relationship = await createRelationship(
    createPrisma(),
    "tree-id",
    {
      sourcePersonId: "person-a",
      targetPersonId: "person-b",
      type: "DIVORCE",
      unionDate: "2000-01-10",
      marriageDate: "2005-06-18",
      divorceDate: "2018-09-03",
    },
  );

  assert.equal(relationship.unionDate, "2000-01-10");
  assert.equal(relationship.marriageDate, "2005-06-18");
  assert.equal(relationship.divorceDate, "2018-09-03");
});

test("rejects couple milestones outside chronological order", async () => {
  await assert.rejects(
    createRelationship({}, "tree-id", {
      sourcePersonId: "person-a",
      targetPersonId: "person-b",
      type: "DIVORCE",
      unionDate: "2010-01-01",
      marriageDate: "2005-01-01",
      divorceDate: "2020-01-01",
    }),
    { code: "INVALID_RELATIONSHIP_DATE_ORDER" },
  );
});

test("rejects a symmetric duplicate couple relationship", async () => {
  const prisma = createPrisma([
    {
      id: "existing-relationship",
      type: "MARRIAGE",
      sourcePersonId: "person-b",
      targetPersonId: "person-a",
    },
  ]);

  await assert.rejects(
    createRelationship(prisma, "tree-id", {
      sourcePersonId: "person-a",
      targetPersonId: "person-b",
      type: "MARRIAGE",
    }),
    { code: "DUPLICATE_RELATIONSHIP" },
  );
});

test("rejects a parent relationship that closes an ancestry cycle", async () => {
  const prisma = createPrisma([
    {
      id: "relationship-b-c",
      type: "PARENT",
      sourcePersonId: "person-b",
      targetPersonId: "person-c",
    },
    {
      id: "relationship-c-a",
      type: "PARENT",
      sourcePersonId: "person-c",
      targetPersonId: "person-a",
    },
  ]);

  await assert.rejects(
    createRelationship(prisma, "tree-id", {
      sourcePersonId: "person-a",
      targetPersonId: "person-b",
      type: "PARENT",
    }),
    { code: "RELATIONSHIP_CYCLE" },
  );
});
