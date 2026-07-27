export default {
  app: {
    name: "Arbora",
  },

  navigation: {
    dashboard: "Dashboard",
    tree: "My tree",
    people: "People",
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
  },

  gender: {
    MALE: "Man",
    FEMALE: "Woman",
    UNKNOWN: "Unknown",
  },

  relationship: {
    add: "Add a relationship",
    selectPerson: "Select a person",

    types: {
      PARENT: "Parent",
      PARTNER: "Partner",
      CHILD: "Children",
    },
  },

  settings: {
    language: "Language",
    treeName: "Tree Name",
  },

  confirm: {
    deletePersonTitle: "Delete {{name}} ?",
    deletePersonMessage:
      "This action will also delete all related relationships.",
    deleteRelationshipTitle: "Delete relationship?",
    deleteRelationshipMessage: "Delete relationship with {{name}}?",
  },
};
