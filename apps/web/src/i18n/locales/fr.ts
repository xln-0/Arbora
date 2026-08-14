export default {
  app: {
    name: "Arbora",
    tagline: "Histoires de famille",
  },

  navigation: {
    explore: "Explorer",
    currentTree: "Arbre actuel",
    dashboard: "Tableau de bord",
    tree: "Mon arbre",
    people: "Personnes",
    elements: "Éléments de l'arbre",
    timeline: "Chronologie",
    settings: "Paramètres",
    treeSettings: "Paramètres de l'arbre",
    account: "Mon compte",
    administration: "Administration",
  },

  auth: {
    welcomeBack: "Heureux de vous retrouver",
    heroTitle: "Retrouvez votre histoire familiale.",
    heroDescription:
      "Explorez vos arbres, enrichissez les liens entre les générations et préservez les souvenirs de votre famille.",
    privateAccess: "Accès réservé aux comptes créés par un administrateur.",
    loginTitle: "Connexion",
    loginDescription: "Accédez à votre espace Arbora.",
    password: "Mot de passe",
    login: "Se connecter",
    loggingIn: "Connexion…",
    invalidCredentials: "Adresse e-mail ou mot de passe incorrect.",
    loginError: "Impossible de se connecter pour le moment.",
    noSignup: "Besoin d’un accès ? Contactez votre administrateur.",
  },

  startup: {
    retry: "Réessayer maintenant",
    automaticRetry: "Une nouvelle tentative sera effectuée automatiquement.",
    server: {
      loadingTitle: "Démarrage d’Arbora…",
      loadingDescription:
        "Connexion au serveur en cours. Cela peut prendre quelques instants après le lancement des conteneurs.",
      unavailableTitle: "Le serveur n’est pas encore disponible",
      unavailableDescription:
        "L’interface reste en attente pour protéger votre session et vos données.",
    },
    trees: {
      loadingTitle: "Chargement de vos arbres…",
      loadingDescription:
        "Nous préparons votre espace familial avant de l’afficher.",
      unavailableTitle: "Impossible de charger vos arbres",
      unavailableDescription:
        "Le serveur a répondu, mais les données ne sont pas encore accessibles.",
    },
  },

  setup: {
    firstLaunch: "Première configuration",
    heroTitle: "Votre espace familial commence ici.",
    heroDescription:
      "Créez le compte administrateur qui pilotera Arbora et invitera ensuite les autres utilisateurs.",
    localSecurity: "Aucune inscription publique n’est autorisée.",
    formTitle: "Créer l’administrateur",
    formDescription:
      "Ce premier compte disposera des droits d’administration de l’application.",
    confirmPassword: "Confirmer le mot de passe",
    passwordHint: "12 caractères minimum.",
    passwordMismatch: "Les mots de passe ne correspondent pas.",
    invalidEmail: "Saisissez une adresse e-mail valide.",
    genericError: "Impossible d’initialiser Arbora.",
    createAdmin: "Initialiser Arbora",
    creating: "Initialisation…",
  },

  administration: {
    title: "Administration de l’application",
    description:
      "Créez les comptes autorisés à se connecter et attribuez leurs droits globaux.",
    users: "Utilisateurs",
    userCount: "{{count}} comptes autorisés",
    loading: "Chargement des utilisateurs…",
    loadError: "Impossible de charger les utilisateurs.",
    createUser: "Nouveau compte",
    createDescription:
      "Communiquez ensuite ces identifiants directement à la personne concernée.",
    email: "Adresse e-mail",
    password: "Mot de passe initial",
    passwordHint: "12 caractères minimum.",
    role: "Rôle dans l’application",
    roles: {
      ADMIN: "Administrateur",
      USER: "Utilisateur",
    },
    create: "Créer le compte",
    creating: "Création…",
    createError: "Impossible de créer ce compte.",
    emailExists: "Un compte utilise déjà cette adresse e-mail.",
  },

  account: {
    profile: "Profil",
    trees: "Mes arbres",
    logout: "Déconnexion",
    email: "Adresse e-mail",
    treeCount: "{{count}} arbres",
    treesDescription: "Créez un nouvel arbre ou changez votre arbre actif.",
    activeTree: "Actif",
    noTrees: "Vous n’avez encore créé aucun arbre.",
    createTreeError: "Impossible de créer l’arbre.",
    profileUnavailable: "Les informations du profil ne sont pas disponibles.",
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

  graphToolbar: {
    label: "Outils",
    description: "Enrichir l’arbre",
    personHint: "Ajouter une nouvelle personne",
    relationshipHint: "Relier la personne sélectionnée",
  },

  sidebar: {
    collapse: "Réduire la barre latérale",
    expand: "Déployer la barre latérale",
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

  timeline: {
    title: "Chronologie familiale",
    description:
      "Parcourez les naissances, les unions, les mariages, les divorces et les décès de l'arbre dans l'ordre chronologique.",
    loading: "Chargement de la chronologie…",
    loadError: "Impossible de charger la chronologie.",
    noTree: "Sélectionnez un arbre pour afficher sa chronologie.",
    empty: "Ajoutez des dates de naissance, de relation ou de décès pour construire la chronologie.",
    eventCount: "{{count}} événements",
    scrollHint: "Faites défiler horizontalement",
    events: {
      birth: "Naissance",
      freeUnion: "Union libre",
      marriage: "Mariage",
      divorce: "Divorce",
      death: "Décès",
    },
  },

  event: {
    add: "Ajouter un événement",
    edit: "Modifier l’événement",
    description: "Ajoutez un moment marquant à la vie de cette personne.",
    editDescription: "Mettez à jour ce moment de la vie de cette personne.",
    deleteTitle: "Supprimer l’événement",
    deleteMessage: "Voulez-vous vraiment supprimer cet événement ?",
    dateAtPlace: "{{date}} à {{place}}",
    person: "Personne concernée",
    titlePlaceholder: "Ex. Déménagement à Lyon",
    selectRelatedPerson: "Sélectionner la deuxième personne",
    noCoupleRelationship:
      "Créez d’abord une relation de couple avec cette personne.",
    fields: {
      type: "Type d’événement",
      title: "Titre (optionnel)",
      date: "Date",
      place: "Lieu",
      description: "Description",
      relatedPerson: "Deuxième personne",
    },
    types: {
      BIRTH: "Naissance",
      BAPTISM: "Baptême",
      EDUCATION: "Études",
      OCCUPATION: "Profession",
      RESIDENCE: "Résidence",
      FREE_UNION: "Union libre",
      MARRIAGE: "Mariage",
      DIVORCE: "Divorce",
      DEATH: "Décès",
      BURIAL: "Inhumation",
      OTHER: "Autre",
    },
    errors: {
      generic: "Impossible d’enregistrer cet événement.",
      delete: "Impossible de supprimer cet événement.",
    },
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

    form: {
      createDescription: "Renseignez les informations essentielles.",
      editDescription: "Mettez à jour les informations de cette personne.",
      viewDescription: "Aperçu de la personne et de ses proches.",
      relationshipDescription: "Les relations enregistrées dans cet arbre.",
      lifeDates: "Dates de vie",
    },
  },

  personDetails: {
    title: "Fiche personne",
    open: "Voir la fiche complète",
    back: "Retour aux éléments de l’arbre",
    loading: "Chargement de la personne…",
    loadError: "Impossible de charger la personne.",
    noTree: "Sélectionnez un arbre pour afficher cette personne.",
    notFound: "Cette personne n’existe pas dans l’arbre sélectionné.",
    relationshipError: "Impossible d’ajouter cette relation.",
    family: "Relations familiales",
    familyDescription: "Naviguez directement vers les proches de cette personne.",
    noParents: "Aucun parent renseigné.",
    noPartners: "Aucune relation de couple renseignée.",
    noChildren: "Aucun enfant renseigné.",
    timeline: {
      title: "Frise chronologique",
      description: "Les événements marquants de sa vie, classés par date.",
      empty: "Ajoutez des dates et des relations pour construire cette frise.",
      events: {
        birth: "Naissance",
        freeUnion: "Union libre",
        marriage: "Mariage",
        divorce: "Divorce",
        childBirth: "Naissance d’un enfant",
        death: "Décès",
      },
    },
  },

  gender: {
    MALE: "Homme",
    FEMALE: "Femme",
    UNKNOWN: "Non renseigné",
  },

  relationship: {
    add: "Ajouter une relation",
    edit: "Modifier la relation",
    description: "Reliez cette personne à un autre membre de l’arbre.",
    editDescription: "Corrigez la personne, le lien familial ou sa date.",
    selectPerson: "Sélectionner une personne",
    thisPerson: "Cette personne",
    isTheir: "est son/sa",
    noAvailablePersons: "Aucune autre personne n’est disponible dans cet arbre.",
    summaryTitle: "Relation à créer",
    editSummaryTitle: "Relation mise à jour",
    summary: "{{name}} · {{relation}}",
    selectSource: "Sélectionnez d’abord une personne dans l’arbre.",
    historyTitle: "Historique du couple",
    historyHint: "Renseignez les étapes connues dans leur ordre chronologique.",
    dateLabels: {
      FREE_UNION: "Date de début de l’union",
      MARRIAGE: "Date du mariage",
      DIVORCE: "Date du divorce",
    },
    errors: {
      duplicate: "Cette relation existe déjà.",
      conflict: "Ces deux personnes ont déjà une relation incompatible.",
      cycle: "Cette relation créerait une boucle parent-enfant.",
      invalid: "La relation n’est pas valide.",
      invalidDate: "La date de la relation n’est pas valide.",
      dateOrder: "Les dates doivent respecter l’ordre union, mariage puis divorce.",
      generic: "Impossible d’enregistrer cette relation.",
    },

    types: {
      PARENT: "Parent",
      CHILD: "Enfant",
      FREE_UNION: "Partenaire (union libre)",
      MARRIAGE: "Époux / Épouse (mariage)",
      DIVORCE: "Ex-conjoint(e) (divorce)",
    },
  },

  settings: {
    appTitle: "Préférences de l’application",
    appDescription:
      "Personnalisez Arbora pour retrouver une expérience adaptée à vos habitudes.",
    language: "Langue",
    languageDescription:
      "Choisissez la langue utilisée dans toute l’interface.",
    treeDescription:
      "Gérez l’identité de cet arbre, ses accès et ses données sensibles.",
    treeName: "Nom de l'arbre",
    treeNameDescription:
      "Ce nom permet d’identifier facilement l’arbre dans votre espace.",
    members: "Membres",
    membersDescription:
      "Invitez vos proches et définissez leur niveau d’accès.",
    email: "Email",
    addMember: "Ajouter un membre",
    noMembers: "Aucun membre à afficher.",
    loadingMembers: "Chargement des membres…",
    loadMembersError: "Impossible de charger les membres.",
    updateMemberError: "Impossible de modifier ce membre.",
    removeMemberError: "Impossible de supprimer ce membre.",
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
    restrictedTitle: "Accès limité",
    updateTreeError: "Impossible de modifier l’arbre.",
    addMemberError: "Impossible d’ajouter ce membre.",
    deleteTreeError: "Impossible de supprimer l’arbre.",
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
