import { create } from "zustand";
import type { User } from "@arbora/shared";

/**
 * Store Zustand dédié à la gestion de l'authentification utilisateur.
 *
 * Il contient :
 * - l'utilisateur actuellement connecté ;
 * - l'état d'initialisation de la session.
 *
 * La gestion de la session (cookie, restauration depuis l'API, etc.)
 * reste côté service d'authentification. Ce store ne conserve que
 * l'état nécessaire à l'interface.
 */
interface AuthState {
  /**
   * Utilisateur actuellement connecté.
   *
   * Undefined lorsque :
   * - aucun utilisateur n'est authentifié ;
   * - la session n'a pas encore été restaurée.
   */
  user?: User;

  startupStatus: "loading" | "ready" | "unavailable";

  setupRequired: boolean;

  /**
   * Définit l'utilisateur courant après une authentification
   * réussie ou une restauration de session.
   */
  setUser(user: User): void;

  setSetupRequired(required: boolean): void;

  /**
   * Supprime l'utilisateur courant.
   *
   * Utilisé notamment lors d'une déconnexion
   * ou d'une session expirée.
   */
  clear(): void;

  /**
   * Marque la restauration de session comme terminée.
   *
   * Après cet appel, l'application peut décider d'afficher :
   * - les routes authentifiées ;
   * - la page de connexion.
   */
  setReady(): void;

  setInitializing(): void;

  setBackendUnavailable(): void;
}

export const useAuthStore = create<AuthState>((set) => ({
  /**
   * Aucun utilisateur chargé au démarrage.
   *
   * La valeur est renseignée après l'appel à l'API
   * de restauration de session.
   */
  user: undefined,

  startupStatus: "loading",

  setupRequired: false,

  setUser(user) {
    set({
      user,
    });
  },

  setSetupRequired(setupRequired) {
    set({ setupRequired });
  },

  clear() {
    set({
      user: undefined,
    });
  },

  setReady() {
    set({
      startupStatus: "ready",
    });
  },

  setInitializing() {
    set({
      startupStatus: "loading",
    });
  },

  setBackendUnavailable() {
    set({
      startupStatus: "unavailable",
    });
  },
}));
