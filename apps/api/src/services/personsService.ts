import type { PrismaClient } from "@arbora/database";
import { Gender } from "@arbora/shared";

type CreatePersonInput = {
  firstName: string;
  lastName?: string;
  gender?: Gender;
  birthDate?: Date;
  deathDate?: Date;
};

function mapPersonInput(data: CreatePersonInput) {
  return {
    ...data,
    birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
    deathDate: data.deathDate ? new Date(data.deathDate) : undefined,
  };
}

export async function createPerson(
  prisma: PrismaClient,
  treeId: string,
  data: CreatePersonInput,
) {
  return prisma.person.create({
    data: {
      treeId,
      ...mapPersonInput(data),
    },
  });
}

export async function getPersonsByTree(prisma: PrismaClient, treeId: string) {
  return prisma.person.findMany({
    where: { treeId },
    orderBy: {
      createdAt: "asc",
    },
  });
}

export async function getPerson(prisma: PrismaClient, id: string) {
  return prisma.person.findUnique({
    where: { id },
  });
}

export async function updatePerson(
  prisma: PrismaClient,
  id: string,
  data: CreatePersonInput,
) {
  return prisma.person.update({
    where: { id },
    data: mapPersonInput(data),
  });
}

export async function deletePerson(prisma: PrismaClient, id: string) {
  return prisma.person.delete({
    where: { id },
  });
}
