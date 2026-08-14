/**
 * Utilisateur de l'application.
 */
export type AppRole = "ADMIN" | "USER";

export interface User {
  id: string;

  email: string;

  role: AppRole;
}

export interface AppUser extends User {
  createdAt: string;
}

export interface CreateAppUserInput {
  email: string;
  password: string;
  role: AppRole;
}
