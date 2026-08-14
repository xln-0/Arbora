export default {
  app: {
    name: "Arbora",
    tagline: "Family stories",
  },

  navigation: {
    explore: "Explore",
    currentTree: "Current tree",
    dashboard: "Dashboard",
    tree: "My tree",
    people: "People",
    elements: "Tree elements",
    timeline: "Timeline",
    settings: "Settings",
    treeSettings: "Tree Settings",
    account: "My account",
    administration: "Administration",
  },

  auth: {
    welcomeBack: "Welcome back",
    heroTitle: "Reconnect with your family story.",
    heroDescription:
      "Explore your trees, enrich connections across generations, and preserve your family's memories.",
    privateAccess: "Access is limited to accounts created by an administrator.",
    loginTitle: "Sign in",
    loginDescription: "Access your Arbora space.",
    password: "Password",
    login: "Sign in",
    loggingIn: "Signing in…",
    invalidCredentials: "Incorrect email address or password.",
    loginError: "Unable to sign in right now.",
    noSignup: "Need access? Contact your administrator.",
  },

  startup: {
    retry: "Retry now",
    automaticRetry: "Another attempt will be made automatically.",
    server: {
      loadingTitle: "Starting Arbora…",
      loadingDescription:
        "Connecting to the server. This may take a moment after the containers start.",
      unavailableTitle: "The server is not available yet",
      unavailableDescription:
        "The interface remains on hold to protect your session and data.",
    },
    trees: {
      loadingTitle: "Loading your trees…",
      loadingDescription:
        "We are preparing your family space before displaying it.",
      unavailableTitle: "Unable to load your trees",
      unavailableDescription:
        "The server responded, but the data is not accessible yet.",
    },
  },

  setup: {
    firstLaunch: "First-time setup",
    heroTitle: "Your family space starts here.",
    heroDescription:
      "Create the administrator account that will manage Arbora and invite other users.",
    localSecurity: "Public registration is disabled.",
    formTitle: "Create the administrator",
    formDescription:
      "This first account will have application administration privileges.",
    confirmPassword: "Confirm password",
    passwordHint: "At least 12 characters.",
    passwordMismatch: "Passwords do not match.",
    invalidEmail: "Enter a valid email address.",
    genericError: "Unable to initialize Arbora.",
    createAdmin: "Initialize Arbora",
    creating: "Initializing…",
  },

  administration: {
    title: "Application administration",
    description:
      "Create the accounts allowed to sign in and assign their global permissions.",
    users: "Users",
    userCount: "{{count}} authorized accounts",
    loading: "Loading users…",
    loadError: "Unable to load users.",
    createUser: "New account",
    createDescription:
      "Then share these credentials directly with the relevant person.",
    email: "Email address",
    password: "Initial password",
    passwordHint: "At least 12 characters.",
    role: "Application role",
    roles: {
      ADMIN: "Administrator",
      USER: "User",
    },
    create: "Create account",
    creating: "Creating…",
    createError: "Unable to create this account.",
    emailExists: "An account already uses this email address.",
  },

  account: {
    profile: "Profile",
    trees: "My trees",
    logout: "Log out",
    email: "Email address",
    treeCount: "{{count}} trees",
    treesDescription: "Create a new tree or switch your active tree.",
    activeTree: "Active",
    noTrees: "You have not created any trees yet.",
    createTreeError: "Unable to create the tree.",
    profileUnavailable: "Profile information is unavailable.",
  },

  actions: {
    create: "Add",
    edit: "Edit",
    delete: "Delete",
    close: "Close",
    save: "Save",
    cancel: "Cancel",
  },

  tree: {
    name: "Tree name",
    create: "Create a tree",
    empty: "No trees",
  },

  graphToolbar: {
    label: "Tools",
    description: "Grow the tree",
    personHint: "Add a new person",
    relationshipHint: "Connect the selected person",
  },

  sidebar: {
    collapse: "Collapse sidebar",
    expand: "Expand sidebar",
  },

  elements: {
    title: "Tree contents",
    description: "Browse the people and relationships in the selected tree.",
    loading: "Loading elements…",
    loadError: "Unable to load the tree elements.",
    noTree: "Select a tree to display its elements.",
    persons: "People",
    relationships: "Relationships",
    noPersons: "No people in this tree.",
    noRelationships: "No relationships in this tree.",
    unknownPerson: "Unknown person",
  },

  timeline: {
    title: "Family timeline",
    description:
      "Browse births, unions, marriages, divorces, and deaths in chronological order.",
    loading: "Loading the timeline…",
    loadError: "Unable to load the timeline.",
    noTree: "Select a tree to display its timeline.",
    empty: "Add birth, relationship, or death dates to build the timeline.",
    eventCount: "{{count}} events",
    scrollHint: "Scroll horizontally",
    events: {
      birth: "Birth",
      freeUnion: "Domestic partnership",
      marriage: "Marriage",
      divorce: "Divorce",
      death: "Death",
    },
  },

  event: {
    add: "Add an event",
    edit: "Edit event",
    description: "Add a meaningful moment to this person's life.",
    editDescription: "Update this moment in this person's life.",
    deleteTitle: "Delete event",
    deleteMessage: "Are you sure you want to delete this event?",
    dateAtPlace: "{{date}} in {{place}}",
    person: "Person concerned",
    titlePlaceholder: "E.g. Moved to London",
    selectRelatedPerson: "Select the second person",
    noCoupleRelationship:
      "Create a couple relationship with this person first.",
    fields: {
      type: "Event type",
      title: "Title (optional)",
      date: "Date",
      place: "Place",
      description: "Description",
      relatedPerson: "Second person",
    },
    types: {
      BIRTH: "Birth",
      BAPTISM: "Baptism",
      EDUCATION: "Education",
      OCCUPATION: "Occupation",
      RESIDENCE: "Residence",
      FREE_UNION: "Domestic partnership",
      MARRIAGE: "Marriage",
      DIVORCE: "Divorce",
      DEATH: "Death",
      BURIAL: "Burial",
      OTHER: "Other",
    },
    errors: {
      generic: "Unable to save this event.",
      delete: "Unable to delete this event.",
    },
  },

  person: {
    add: "Add a person",
    edit: "Edit person",

    fields: {
      firstName: "Firstname",
      lastName: "Lastname",
      gender: "Gender",
      birthDate: "Birth date",
      deathDate: "Death date",
    },

    relationships: {
      parents: "Parents",
      children: "Children",
      partners: "Partners",
    },

    form: {
      createDescription: "Enter the essential information.",
      editDescription: "Update this person's information.",
      viewDescription: "Overview of this person and their relatives.",
      relationshipDescription: "Relationships recorded in this tree.",
      lifeDates: "Life dates",
    },
  },

  personDetails: {
    title: "Person details",
    open: "View full details",
    back: "Back to tree elements",
    loading: "Loading person…",
    loadError: "Unable to load this person.",
    noTree: "Select a tree to display this person.",
    notFound: "This person does not exist in the selected tree.",
    relationshipError: "Unable to add this relationship.",
    family: "Family relationships",
    familyDescription: "Navigate directly to this person's relatives.",
    noParents: "No parents provided.",
    noPartners: "No couple relationship provided.",
    noChildren: "No children provided.",
    timeline: {
      title: "Timeline",
      description: "The key events in their life, sorted by date.",
      empty: "Add dates and relationships to build this timeline.",
      events: {
        birth: "Birth",
        freeUnion: "Domestic partnership",
        marriage: "Marriage",
        divorce: "Divorce",
        childBirth: "Birth of a child",
        death: "Death",
      },
    },
  },

  gender: {
    MALE: "Man",
    FEMALE: "Woman",
    UNKNOWN: "Unknown",
  },

  relationship: {
    add: "Add a relationship",
    edit: "Edit relationship",
    description: "Connect this person to another member of the tree.",
    editDescription: "Update the person, family link, or its date.",
    selectPerson: "Select a person",
    thisPerson: "This person",
    isTheir: "is their",
    noAvailablePersons: "No other person is available in this tree.",
    summaryTitle: "Relationship to create",
    editSummaryTitle: "Updated relationship",
    summary: "{{name}} · {{relation}}",
    selectSource: "Select a person in the tree first.",
    historyTitle: "Couple history",
    historyHint: "Enter the known milestones in chronological order.",
    dateLabels: {
      FREE_UNION: "Union start date",
      MARRIAGE: "Marriage date",
      DIVORCE: "Divorce date",
    },
    errors: {
      duplicate: "This relationship already exists.",
      conflict: "These people already have an incompatible relationship.",
      cycle: "This relationship would create a parent-child cycle.",
      invalid: "This relationship is invalid.",
      invalidDate: "The relationship date is invalid.",
      dateOrder: "Dates must follow the union, marriage, then divorce order.",
      generic: "Unable to save this relationship.",
    },

    types: {
      PARENT: "Parent",
      CHILD: "Child",
      FREE_UNION: "Partner (domestic union)",
      MARRIAGE: "Spouse (marriage)",
      DIVORCE: "Former spouse (divorce)",
    },
  },

  settings: {
    appTitle: "Application preferences",
    appDescription:
      "Customize Arbora for an experience that suits your habits.",
    language: "Language",
    languageDescription: "Choose the language used throughout the interface.",
    treeDescription:
      "Manage this tree's identity, access permissions, and sensitive data.",
    treeName: "Tree Name",
    treeNameDescription:
      "This name helps you identify the tree in your workspace.",
    members: "Members",
    membersDescription: "Invite relatives and define their access level.",
    email: "Email",
    addMember: "Add Member",
    noMembers: "No members to display.",
    loadingMembers: "Loading members…",
    loadMembersError: "Unable to load members.",
    updateMemberError: "Unable to update this member.",
    removeMemberError: "Unable to remove this member.",
    dangerZone: "Danger Zone",
    deleteTreeWarning:
      "Deleting this tree will permanently remove all associated people and relationships.",
    roles: {
      owner: "Owner",
      editor: "Editor",
      viewer: "Viewer",
    },
    removeMember: "Remove member",
    unknownUser: "Unknown user",
    ownerOnly: "Only the owner can manage this tree's settings.",
    restrictedTitle: "Restricted access",
    updateTreeError: "Unable to update the tree.",
    addMemberError: "Unable to add this member.",
    deleteTreeError: "Unable to delete the tree.",
  },

  confirm: {
    deletePersonTitle: "Delete {{name}} ?",
    deletePersonMessage:
      "This action will also delete all related relationships.",
    deleteRelationshipTitle: "Delete relationship?",
    deleteRelationshipMessage: "Delete relationship with {{name}}?",
    deleteTreeTitle: "Delete Tree",
    deleteTreeMessage:
      "This action is permanent. All associated data will be deleted.",
    deleteTypeToConfirm: "Type the tree name to confirm.",
    typeToConfirm: "Type",
  },
};
