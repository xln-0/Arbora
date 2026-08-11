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

  /**
   * Indique si la vérification de la session utilisateur
   * au démarrage de l'application a été effectuée.
   *
   * Permet d'éviter d'afficher l'application avant de savoir
   * si l'utilisateur possède une session valide.
   */
  initialized: boolean;

  /**
   * Définit l'utilisateur courant après une authentification
   * réussie ou une restauration de session.
   */
  setUser(user: User): void;

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
  setInitialized(): void;
}

export const useAuthStore = create<AuthState>((set) => ({
  /**
   * Aucun utilisateur chargé au démarrage.
   *
   * La valeur est renseignée après l'appel à l'API
   * de restauration de session.
   */
  user: undefined,

  /**
   * L'état d'authentification n'a pas encore été vérifié.
   */
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
