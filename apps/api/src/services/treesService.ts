import type { PrismaClient } from "@arbora/database";
import type { Prisma } from "@prisma/client";

const treeWithRelations = {
  include: {
    persons: true,
    relationships: true,
  },
} satisfies Prisma.FamilyTreeDefaultArgs;

type TreeWithRelations = Prisma.FamilyTreeGetPayload<typeof treeWithRelations>;

export async function createTree(
  prisma: PrismaClient,
  data: {
    name: string;
    ownerId: string;
  },
) {
  return prisma.familyTree.create({
    data: {
      name: data.name,
      ownerId: data.ownerId,
    },
  });
}

export async function getTree(prisma: PrismaClient, id: string) {
  const tree: TreeWithRelations | null = await prisma.familyTree.findUnique({
    where: {
      id,
    },

    ...treeWithRelations,
  });

  if (!tree) {
    throw new Error("Tree not found");
  }

  return {
    id: tree.id,
    name: tree.name,

    persons: tree.persons.map((person) => ({
      id: person.id,
      firstName: person.firstName,
      lastName: person.lastName,
      gender: person.gender,
    })),

    relationships: tree.relationships.map((rel) => ({
      id: rel.id,
      type: rel.type,
      source: rel.sourcePersonId,
      target: rel.targetPersonId,
    })),
  };
}

export async function updateTree(
  prisma: PrismaClient,
  id: string,
  data: {
    name: string;
  },
) {
  return prisma.familyTree.update({
    where: { id },
    data,
  });
}

export async function deleteTree(prisma: PrismaClient, id: string) {
  return prisma.familyTree.delete({
    where: { id },
  });
}
