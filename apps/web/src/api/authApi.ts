import type { User } from "@arbora/shared";
import { apiClient } from "./client.js";

export interface AuthResponse {
  user: User;
}

export interface SetupStatusResponse {
  setupRequired: boolean;
}

export function login(email: string, password: string) {
  return apiClient<AuthResponse>("/auth/login", {
    method: "POST",

    body: JSON.stringify({
      email,
      password,
    }),
  });
}

export function me() {
  return apiClient<AuthResponse>("/auth/me");
}

export function getSetupStatus() {
  return apiClient<SetupStatusResponse>("/auth/setup");
}

export function setupAdmin(email: string, password: string) {
  return apiClient<AuthResponse>("/auth/setup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function logout(): Promise<void> {
  return apiClient<void>("/auth/logout", {
    method: "POST",
  });
}
