import type { Prisma } from "@prisma/client";

import { createAppError } from "../errors/createAppError.js";

type RelationshipEntity = Prisma.RelationshipGetPayload<{}>;

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export function mapRelationship(relationship: RelationshipEntity) {
  return {
    id: relationship.id,
    treeId: relationship.treeId,
    type: relationship.type,
    unionDate: relationship.unionDate?.toISOString().slice(0, 10) ?? null,
    marriageDate:
      relationship.marriageDate?.toISOString().slice(0, 10) ?? null,
    divorceDate: relationship.divorceDate?.toISOString().slice(0, 10) ?? null,
    sourcePersonId: relationship.sourcePersonId,
    targetPersonId: relationship.targetPersonId,
  };
}

export function mapRelationshipDate(value?: string) {
  if (value === undefined || value === "") {
    return undefined;
  }

  if (!ISO_DATE_REGEX.test(value)) {
    throw createAppError("INVALID_RELATIONSHIP_DATE");
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    throw createAppError("INVALID_RELATIONSHIP_DATE");
  }

  return date;
}
