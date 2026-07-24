import argon2 from "argon2";
import type { PrismaClient } from "@arbora/database";

export async function login(
  prisma: PrismaClient,
  email: string,
  password: string,
) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  if (!user.passwordHash) {
    throw new Error("User has no password");
  }

  const valid = await argon2.verify(user.passwordHash, password);

  if (!valid) {
    throw new Error("Invalid credentials");
  }

  return {
    id: user.id,
    email: user.email,
  };
}
