import argon2 from "argon2";
import type { PrismaClient } from "@arbora/database";
import type { AppRole, CreateAppUserInput } from "@arbora/shared";

import { createAppError } from "../errors/createAppError.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 12;

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function validateCredentials(email: unknown, password: unknown) {
  const normalizedEmail =
    typeof email === "string" ? normalizeEmail(email) : "";

  if (!EMAIL_PATTERN.test(normalizedEmail)) {
    throw createAppError("INVALID_EMAIL");
  }

  if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
    throw createAppError("PASSWORD_TOO_SHORT");
  }

  return { email: normalizedEmail, password };
}

function toUser(user: { id: string; email: string; role: AppRole }) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
  };
}

export async function login(
  prisma: PrismaClient,
  email: string,
  password: string,
) {
  const user = await prisma.user.findUnique({
    where: {
      email: normalizeEmail(email),
    },
  });

  if (!user?.passwordHash) {
    throw new Error("Invalid credentials");
  }

  const valid = await argon2.verify(user.passwordHash, password);

  if (!valid) {
    throw new Error("Invalid credentials");
  }

  return toUser(user);
}

export async function isSetupRequired(prisma: PrismaClient) {
  return (await prisma.user.count()) === 0;
}

export async function createInitialAdmin(
  prisma: PrismaClient,
  input: Pick<CreateAppUserInput, "email" | "password">,
) {
  const credentials = validateCredentials(input.email, input.password);
  const passwordHash = await argon2.hash(credentials.password);

  return prisma.$transaction(
    async (transaction) => {
      // Serializes the one-time bootstrap across multiple API instances.
      await transaction.$queryRaw<Array<{ lock: string }>>`
        SELECT pg_advisory_xact_lock(1095520847)::text AS lock
      `;

      if ((await transaction.user.count()) > 0) {
        throw createAppError("SETUP_ALREADY_COMPLETED");
      }

      const user = await transaction.user.create({
        data: {
          email: credentials.email,
          passwordHash,
          role: "ADMIN",
        },
      });

      return toUser(user);
    },
    { isolationLevel: "Serializable" },
  );
}

export async function getAppUsers(prisma: PrismaClient) {
  const users = await prisma.user.findMany({
    orderBy: [{ createdAt: "asc" }, { email: "asc" }],
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return users.map((user) => ({
    ...user,
    createdAt: user.createdAt.toISOString(),
  }));
}

export async function createAppUser(
  prisma: PrismaClient,
  input: Partial<CreateAppUserInput> | undefined,
) {
  const credentials = validateCredentials(input?.email, input?.password);

  if (input?.role !== "ADMIN" && input?.role !== "USER") {
    throw createAppError("INVALID_APP_ROLE");
  }

  const user = await prisma.user.create({
    data: {
      email: credentials.email,
      passwordHash: await argon2.hash(credentials.password),
      role: input.role,
    },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return {
    ...user,
    createdAt: user.createdAt.toISOString(),
  };
}
