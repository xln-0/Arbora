import {
  login as loginApi,
  me as meApi,
  logout as logoutApi,
  getSetupStatus,
  setupAdmin as setupAdminApi,
} from "@/api/authApi";
import { ApiError } from "@/api/client";

import { useAuthStore } from "@/stores/authStore";
import { useTreeStore } from "@/stores/treeStore";

import { useNavigate } from "react-router-dom";

export function useAuth() {
  const navigate = useNavigate();

  const {
    setUser,
    setReady,
    setSetupRequired,
    setInitializing,
    setBackendUnavailable,
  } = useAuthStore();

  const clear = useAuthStore((state) => state.clear);
  const resetTrees = useTreeStore((state) => state.resetTrees);

  async function login(email: string, password: string) {
    const result = await loginApi(email, password);

    setUser(result.user);

    navigate("/");
  }

  async function restoreSession() {
    setInitializing();

    try {
      const setup = await getSetupStatus();
      setSetupRequired(setup.setupRequired);

      if (setup.setupRequired) {
        clear();
        setReady();
        return true;
      }

      try {
        const result = await meApi();

        setUser(result.user);
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          clear();
        } else {
          throw error;
        }
      }

      setReady();
      return true;
    } catch {
      setBackendUnavailable();
      return false;
    }
  }

  async function setupAdmin(email: string, password: string) {
    const result = await setupAdminApi(email, password);

    setUser(result.user);
    setSetupRequired(false);
    navigate("/");
  }

  async function logout() {
    await logoutApi();

    clear();
    resetTrees();

    navigate("/login");
  }

  return {
    login,
    logout,
    restoreSession,
    setupAdmin,
  };
}
