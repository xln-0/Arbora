import type { PrismaClient } from "@arbora/database";
import { RelationshipType } from "@arbora/shared";

type CreateRelationshipInput = {
  sourcePersonId: string;
  targetPersonId: string;
  type: RelationshipType;
};

export async function createRelationship(
  prisma: PrismaClient,
  treeId: string,
  data: CreateRelationshipInput,
) {
  const persons = await prisma.person.findMany({
    where: {
      id: {
        in: [data.sourcePersonId, data.targetPersonId],
      },
      treeId,
    },
  });

  if (persons.length !== 2) {
    throw new Error("Persons do not belong to this tree");
  }

  let sourcePersonId = data.sourcePersonId;
  let targetPersonId = data.targetPersonId;
  let type = data.type;

  if (data.type === "PARENT") {
    sourcePersonId = data.targetPersonId;
    targetPersonId = data.sourcePersonId;
  }

  if (data.type === "CHILD") {
    type = "PARENT";
  }

  return prisma.relationship.create({
    data: {
      treeId,
      sourcePersonId: sourcePersonId,
      targetPersonId: targetPersonId,
      type: type,
    },
  });
}

export async function getRelationshipsByTree(
  prisma: PrismaClient,
  treeId: string,
) {
  return prisma.relationship.findMany({
    where: {
      treeId,
    },

    include: {
      sourcePerson: true,

      targetPerson: true,
    },
  });
}

export async function deleteRelationship(prisma: PrismaClient, id: string) {
  return prisma.relationship.delete({
    where: {
      id,
    },
  });
}
