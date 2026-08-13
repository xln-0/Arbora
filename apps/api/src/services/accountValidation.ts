import type { AppRole } from "@arbora/shared";

import { createAppError } from "../errors/createAppError.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 12;

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function validateCredentials(email: unknown, password: unknown) {
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

export function toAuthenticatedUser(user: {
  id: string;
  email: string;
  role: AppRole;
}) {
  return { id: user.id, email: user.email, role: user.role };
}
