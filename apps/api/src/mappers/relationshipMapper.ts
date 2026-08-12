import type { Prisma } from "@prisma/client";

import { createAppError } from "../errors/createAppError.js";

type RelationshipEntity = Prisma.RelationshipGetPayload<{}>;

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export function mapRelationship(relationship: RelationshipEntity) {
  return {
    id: relationship.id,
    treeId: relationship.treeId,
    type: relationship.type,
    date: relationship.date?.toISOString().slice(0, 10) ?? null,
    sourcePersonId: relationship.sourcePersonId,
    targetPersonId: relationship.targetPersonId,
  };
}

export function mapRelationshipDate(data: { date?: string }) {
  if (data.date === undefined || data.date === "") {
    return undefined;
  }

  if (!ISO_DATE_REGEX.test(data.date)) {
    throw createAppError("INVALID_RELATIONSHIP_DATE");
  }

  const date = new Date(`${data.date}T00:00:00.000Z`);

  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== data.date
  ) {
    throw createAppError("INVALID_RELATIONSHIP_DATE");
  }

  return date;
}
