import argon2 from "argon2";
import type { PrismaClient } from "@arbora/database";
import type { CreateAppUserInput } from "@arbora/shared";

import { createAppError } from "../errors/createAppError.js";
import { validateCredentials } from "./accountValidation.js";

const USER_SELECT = {
  id: true,
  email: true,
  role: true,
  createdAt: true,
} as const;

function serializeUser<T extends { createdAt: Date }>(user: T) {
  return { ...user, createdAt: user.createdAt.toISOString() };
}

export async function getAppUsers(prisma: PrismaClient) {
  const users = await prisma.user.findMany({
    orderBy: [{ createdAt: "asc" }, { email: "asc" }],
    select: USER_SELECT,
  });

  return users.map(serializeUser);
}

export async function createAppUser(
  prisma: PrismaClient,
  input: Partial<CreateAppUserInput> | undefined,
) {
  const credentials = validateCredentials(input?.email, input?.password);

  if (input?.role !== "ADMIN" && input?.role !== "USER") {
    throw createAppError("INVALID_APP_ROLE");
  }

  return serializeUser(
    await prisma.user.create({
      data: {
        email: credentials.email,
        passwordHash: await argon2.hash(credentials.password),
        role: input.role,
      },
      select: USER_SELECT,
    }),
  );
}
