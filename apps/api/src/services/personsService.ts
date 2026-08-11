import type { PrismaClient } from "@arbora/database";
import {
  GENDERS,
  type CreatePersonInput,
  type UpdatePersonInput,
} from "@arbora/shared";
import { createAppError } from "../errors/createAppError.js";
import { mapPerson, mapPersonInput } from "../mappers/personMapper.js";

const PERSON_NAME_MAX_LENGTH = 100;

function normalizePersonNames(data: CreatePersonInput | UpdatePersonInput) {
  if (
    (data.firstName !== undefined && typeof data.firstName !== "string") ||
    (data.lastName !== undefined &&
      data.lastName !== null &&
      typeof data.lastName !== "string")
  ) {
    throw createAppError("PERSON_FIRST_NAME_REQUIRED");
  }

  const firstName = data.firstName?.trim();
  const lastName = data.lastName?.trim();

  if (data.firstName !== undefined && !firstName) {
    throw createAppError("PERSON_FIRST_NAME_REQUIRED");
  }

  if (firstName && firstName.length > PERSON_NAME_MAX_LENGTH) {
    throw createAppError("PERSON_FIRST_NAME_TOO_LONG");
  }

  if (lastName && lastName.length > PERSON_NAME_MAX_LENGTH) {
    throw createAppError("PERSON_LAST_NAME_TOO_LONG");
  }

  return {
    ...data,
    ...(data.firstName !== undefined && { firstName }),
    ...(data.lastName !== undefined && { lastName: lastName || null }),
  };
}

function validatePersonDates(
  birthDate: Date | null | undefined,
  deathDate: Date | null | undefined,
) {
  const today = new Date();
  today.setUTCHours(23, 59, 59, 999);

  if (birthDate && birthDate > today) {
    throw createAppError("BIRTH_DATE_IN_FUTURE");
  }

  if (birthDate && deathDate && deathDate < birthDate) {
    throw createAppError("DEATH_BEFORE_BIRTH");
  }
}

/**
 * Création d'une personne
 */
export async function createPerson(
  prisma: PrismaClient,
  treeId: string,
  data: CreatePersonInput,
) {
  if (!data?.firstName?.trim()) {
    throw createAppError("PERSON_FIRST_NAME_REQUIRED");
  }

  const normalizedData = normalizePersonNames(data);

  if (
    normalizedData.gender !== undefined &&
    !GENDERS.includes(normalizedData.gender)
  ) {
    throw createAppError("INVALID_GENDER");
  }

  const personData = mapPersonInput(normalizedData);

  validatePersonDates(personData.birthDate, personData.deathDate);

  const tree = await prisma.familyTree.findUnique({
    where: {
      id: treeId,
    },

    select: {
      id: true,
    },
  });

  if (!tree) {
    throw createAppError("TREE_NOT_FOUND");
  }

  const person = await prisma.person.create({
    data: {
      treeId,
      ...personData,
      firstName: normalizedData.firstName!,
    },
  });

  return mapPerson(person);
}

/**
 * Liste les personnes d'un arbre
 */
export async function getPersonsByTree(prisma: PrismaClient, treeId: string) {
  const persons = await prisma.person.findMany({
    where: {
      treeId,
    },

    orderBy: {
      createdAt: "asc",
    },
  });

  return persons.map(mapPerson);
}

/**
 * Retourne une personne
 */
export async function getPerson(
  prisma: PrismaClient,
  treeId: string,
  id: string,
) {
  const person = await prisma.person.findFirst({
    where: {
      id,
      treeId,
    },
  });

  if (!person) {
    throw createAppError("PERSON_NOT_FOUND");
  }

  return mapPerson(person);
}

/**
 * Modification d'une personne
 */
export async function updatePerson(
  prisma: PrismaClient,
  treeId: string,
  id: string,
  data: UpdatePersonInput,
) {
  if (!data) {
    throw createAppError("EMPTY_UPDATE");
  }

  const normalizedData = normalizePersonNames(data);

  if (
    normalizedData.gender !== undefined &&
    !GENDERS.includes(normalizedData.gender)
  ) {
    throw createAppError("INVALID_GENDER");
  }

  const updateData = mapPersonInput(normalizedData);

  if (Object.keys(updateData).length === 0) {
    throw createAppError("EMPTY_UPDATE");
  }

  const person = await prisma.person.findFirst({
    where: {
      id,
      treeId,
    },
  });

  if (!person) {
    throw createAppError("PERSON_NOT_FOUND");
  }

  validatePersonDates(
    updateData.birthDate !== undefined
      ? updateData.birthDate
      : person.birthDate,
    updateData.deathDate !== undefined
      ? updateData.deathDate
      : person.deathDate,
  );

  const updatedPerson = await prisma.person.update({
    where: {
      id,
    },
    data: updateData,
  });

  return mapPerson(updatedPerson);
}

/**
 * Suppression d'une personne
 */
export async function deletePerson(
  prisma: PrismaClient,
  treeId: string,
  id: string,
) {
  const result = await prisma.person.deleteMany({
    where: {
      id,
      treeId,
    },
  });

  if (result.count === 0) {
    throw createAppError("PERSON_NOT_FOUND");
  }

  return {
    success: true,
  };
}

/**
 * Mise à jour de la position React Flow
 */
export async function updatePersonPosition(
  prisma: PrismaClient,
  treeId: string,
  id: string,
  position: {
    x: number;
    y: number;
  },
) {
  if (
    !position ||
    !Number.isFinite(position.x) ||
    !Number.isFinite(position.y)
  ) {
    throw createAppError("INVALID_POSITION");
  }
  const result = await prisma.person.updateMany({
    where: {
      id,
      treeId,
    },
    data: {
      positionX: position.x,
      positionY: position.y,
    },
  });

  if (result.count === 0) {
    throw createAppError("PERSON_NOT_FOUND");
  }

  return {
    success: true,
  };
}
