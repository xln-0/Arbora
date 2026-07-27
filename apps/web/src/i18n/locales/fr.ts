export default {
  app: {
    name: "Arbora",
  },

  navigation: {
    dashboard: "Tableau de bord",
    tree: "Mon arbre",
    people: "Personnes",
    settings: "Paramètres",
    treeSettings: "Paramètres de l'arbre",
    account: "Mon compte",
  },

  account: {
    profile: "Profil",
    trees: "Mes arbres",
    logout: "Déconnexion",
  },

  actions: {
    create: "Ajouter",
    edit: "Modifier",
    delete: "Supprimer",
    close: "Fermer",
    save: "Enregistrer",
    cancel: "Annuler",
  },

  tree: {
    name: "Nom de l'arbre",
    create: "Créer un arbre",
    empty: "Aucun arbre",
  },

  person: {
    add: "Ajouter une personne",
    edit: "Modifier la personne",

    fields: {
      firstName: "Prénom",
      lastName: "Nom",
      gender: "Sexe",
      birthDate: "Date de naissance",
      deathDate: "Date de décès",
    },

    relationships: {
      parents: "Parents",
      children: "Enfants",
      partners: "Conjoints",
    },
  },

  gender: {
    MALE: "Homme",
    FEMALE: "Femme",
    UNKNOWN: "Non renseigné",
  },

  relationship: {
    add: "Ajouter une relation",
    selectPerson: "Selectionner une personne",

    types: {
      PARENT: "Parent",
      PARTNER: "Conjoint(e)",
      CHILD: "Enfant",
    },
  },

  settings: {
    language: "Langue",
    treeName: "Nom de l'arbre",
  },

  confirm: {
    deletePersonTitle: "Supprimer {{name}} ?",
    deletePersonMessage: "Cette action supprimera également ses relations.",
    deleteRelationshipTitle: "Supprimer la relation ?",
    deleteRelationshipMessage: "Supprimer la relation avec {{name}} ?",
  },
};
