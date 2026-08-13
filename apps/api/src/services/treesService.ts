import type { PrismaClient } from "@arbora/database";

import type { CreateTreeInput, UpdateTreeInput } from "@arbora/shared";
import { createAppError } from "../errors/createAppError.js";
import { mapPerson } from "../mappers/personMapper.js";
import { mapRelationship } from "../mappers/relationshipMapper.js";

const TREE_NAME_MAX_LENGTH = 120;

function normalizeTreeName(name: unknown) {
  const normalizedName = typeof name === "string" ? name.trim() : "";

  if (!normalizedName) {
    throw createAppError("TREE_NAME_REQUIRED");
  }

  if (normalizedName.length > TREE_NAME_MAX_LENGTH) {
    throw createAppError("TREE_NAME_TOO_LONG");
  }

  return normalizedName;
}

function mapTreeSummary<T extends {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
}>(tree: T, role: "OWNER" | "EDITOR" | "VIEWER") {
  return {
    id: tree.id,
    name: tree.name,
    ownerId: tree.ownerId,
    createdAt: tree.createdAt.toISOString(),
    role,
  };
}

/**
 * Crée un arbre généalogique.
 * Le créateur est automatiquement ajouté comme OWNER.
 */
export async function createTree(
  prisma: PrismaClient,
  ownerId: string,
  data: CreateTreeInput,
) {
  const name = normalizeTreeName(data?.name);

  return prisma.$transaction(async (tx) => {
    const tree = await tx.familyTree.create({
      data: {
        name,
        ownerId,
      },
    });

    await tx.treeMember.create({
      data: {
        treeId: tree.id,
        userId: ownerId,
        role: "OWNER",
      },
    });

    return mapTreeSummary(tree, "OWNER");
  });
}

/**
 * Retourne tous les arbres accessibles à un utilisateur.
 */
export async function getTreesByUser(prisma: PrismaClient, userId: string) {
  const trees = await prisma.familyTree.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },

    include: {
      members: {
        where: {
          userId,
        },
        select: {
          role: true,
        },
      },
    },

    orderBy: {
      name: "asc",
    },
  });

  return trees.map((tree) => mapTreeSummary(tree, tree.members[0].role));
}

/**
 * Retourne un arbre avec son graphe.
 */
export async function getTree(
  prisma: PrismaClient,
  treeId: string,
  userId: string,
) {
  const tree = await prisma.familyTree.findFirst({
    where: {
      id: treeId,
      OR: [
        { ownerId: userId },
        {
          members: {
            some: { userId },
          },
        },
      ],
    },
    include: {
      persons: true,
      relationships: true,
      members: {
        where: { userId },
        select: { role: true },
      },
    },
  });

  if (!tree) {
    throw createAppError("FORBIDDEN");
  }

  const role = tree.ownerId === userId ? "OWNER" : tree.members[0]?.role;

  if (!role) {
    throw createAppError("FORBIDDEN");
  }

  return {
    ...mapTreeSummary(tree, role),
    persons: tree.persons.map(mapPerson),
    relationships: tree.relationships.map(mapRelationship),
  };
}

/**
 * Modifie un arbre.
 */
export async function updateTree(
  prisma: PrismaClient,
  treeId: string,
  data: UpdateTreeInput,
) {
  const name = normalizeTreeName(data?.name);

  const tree = await prisma.familyTree.update({
    where: {
      id: treeId,
    },

    data: {
      name,
    },
  });

  return mapTreeSummary(tree, "OWNER");
}

/**
 * Supprime un arbre.
 */
export async function deleteTree(prisma: PrismaClient, treeId: string) {
  return prisma.familyTree.delete({
    where: {
      id: treeId,
    },
  });
}
