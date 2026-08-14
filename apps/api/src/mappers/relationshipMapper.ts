import type { Prisma } from "@prisma/client";

import { createAppError } from "../errors/createAppError.js";

type RelationshipEntity = Prisma.RelationshipGetPayload<{}> & {
  events?: Array<{ type: string; date: Date }>;
};

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export function mapRelationship(relationship: RelationshipEntity) {
  const eventDate = (type: string) =>
    relationship.events
      ?.find((event) => event.type === type)
      ?.date.toISOString()
      .slice(0, 10) ?? null;

  return {
    id: relationship.id,
    treeId: relationship.treeId,
    type: relationship.type,
    unionDate: eventDate("FREE_UNION"),
    marriageDate: eventDate("MARRIAGE"),
    divorceDate: eventDate("DIVORCE"),
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
