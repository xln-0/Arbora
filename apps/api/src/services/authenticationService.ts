import argon2 from "argon2";
import type { PrismaClient } from "@arbora/database";

import { normalizeEmail, toAuthenticatedUser } from "./accountValidation.js";

export async function login(
  prisma: PrismaClient,
  email: string,
  password: string,
) {
  const user = await prisma.user.findUnique({
    where: { email: normalizeEmail(email) },
  });

  if (!user?.passwordHash) {
    throw new Error("Invalid credentials");
  }

  if (!(await argon2.verify(user.passwordHash, password))) {
    throw new Error("Invalid credentials");
  }

  return toAuthenticatedUser(user);
}
