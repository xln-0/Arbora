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
