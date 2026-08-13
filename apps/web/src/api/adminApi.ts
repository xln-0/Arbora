import type { AppUser, CreateAppUserInput } from "@arbora/shared";

import { apiClient } from "./client.js";

export function getAppUsers() {
  return apiClient<{ users: AppUser[] }>("/admin/users");
}

export function createAppUser(input: CreateAppUserInput) {
  return apiClient<{ user: AppUser }>("/admin/users", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
