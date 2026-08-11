import { create } from "zustand";

import type { Locale } from "@/i18n/locales";
import { loadLocale } from "@/i18n/loadLocale";
import { detectLocale } from "@/i18n/detectLocale";

/**
 * Store Zustand dédié aux paramètres globaux de l'application.
 *
 * Actuellement il gère :
 * - la langue active ;
 * - les messages de traduction chargés.
 *
 * Ce store pourra évoluer pour accueillir d'autres préférences :
 * - thème clair/sombre ;
 * - préférences d'affichage ;
 * - options de l'éditeur graphique.
 */
interface SettingsState {
  /**
   * Indique si les paramètres de l'application
   * ont été chargés et initialisés.
   *
   * Permet d'éviter d'afficher l'application
   * avec des traductions incomplètes.
   */
  initialized: boolean;

  /**
   * Langue actuellement utilisée par l'application.
   */
  locale: Locale;

  /**
   * Dictionnaire des messages de traduction chargés.
   *
   * Exemple :
   *
   * {
   *   "common.save": "Enregistrer",
   *   "common.cancel": "Annuler"
   * }
   */
  messages: Record<string, any>;

  /**
   * Initialise les paramètres au démarrage.
   *
   * Étapes :
   * 1. Détection de la langue utilisateur ;
   * 2. Chargement du fichier de traduction ;
   * 3. Mise à jour du store.
   */
  initialize(): Promise<void>;

  /**
   * Change la langue active.
   *
   * Charge les nouveaux messages puis
   * persiste le choix utilisateur.
   */
  setLocale(locale: Locale): Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  //
  // Initial state
  //

  /**
   * Les paramètres n'ont pas encore été chargés.
   */
  initialized: false,

  /**
   * Langue par défaut utilisée avant initialisation.
   */
  locale: "fr",

  /**
   * Aucun message de traduction chargé.
   */
  messages: {},

  //
  // Initialization
  //

  async initialize() {
    /**
     * Détermine la langue à utiliser.
     *
     * La détection peut prendre en compte :
     * - une préférence sauvegardée ;
     * - la langue du navigateur ;
     * - la langue par défaut.
     */
    const locale = detectLocale();

    /**
     * Chargement dynamique des traductions.
     */
    const messages = await loadLocale(locale);

    set({
      locale,
      messages,
      initialized: true,
    });
  },

  //
  // Locale management
  //

  async setLocale(locale) {
    /**
     * Charge les traductions avant de changer
     * la langue active afin d'éviter un état incomplet.
     */
    const messages = await loadLocale(locale);

    /**
     * Persistance locale du choix utilisateur.
     *
     * La langue sera restaurée lors du prochain lancement.
     */
    localStorage.setItem("locale", locale);

    set({
      locale,
      messages,
    });
  },
}));
