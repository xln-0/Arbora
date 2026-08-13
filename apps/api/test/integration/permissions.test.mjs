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
    TRUNCATE TABLE "Session", "Relationship", "Person", "TreeMember", "FamilyTree", "User"
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
