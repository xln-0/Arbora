import type { PrismaClient } from "@arbora/database";

import type { AddTreeMemberInput, UpdateTreeMemberInput } from "@arbora/shared";
import { createAppError } from "../errors/createAppError.js";

const MEMBER_ROLES = ["EDITOR", "VIEWER"] as const;

const memberUserSelect = {
  id: true,
  email: true,
};

/**
 * Retourne les membres d'un arbre.
 */
export async function getTreeMembers(prisma: PrismaClient, treeId: string) {
  return prisma.treeMember.findMany({
    where: {
      treeId,
    },

    select: {
      id: true,
      treeId: true,
      userId: true,
      role: true,

      user: {
        select: memberUserSelect,
      },
    },

    orderBy: {
      createdAt: "asc",
    },
  });
}

/**
 * Ajoute un membre à un arbre.
 */
export async function addTreeMember(
  prisma: PrismaClient,
  treeId: string,
  data: AddTreeMemberInput,
) {
  const email =
    typeof data?.email === "string" ? data.email.trim().toLowerCase() : "";

  if (!email || !email.includes("@")) {
    throw createAppError("INVALID_MEMBER_EMAIL");
  }

  if (!data || !MEMBER_ROLES.includes(data.role)) {
    throw createAppError("INVALID_TREE_ROLE");
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw createAppError("USER_NOT_FOUND");
  }

  const existingMember = await prisma.treeMember.findUnique({
    where: {
      treeId_userId: {
        treeId,
        userId: user.id,
      },
    },
  });

  if (existingMember) {
    throw createAppError("ALREADY_MEMBER");
  }

  return prisma.treeMember.create({
    data: {
      treeId,

      userId: user.id,

      role: data.role,
    },

    select: {
      id: true,
      treeId: true,
      userId: true,
      role: true,

      user: {
        select: memberUserSelect,
      },
    },
  });
}

/**
 * Modifie le rôle d'un membre.
 */
export async function updateTreeMemberRole(
  prisma: PrismaClient,
  treeId: string,
  memberId: string,
  data: UpdateTreeMemberInput,
) {
  if (!data || !MEMBER_ROLES.includes(data.role)) {
    throw createAppError("INVALID_TREE_ROLE");
  }

  const member = await prisma.treeMember.findFirst({
    where: {
      id: memberId,
      treeId,
    },
  });

  if (!member) {
    throw createAppError("MEMBER_NOT_FOUND");
  }

  if (member.role === "OWNER") {
    throw createAppError("OWNER_CANNOT_REMOVE");
  }

  return prisma.treeMember.update({
    where: {
      id: memberId,
    },

    data: {
      role: data.role,
    },

    select: {
      id: true,
      treeId: true,
      userId: true,
      role: true,

      user: {
        select: memberUserSelect,
      },
    },
  });
}

/**
 * Supprime un membre d'un arbre.
 */
export async function removeTreeMember(
  prisma: PrismaClient,
  treeId: string,
  memberId: string,
) {
  const member = await prisma.treeMember.findFirst({
    where: {
      id: memberId,
      treeId,
    },
  });

  if (!member) {
    throw createAppError("MEMBER_NOT_FOUND");
  }

  if (member.role === "OWNER") {
    throw createAppError("OWNER_CANNOT_REMOVE");
  }

  return prisma.treeMember.delete({
    where: {
      id: memberId,
    },
  });
}
