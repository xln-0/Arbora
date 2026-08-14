import argon2 from "argon2";
import type { PrismaClient } from "@arbora/database";
import type { CreateAppUserInput } from "@arbora/shared";

import { createAppError } from "../errors/createAppError.js";
import {
  toAuthenticatedUser,
  validateCredentials,
} from "./accountValidation.js";

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

      return toAuthenticatedUser(user);
    },
    { isolationLevel: "Serializable" },
  );
}
