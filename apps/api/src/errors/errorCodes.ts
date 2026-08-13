export const ERROR_CODES = {
  /**
   * Auth / User
   */
  USER_NOT_FOUND: {
    statusCode: 404,
    message: "User not found",
  },

  FORBIDDEN: {
    statusCode: 403,
    message: "Forbidden",
  },

  /**
   * Trees
   */
  TREE_NOT_FOUND: {
    statusCode: 404,
    message: "Tree not found",
  },

  TREE_NAME_REQUIRED: {
    statusCode: 400,
    message: "Tree name is required",
  },

  TREE_NAME_TOO_LONG: {
    statusCode: 400,
    message: "Tree name is too long",
  },

  /**
   * Tree Members
   */
  MEMBER_NOT_FOUND: {
    statusCode: 404,
    message: "Member not found",
  },

  ALREADY_MEMBER: {
    statusCode: 409,
    message: "User is already a member",
  },

  OWNER_CANNOT_REMOVE: {
    statusCode: 400,
    message: "Owner cannot be removed",
  },

  INVALID_MEMBER_EMAIL: {
    statusCode: 400,
    message: "A valid member email is required",
  },

  INVALID_TREE_ROLE: {
    statusCode: 400,
    message: "Invalid tree role",
  },

  /**
   * Persons
   */
  PERSON_NOT_FOUND: {
    statusCode: 404,
    message: "Person not found",
  },

  PERSON_FIRST_NAME_REQUIRED: {
    statusCode: 400,
    message: "First name is required",
  },

  PERSON_FIRST_NAME_TOO_LONG: {
    statusCode: 400,
    message: "First name is too long",
  },

  PERSON_LAST_NAME_TOO_LONG: {
    statusCode: 400,
    message: "Last name is too long",
  },

  INVALID_GENDER: {
    statusCode: 400,
    message: "Invalid gender",
  },

  INVALID_BIRTH_DATE: {
    statusCode: 400,
    message: "Invalid birth date",
  },

  INVALID_DEATH_DATE: {
    statusCode: 400,
    message: "Invalid death date",
  },

  BIRTH_DATE_IN_FUTURE: {
    statusCode: 400,
    message: "Birth date cannot be in the future",
  },

  DEATH_BEFORE_BIRTH: {
    statusCode: 400,
    message: "Death date cannot be before birth date",
  },

  INVALID_POSITION: {
    statusCode: 400,
    message: "Invalid position",
  },

  /**
   * Generic validation
   */
  EMPTY_UPDATE: {
    statusCode: 400,
    message: "No fields to update",
  },

  /**
   * Relationships
   */
  RELATIONSHIP_NOT_FOUND: {
    statusCode: 404,
    message: "Relationship not found",
  },

  INVALID_RELATIONSHIP: {
    statusCode: 400,
    message: "Invalid relationship",
  },

  INVALID_RELATIONSHIP_DATE: {
    statusCode: 400,
    message: "Invalid relationship date",
  },

  INVALID_RELATIONSHIP_DATE_ORDER: {
    statusCode: 400,
    message: "Relationship dates are not in chronological order",
  },

  DUPLICATE_RELATIONSHIP: {
    statusCode: 409,
    message: "This relationship already exists",
  },

  RELATIONSHIP_CONFLICT: {
    statusCode: 409,
    message: "These people already have an incompatible relationship",
  },

  RELATIONSHIP_CYCLE: {
    statusCode: 409,
    message: "This parent relationship would create a cycle",
  },

  SELF_RELATIONSHIP: {
    statusCode: 400,
    message: "A person cannot be related to itself",
  },
} as const;
