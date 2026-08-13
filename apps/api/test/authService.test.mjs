import assert from "node:assert/strict";
import test from "node:test";

import {
  createAppUser,
  createInitialAdmin,
  normalizeEmail,
} from "../dist/services/authService.js";

test("normalizes account emails", () => {
  assert.equal(normalizeEmail("  Admin@Arbora.Local "), "admin@arbora.local");
});

test("creates the first account as administrator", async () => {
  let createdData;
  let lockRequested = false;

  const transaction = {
    $queryRaw: async () => {
      lockRequested = true;
      return [];
    },
    user: {
      count: async () => 0,
      create: async ({ data }) => {
        createdData = data;
        return {
          id: "admin-id",
          email: data.email,
          role: data.role,
        };
      },
    },
  };

  const prisma = {
    $transaction: async (callback) => callback(transaction),
  };

  const user = await createInitialAdmin(prisma, {
    email: " Admin@Arbora.Local ",
    password: "a-secure-password",
  });

  assert.equal(lockRequested, true);
  assert.equal(createdData.email, "admin@arbora.local");
  assert.equal(createdData.role, "ADMIN");
  assert.notEqual(createdData.passwordHash, "a-secure-password");
  assert.deepEqual(user, {
    id: "admin-id",
    email: "admin@arbora.local",
    role: "ADMIN",
  });
});

test("refuses setup when an account already exists", async () => {
  const transaction = {
    $queryRaw: async () => [],
    user: {
      count: async () => 1,
    },
  };

  await assert.rejects(
    createInitialAdmin(
      {
        $transaction: async (callback) => callback(transaction),
      },
      {
        email: "admin@arbora.local",
        password: "a-secure-password",
      },
    ),
    { code: "SETUP_ALREADY_COMPLETED" },
  );
});

test("validates passwords before an administrator creates an account", async () => {
  await assert.rejects(
    createAppUser({}, {
      email: "user@arbora.local",
      password: "too-short",
      role: "USER",
    }),
    { code: "PASSWORD_TOO_SHORT" },
  );
});
