import {
  login as loginApi,
  me as meApi,
  logout as logoutApi,
} from "@/api/authApi";

import { useAuthStore } from "@/stores/authStore";
import { useTreeStore } from "@/stores/treeStore";

import { useNavigate } from "react-router-dom";

export function useAuth() {
  const navigate = useNavigate();

  const { setUser, setInitialized } = useAuthStore();

  const clear = useAuthStore((state) => state.clear);
  const clearSelectedTree = useTreeStore((state) => state.clearSelectedTree);
  const setTrees = useTreeStore((state) => state.setTrees);

  async function login(email: string, password: string) {
    const result = await loginApi(email, password);

    setUser(result.user);

    navigate("/");
  }

  async function restoreSession() {
    try {
      const result = await meApi();

      setUser(result.user);
    } catch {
      // pas connecté
      console.log("No active session");
    } finally {
      setInitialized();
    }
  }

  async function logout() {
    await logoutApi();

    clear();
    setTrees([]);
    clearSelectedTree();

    navigate("/login");
  }

  return {
    login,
    logout,
    restoreSession,
  };
}
