export default {
  app: {
    name: "Arbora",
  },

  navigation: {
    dashboard: "Tableau de bord",
    tree: "Mon arbre",
    people: "Personnes",
    elements: "Éléments de l'arbre",
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

  elements: {
    title: "Contenu de l'arbre",
    description: "Retrouvez les personnes et les relations de l'arbre sélectionné.",
    loading: "Chargement des éléments…",
    loadError: "Impossible de charger les éléments de l'arbre.",
    noTree: "Sélectionnez un arbre pour afficher ses éléments.",
    persons: "Personnes",
    relationships: "Relations",
    noPersons: "Aucune personne dans cet arbre.",
    noRelationships: "Aucune relation dans cet arbre.",
    unknownPerson: "Personne inconnue",
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
    thisPerson: "Cette personne",
    isTheir: "est son/sa",

    types: {
      PARENT: "Parent",
      PARTNER: "Conjoint(e)",
      CHILD: "Enfant",
    },
  },

  settings: {
    language: "Langue",
    treeName: "Nom de l'arbre",
    members: "Membres",
    email: "Email",
    addMember: "Ajouter un membre",
    dangerZone: "Zone dangereuse",
    deleteTreeWarning:
      "Supprimer cet arbre supprimera définitivement toutes les personnes et relations associées.",
    roles: {
      owner: "Propriétaire",
      editor: "Éditeur",
      viewer: "Lecteur",
    },
    removeMember: "Supprimer le membre",
    unknownUser: "Utilisateur inconnu",
    ownerOnly: "Seul le propriétaire peut gérer les paramètres de cet arbre.",
  },

  confirm: {
    deletePersonTitle: "Supprimer {{name}} ?",
    deletePersonMessage: "Cette action supprimera également ses relations.",
    deleteRelationshipTitle: "Supprimer la relation ?",
    deleteRelationshipMessage: "Supprimer la relation avec {{name}} ?",
    deleteTreeTitle: "Supprimer l'arbre",
    deleteTreeMessage:
      "Cette action est définitive. Toutes les données associées seront supprimées.",
    deleteTypeToConfirm: "Tapez le nom de l'arbre pour confirmer.",
    typeToConfirm: "Tapez",
  },
};
