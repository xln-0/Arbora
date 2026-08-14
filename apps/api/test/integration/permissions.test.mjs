import assert from "node:assert/strict";
import { after, before, test } from "node:test";

import { buildApp } from "../../dist/app.js";

const TEST_DATABASE_NAME = "arbora_test";
const PASSWORD = "integration-password";

if (process.env.POSTGRES_DB !== TEST_DATABASE_NAME) {
  throw new Error(
    `Integration tests require the isolated ${TEST_DATABASE_NAME} database`,
  );
}

const app = buildApp({ logger: false });
const fixture = {};

function sessionCookie(response) {
  const setCookie = response.headers["set-cookie"];
  const value = Array.isArray(setCookie) ? setCookie[0] : setCookie;

  assert.ok(value, "Expected an authentication cookie");
  return value.split(";", 1)[0];
}

async function inject(cookie, options) {
  return app.inject({
    ...options,
    headers: {
      ...(options.headers ?? {}),
      cookie,
    },
  });
}

async function login(email) {
  const response = await app.inject({
    method: "POST",
    url: "/auth/login",
    payload: { email, password: PASSWORD },
  });

  assert.equal(response.statusCode, 200);
  return sessionCookie(response);
}

before(async () => {
  await app.ready();
  await app.prisma.$executeRawUnsafe(`
    TRUNCATE TABLE "Session", "Event", "Relationship", "Person", "TreeMember", "FamilyTree", "User"
    RESTART IDENTITY CASCADE
  `);

  const setup = await app.inject({
    method: "POST",
    url: "/auth/setup",
    payload: { email: "owner@arbora.test", password: PASSWORD },
  });
  assert.equal(setup.statusCode, 201);
  fixture.ownerCookie = sessionCookie(setup);

  for (const email of ["editor@arbora.test", "viewer@arbora.test"]) {
    const response = await inject(fixture.ownerCookie, {
      method: "POST",
      url: "/admin/users",
      payload: { email, password: PASSWORD, role: "USER" },
    });
    assert.equal(response.statusCode, 201);
  }

  fixture.editorCookie = await login("editor@arbora.test");
  fixture.viewerCookie = await login("viewer@arbora.test");

  const treeResponse = await inject(fixture.ownerCookie, {
    method: "POST",
    url: "/trees",
    payload: { name: "Integration family" },
  });
  assert.equal(treeResponse.statusCode, 200);
  fixture.treeId = treeResponse.json().id;

  for (const member of [
    { email: "editor@arbora.test", role: "EDITOR" },
    { email: "viewer@arbora.test", role: "VIEWER" },
  ]) {
    const response = await inject(fixture.ownerCookie, {
      method: "POST",
      url: `/trees/${fixture.treeId}/members`,
      payload: member,
    });
    assert.equal(response.statusCode, 200);
  }

  const people = await app.prisma.person.createManyAndReturn({
    data: [
      { treeId: fixture.treeId, firstName: "Alice" },
      { treeId: fixture.treeId, firstName: "Bob" },
    ],
  });
  fixture.personIds = people.map((person) => person.id);
});

after(async () => {
  await app.prisma.$executeRawUnsafe(`
    TRUNCATE TABLE "Session", "Relationship", "Person", "TreeMember", "FamilyTree", "User"
    RESTART IDENTITY CASCADE
  `);
  await app.close();
});

test("persists authentication and tree fixtures in PostgreSQL", async () => {
  assert.equal(await app.prisma.user.count(), 3);
  assert.equal(await app.prisma.familyTree.count(), 1);
  assert.equal(await app.prisma.treeMember.count(), 3);
});

test("allows owner, editor and viewer to read the tree", async () => {
  for (const cookie of [
    fixture.ownerCookie,
    fixture.editorCookie,
    fixture.viewerCookie,
  ]) {
    const response = await inject(cookie, {
      method: "GET",
      url: `/trees/${fixture.treeId}/graph`,
    });

    assert.equal(response.statusCode, 200);
    assert.equal(response.json().persons.length, 2);
  }
});

test("allows owner and editor to mutate people but rejects viewer", async () => {
  for (const [cookie, firstName, expectedStatus] of [
    [fixture.ownerCookie, "Owner creation", 200],
    [fixture.editorCookie, "Editor creation", 200],
    [fixture.viewerCookie, "Viewer creation", 403],
  ]) {
    const response = await inject(cookie, {
      method: "POST",
      url: `/trees/${fixture.treeId}/persons`,
      payload: { firstName },
    });

    assert.equal(response.statusCode, expectedStatus);
  }
});

test("stores person life dates as events", async () => {
  const createResponse = await inject(fixture.editorCookie, {
    method: "POST",
    url: `/trees/${fixture.treeId}/persons`,
    payload: {
      firstName: "Life events",
      birthDate: "1950-02-03",
      deathDate: "2020-11-12",
    },
  });
  assert.equal(createResponse.statusCode, 200);
  assert.equal(createResponse.json().birthDate, "1950-02-03");
  assert.equal(createResponse.json().deathDate, "2020-11-12");

  const lifeEvents = await app.prisma.event.findMany({
    where: { personId: createResponse.json().id },
    orderBy: { date: "asc" },
  });
  assert.deepEqual(
    lifeEvents.map(({ type }) => type),
    ["BIRTH", "DEATH"],
  );

  const updateResponse = await inject(fixture.editorCookie, {
    method: "PATCH",
    url: `/trees/${fixture.treeId}/persons/${createResponse.json().id}`,
    payload: { deathDate: "" },
  });
  assert.equal(updateResponse.statusCode, 200);
  assert.equal(updateResponse.json().deathDate, null);
  assert.equal(
    await app.prisma.event.count({
      where: { personId: createResponse.json().id, type: "DEATH" },
    }),
    0,
  );
});

test("allows owner and editor to mutate relationships but rejects viewer", async () => {
  const payload = {
    sourcePersonId: fixture.personIds[0],
    targetPersonId: fixture.personIds[1],
    type: "PARENT",
  };

  const viewerResponse = await inject(fixture.viewerCookie, {
    method: "POST",
    url: `/trees/${fixture.treeId}/relationships`,
    payload,
  });
  assert.equal(viewerResponse.statusCode, 403);

  const editorResponse = await inject(fixture.editorCookie, {
    method: "POST",
    url: `/trees/${fixture.treeId}/relationships`,
    payload,
  });
  assert.equal(editorResponse.statusCode, 201);
});

test("allows owner and editor to mutate events but rejects viewer", async () => {
  const payload = {
    type: "RESIDENCE",
    date: "1998-09-01",
    place: "Lyon",
    personId: fixture.personIds[0],
  };

  const viewerResponse = await inject(fixture.viewerCookie, {
    method: "POST",
    url: `/trees/${fixture.treeId}/events`,
    payload,
  });
  assert.equal(viewerResponse.statusCode, 403);

  const invalidParticipantResponse = await inject(fixture.editorCookie, {
    method: "POST",
    url: `/trees/${fixture.treeId}/events`,
    payload: {
      ...payload,
      personId: "00000000-0000-0000-0000-000000000000",
    },
  });
  assert.equal(invalidParticipantResponse.statusCode, 400);
  assert.equal(
    invalidParticipantResponse.json().code,
    "INVALID_EVENT_PERSON",
  );

  const invalidDateResponse = await inject(fixture.editorCookie, {
    method: "POST",
    url: `/trees/${fixture.treeId}/events`,
    payload: { ...payload, date: "1998-02-31" },
  });
  assert.equal(invalidDateResponse.statusCode, 400);
  assert.equal(invalidDateResponse.json().code, "INVALID_EVENT_DATE");

  const editorResponse = await inject(fixture.editorCookie, {
    method: "POST",
    url: `/trees/${fixture.treeId}/events`,
    payload,
  });
  assert.equal(editorResponse.statusCode, 201);
  assert.equal(editorResponse.json().personId, fixture.personIds[0]);
  assert.equal(editorResponse.json().title, null);
  const eventId = editorResponse.json().id;

  const viewerListResponse = await inject(fixture.viewerCookie, {
    method: "GET",
    url: `/trees/${fixture.treeId}/events`,
  });
  assert.equal(viewerListResponse.statusCode, 200);
  assert.ok(
    viewerListResponse.json().some((event) => event.id === eventId),
  );

  const editorUpdateResponse = await inject(fixture.editorCookie, {
    method: "PATCH",
    url: `/trees/${fixture.treeId}/events/${eventId}`,
    payload: {
      title: "Moved to Paris",
      place: "Paris",
      personId: fixture.personIds[1],
    },
  });
  assert.equal(editorUpdateResponse.statusCode, 200);
  assert.equal(editorUpdateResponse.json().title, "Moved to Paris");
  assert.equal(editorUpdateResponse.json().personId, fixture.personIds[1]);

  const couplePeople = await app.prisma.person.createManyAndReturn({
    data: [
      { treeId: fixture.treeId, firstName: "Camille" },
      { treeId: fixture.treeId, firstName: "Morgan" },
    ],
  });
  const coupleRelationship = await app.prisma.relationship.create({
    data: {
      treeId: fixture.treeId,
      sourcePersonId: couplePeople[0].id,
      targetPersonId: couplePeople[1].id,
      type: "FREE_UNION",
    },
  });
  const marriageResponse = await inject(fixture.editorCookie, {
    method: "POST",
    url: `/trees/${fixture.treeId}/events`,
    payload: {
      type: "MARRIAGE",
      personId: couplePeople[0].id,
      relationshipId: coupleRelationship.id,
      date: "2012-07-14",
    },
  });
  assert.equal(marriageResponse.statusCode, 201);
  assert.equal(marriageResponse.json().relationshipId, coupleRelationship.id);
  assert.equal(
    (await app.prisma.relationship.findUnique({
      where: { id: coupleRelationship.id },
    })).type,
    "MARRIAGE",
  );

  const viewerDeleteResponse = await inject(fixture.viewerCookie, {
    method: "DELETE",
    url: `/trees/${fixture.treeId}/events/${eventId}`,
  });
  assert.equal(viewerDeleteResponse.statusCode, 403);

  const ownerDeleteResponse = await inject(fixture.ownerCookie, {
    method: "DELETE",
    url: `/trees/${fixture.treeId}/events/${eventId}`,
  });
  assert.equal(ownerDeleteResponse.statusCode, 200);
});

test("reserves tree settings and member management for the owner", async () => {
  for (const cookie of [fixture.editorCookie, fixture.viewerCookie]) {
    const update = await inject(cookie, {
      method: "PATCH",
      url: `/trees/${fixture.treeId}`,
      payload: { name: "Forbidden update" },
    });
    assert.equal(update.statusCode, 403);

    const addMember = await inject(cookie, {
      method: "POST",
      url: `/trees/${fixture.treeId}/members`,
      payload: { email: "nobody@arbora.test", role: "VIEWER" },
    });
    assert.equal(addMember.statusCode, 403);
  }

  const ownerUpdate = await inject(fixture.ownerCookie, {
    method: "PATCH",
    url: `/trees/${fixture.treeId}`,
    payload: { name: "Owner updated family" },
  });
  assert.equal(ownerUpdate.statusCode, 200);
  assert.equal(ownerUpdate.json().name, "Owner updated family");
});

test("reserves global administration for application administrators", async () => {
  const userResponse = await inject(fixture.editorCookie, {
    method: "GET",
    url: "/admin/users",
  });
  assert.equal(userResponse.statusCode, 403);

  const adminResponse = await inject(fixture.ownerCookie, {
    method: "GET",
    url: "/admin/users",
  });
  assert.equal(adminResponse.statusCode, 200);
  assert.equal(adminResponse.json().users.length, 3);
});
