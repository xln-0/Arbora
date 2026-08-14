import type { Prisma } from "@prisma/client";

import type { CreatePersonInput, UpdatePersonInput } from "@arbora/shared";

import { createAppError } from "../errors/createAppError.js";

type PersonEntity = Prisma.PersonGetPayload<{}> & {
  events?: Array<{ type: string; date: Date }>;
};

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

type DateErrorCode = "INVALID_BIRTH_DATE" | "INVALID_DEATH_DATE";

/**
 * Transforme une entité Prisma Person
 * en DTO exposé par l'API.
 */
export function mapPerson(person: PersonEntity) {
  const birthDate = person.events?.find((event) => event.type === "BIRTH")?.date;
  const deathDate = person.events?.find((event) => event.type === "DEATH")?.date;

  return {
    id: person.id,
    treeId: person.treeId,
    firstName: person.firstName,
    lastName: person.lastName,
    gender: person.gender,

    birthDate: formatDate(birthDate ?? null),
    deathDate: formatDate(deathDate ?? null),

    positionX: person.positionX,
    positionY: person.positionY,
  };
}

function formatDate(date: Date | null) {
  return date?.toISOString().slice(0, 10) ?? null;
}

/**
 * Convertit une date YYYY-MM-DD en Date Prisma.
 */
function parseDate(value: string | undefined, errorCode: DateErrorCode) {
  if (value === undefined) {
    return undefined;
  }

  if (value === "") {
    return null;
  }

  if (!ISO_DATE_REGEX.test(value)) {
    throw createAppError(errorCode);
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  // Vérifie que la date existe réellement
  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    throw createAppError(errorCode);
  }

  return date;
}

/**
 * Transforme un input API en payload Prisma.
 */
export function mapPersonInput(data: CreatePersonInput | UpdatePersonInput) {
  return {
    ...(data.firstName !== undefined && {
      firstName: data.firstName,
    }),

    ...(data.lastName !== undefined && {
      lastName: data.lastName,
    }),

    ...(data.gender !== undefined && {
      gender: data.gender,
    }),

  };
}

export function mapPersonLifeDates(data: CreatePersonInput | UpdatePersonInput) {
  return {
    birthDate: parseDate(data.birthDate, "INVALID_BIRTH_DATE"),
    deathDate: parseDate(data.deathDate, "INVALID_DEATH_DATE"),
  };
}
