import type { PrismaClient } from "@arbora/database";

import {
  RELATIONSHIP_TYPES,
  type CreateRelationshipInput,
} from "@arbora/shared";
import { createAppError } from "../errors/createAppError.js";
import {
  mapRelationship,
  mapRelationshipDate,
} from "../mappers/relationshipMapper.js";

/**
 * Crée une relation entre deux personnes.
 */
export async function createRelationship(
  prisma: PrismaClient,
  treeId: string,
  data: CreateRelationshipInput,
) {
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

  const persons = await prisma.person.findMany({
    where: {
      id: {
        in: [data.sourcePersonId, data.targetPersonId],
      },

      treeId,
    },

    select: {
      id: true,
    },
  });

  if (persons.length !== 2) {
    throw createAppError("INVALID_RELATIONSHIP");
  }

  const isChildRelationship = data.type === "CHILD";

  const relationship = await prisma.relationship.create({
    data: {
      treeId,
      date: mapRelationshipDate(data),

      // CHILD is an input convenience. Relationships are stored canonically
      // as parent -> child so the graph only has one direction to handle.
      sourcePersonId: isChildRelationship
        ? data.targetPersonId
        : data.sourcePersonId,

      targetPersonId: isChildRelationship
        ? data.sourcePersonId
        : data.targetPersonId,

      type: data.type === "PARTNER" ? "PARTNER" : "PARENT",
    },
  });

  return mapRelationship(relationship);
}

/**
 * Retourne toutes les relations d'un arbre.
 */
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

/**
 * Supprime une relation d'un arbre.
 */
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
