import type { PrismaClient } from "@arbora/database";

import {
  isCoupleRelationshipType,
  RELATIONSHIP_TYPES,
  type CoupleRelationshipType,
  type CreateRelationshipInput,
  type UpdateRelationshipInput,
} from "@arbora/shared";
import { createAppError } from "../errors/createAppError.js";
import {
  mapRelationship,
  mapRelationshipDate,
} from "../mappers/relationshipMapper.js";

interface CanonicalRelationshipInput {
  sourcePersonId: string;
  targetPersonId: string;
  type: "PARENT" | CoupleRelationshipType;
  unionDate?: Date;
  marriageDate?: Date;
  divorceDate?: Date;
}

export async function createRelationship(
  prisma: PrismaClient,
  treeId: string,
  data: CreateRelationshipInput,
) {
  const normalized = normalizeRelationshipInput(data);

  await validateRelationship(prisma, treeId, normalized);

  const relationship = await prisma.relationship.create({
    data: {
      treeId,
      ...normalized,
    },
  });

  return mapRelationship(relationship);
}

export async function updateRelationship(
  prisma: PrismaClient,
  treeId: string,
  relationshipId: string,
  data: UpdateRelationshipInput,
) {
  const currentRelationship = await prisma.relationship.findFirst({
    where: {
      id: relationshipId,
      treeId,
    },
  });

  if (!currentRelationship) {
    throw createAppError("RELATIONSHIP_NOT_FOUND");
  }

  const normalized = normalizeRelationshipInput(data);

  await validateRelationship(prisma, treeId, normalized, relationshipId);

  const relationship = await prisma.relationship.update({
    where: {
      id: relationshipId,
    },
    data: {
      ...normalized,
      // Omitted milestones are explicitly cleared during a full replacement.
      unionDate: normalized.unionDate ?? null,
      marriageDate: normalized.marriageDate ?? null,
      divorceDate: normalized.divorceDate ?? null,
    },
  });

  return mapRelationship(relationship);
}

export async function getRelationshipsByTree(
  prisma: PrismaClient,
  treeId: string,
) {
  const relationships = await prisma.relationship.findMany({
    where: {
      treeId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return relationships.map(mapRelationship);
}

export async function deleteRelationship(
  prisma: PrismaClient,
  treeId: string,
  relationshipId: string,
) {
  const result = await prisma.relationship.deleteMany({
    where: {
      id: relationshipId,
      treeId,
    },
  });

  if (result.count === 0) {
    throw createAppError("RELATIONSHIP_NOT_FOUND");
  }

  return { success: true };
}

function normalizeRelationshipInput(
  data: CreateRelationshipInput | UpdateRelationshipInput,
): CanonicalRelationshipInput {
  if (
    !data ||
    !data.sourcePersonId ||
    !data.targetPersonId ||
    !RELATIONSHIP_TYPES.includes(data.type)
  ) {
    throw createAppError("INVALID_RELATIONSHIP");
  }

  if (data.sourcePersonId === data.targetPersonId) {
    throw createAppError("SELF_RELATIONSHIP");
  }

  const isChildRelationship = data.type === "CHILD";
  const type = isCoupleRelationshipType(data.type) ? data.type : "PARENT";
  const unionDate = isCoupleRelationshipType(type)
    ? mapRelationshipDate(data.unionDate)
    : undefined;
  const marriageDate =
    type === "MARRIAGE" || type === "DIVORCE"
      ? mapRelationshipDate(data.marriageDate)
      : undefined;
  const divorceDate =
    type === "DIVORCE"
      ? mapRelationshipDate(data.divorceDate)
      : undefined;

  validateRelationshipDateOrder([unionDate, marriageDate, divorceDate]);

  return {
    sourcePersonId: isChildRelationship
      ? data.targetPersonId
      : data.sourcePersonId,
    targetPersonId: isChildRelationship
      ? data.sourcePersonId
      : data.targetPersonId,
    type,
    ...(unionDate ? { unionDate } : {}),
    ...(marriageDate ? { marriageDate } : {}),
    ...(divorceDate ? { divorceDate } : {}),
  };
}

function validateRelationshipDateOrder(dates: Array<Date | undefined>) {
  const knownDates = dates.filter((date): date is Date => date !== undefined);

  for (let index = 1; index < knownDates.length; index += 1) {
    if (knownDates[index].getTime() < knownDates[index - 1].getTime()) {
      throw createAppError("INVALID_RELATIONSHIP_DATE_ORDER");
    }
  }
}

async function validateRelationship(
  prisma: PrismaClient,
  treeId: string,
  data: CanonicalRelationshipInput,
  excludedRelationshipId?: string,
) {
  const [persons, relationships] = await Promise.all([
    prisma.person.findMany({
      where: {
        id: {
          in: [data.sourcePersonId, data.targetPersonId],
        },
        treeId,
      },
      select: {
        id: true,
      },
    }),
    prisma.relationship.findMany({
      where: {
        treeId,
        ...(excludedRelationshipId && {
          id: {
            not: excludedRelationshipId,
          },
        }),
      },
      select: {
        id: true,
        type: true,
        sourcePersonId: true,
        targetPersonId: true,
      },
    }),
  ]);

  if (persons.length !== 2) {
    throw createAppError("INVALID_RELATIONSHIP");
  }

  for (const relationship of relationships) {
    const sameDirection =
      relationship.sourcePersonId === data.sourcePersonId &&
      relationship.targetPersonId === data.targetPersonId;
    const reverseDirection =
      relationship.sourcePersonId === data.targetPersonId &&
      relationship.targetPersonId === data.sourcePersonId;

    if (!sameDirection && !reverseDirection) {
      continue;
    }

    const isDuplicate =
      relationship.type === data.type &&
      (isCoupleRelationshipType(data.type) || sameDirection);

    if (isDuplicate) {
      throw createAppError("DUPLICATE_RELATIONSHIP");
    }

    throw createAppError("RELATIONSHIP_CONFLICT");
  }

  if (
    data.type === "PARENT" &&
    createsParentCycle(
      relationships.filter((relationship) => relationship.type === "PARENT"),
      data.sourcePersonId,
      data.targetPersonId,
    )
  ) {
    throw createAppError("RELATIONSHIP_CYCLE");
  }
}

function createsParentCycle(
  relationships: Array<{
    sourcePersonId: string;
    targetPersonId: string;
  }>,
  parentId: string,
  childId: string,
) {
  const childrenByParent = new Map<string, string[]>();

  for (const relationship of relationships) {
    const children = childrenByParent.get(relationship.sourcePersonId) ?? [];
    children.push(relationship.targetPersonId);
    childrenByParent.set(relationship.sourcePersonId, children);
  }

  const pending = [childId];
  const visited = new Set<string>();

  while (pending.length > 0) {
    const currentPersonId = pending.pop()!;

    if (currentPersonId === parentId) {
      return true;
    }

    if (visited.has(currentPersonId)) {
      continue;
    }

    visited.add(currentPersonId);
    pending.push(...(childrenByParent.get(currentPersonId) ?? []));
  }

  return false;
}
