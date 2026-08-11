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
  },

  account: {
    profile: "Profile",
    trees: "My trees",
    logout: "Log out",
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
      "Browse births and deaths in the tree in chronological order.",
    loading: "Loading the timeline…",
    loadError: "Unable to load the timeline.",
    noTree: "Select a tree to display its timeline.",
    empty: "Add birth or death dates to build the timeline.",
    eventCount: "{{count}} events",
    scrollHint: "Scroll horizontally",
    events: {
      birth: "Birth",
      death: "Death",
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
    noPartners: "No partner provided.",
    noChildren: "No children provided.",
    timeline: {
      title: "Timeline",
      description: "The key events in their life, sorted by date.",
      empty: "Add dates and relationships to build this timeline.",
      events: {
        birth: "Birth",
        union: "Marriage or union",
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
    description: "Connect this person to another member of the tree.",
    selectPerson: "Select a person",
    thisPerson: "This person",
    isTheir: "is their",
    noAvailablePersons: "No other person is available in this tree.",
    summaryTitle: "Relationship to create",
    summary: "{{name}} · {{relation}}",
    selectSource: "Select a person in the tree first.",
    unionDate: "Marriage or union date",
    unionDateHint: "Optional, it will appear in the timeline.",

    types: {
      PARENT: "Parent",
      PARTNER: "Partner",
      CHILD: "Child",
    },
  },

  settings: {
    language: "Language",
    treeName: "Tree Name",
    members: "Members",
    email: "Email",
    addMember: "Add Member",
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
