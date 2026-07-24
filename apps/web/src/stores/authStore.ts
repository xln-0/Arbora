import { create } from "zustand";
import type { User } from "@arbora/shared";

interface AuthState {
  user?: User;

  initialized: boolean;

  setUser(user: User): void;

  clear(): void;

  setInitialized(): void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: undefined,

  initialized: false,

  setUser(user) {
    set({
      user,
    });
  },

  clear() {
    set({
      user: undefined,
    });
  },

  setInitialized() {
    set({
      initialized: true,
    });
  },
}));
