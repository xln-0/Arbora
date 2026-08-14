import type { PrismaClient } from "@arbora/database";

import {
  EVENT_TYPES,
  isCoupleRelationshipType,
  type CreateEventInput,
  type EventType,
  type UpdateEventInput,
} from "@arbora/shared";
import { createAppError } from "../errors/createAppError.js";
import { mapEvent, mapEventInput } from "../mappers/eventMapper.js";
import { mapEventDate } from "../mappers/eventMapper.js";

const EVENT_TITLE_MAX_LENGTH = 160;
const EVENT_PLACE_MAX_LENGTH = 200;
const EVENT_DESCRIPTION_MAX_LENGTH = 5_000;

interface NormalizedEventInput {
  type?: EventType;
  personId?: string;
  relationshipId?: string | null;
  title?: string | null;
  date?: string;
  place?: string | null;
  description?: string | null;
}

export async function createEvent(
  prisma: PrismaClient,
  treeId: string,
  data: CreateEventInput,
) {
  const normalized = normalizeEventInput(data, true);

  await validateEventAssociations(prisma, treeId, normalized as RequiredPick);

  const event = await prisma.$transaction(async (tx) => {
    const created = await tx.event.create({
      data: {
        treeId,
        ...mapEventInput(normalized),
        personId: normalized.personId!,
        type: normalized.type!,
        date: mapEventInput(normalized).date!,
      },
    });

    await promoteRelationshipType(
      tx,
      normalized.relationshipId,
      normalized.type!,
    );

    return created;
  });

  return mapEvent(event);
}

export async function getEventsByTree(
  prisma: PrismaClient,
  treeId: string,
) {
  const events = await prisma.event.findMany({
    where: { treeId },
    orderBy: [{ date: "asc" }, { createdAt: "asc" }],
  });

  return events.map(mapEvent);
}

export async function getEvent(
  prisma: PrismaClient,
  treeId: string,
  eventId: string,
) {
  const event = await prisma.event.findFirst({
    where: { id: eventId, treeId },
  });

  if (!event) throw createAppError("EVENT_NOT_FOUND");
  return mapEvent(event);
}

export async function updateEvent(
  prisma: PrismaClient,
  treeId: string,
  eventId: string,
  data: UpdateEventInput,
) {
  const normalized = normalizeEventInput(data, false);
  const existing = await prisma.event.findFirst({
    where: { id: eventId, treeId },
  });

  if (!existing) throw createAppError("EVENT_NOT_FOUND");

  const merged: RequiredPick = {
    type: normalized.type ?? existing.type,
    personId: normalized.personId ?? existing.personId,
    relationshipId:
      normalized.relationshipId !== undefined
        ? normalized.relationshipId
        : existing.relationshipId,
    date: normalized.date ?? existing.date.toISOString().slice(0, 10),
  };

  await validateEventAssociations(prisma, treeId, merged, eventId);

  const event = await prisma.$transaction(async (tx) => {
    const updated = await tx.event.update({
      where: { id: eventId },
      data: mapEventInput(normalized),
    });

    await promoteRelationshipType(tx, merged.relationshipId, merged.type);
    return updated;
  });

  return mapEvent(event);
}

export async function deleteEvent(
  prisma: PrismaClient,
  treeId: string,
  eventId: string,
) {
  const result = await prisma.event.deleteMany({
    where: { id: eventId, treeId },
  });

  if (result.count === 0) throw createAppError("EVENT_NOT_FOUND");
  return { success: true };
}

type RequiredPick = Pick<
  Required<NormalizedEventInput>,
  "type" | "personId" | "date"
> & { relationshipId?: string | null };

function normalizeEventInput(
  data: CreateEventInput | UpdateEventInput | undefined,
  requireCompleteInput: boolean,
): NormalizedEventInput {
  if (!data) throw createAppError("INVALID_EVENT");

  if (requireCompleteInput && (!data.type || !data.personId || !data.date)) {
    throw createAppError("INVALID_EVENT");
  }

  if (data.type !== undefined && !EVENT_TYPES.includes(data.type)) {
    throw createAppError("INVALID_EVENT_TYPE");
  }

  if (data.personId !== undefined && !data.personId) {
    throw createAppError("INVALID_EVENT_PERSON");
  }

  const normalized: NormalizedEventInput = {
    ...data,
    ...(data.title !== undefined && {
      title: normalizeText(data.title, EVENT_TITLE_MAX_LENGTH),
    }),
    ...(data.place !== undefined && {
      place: normalizeText(data.place, EVENT_PLACE_MAX_LENGTH),
    }),
    ...(data.description !== undefined && {
      description: normalizeText(
        data.description,
        EVENT_DESCRIPTION_MAX_LENGTH,
      ),
    }),
  };

  if (!requireCompleteInput && Object.keys(normalized).length === 0) {
    throw createAppError("EMPTY_UPDATE");
  }

  return normalized;
}

function normalizeText(value: unknown, maxLength: number) {
  if (value !== null && typeof value !== "string") {
    throw createAppError("INVALID_EVENT");
  }

  const normalized = value?.trim() ?? "";
  if (normalized.length > maxLength) throw createAppError("EVENT_TEXT_TOO_LONG");
  return normalized || null;
}

async function validateEventAssociations(
  prisma: PrismaClient,
  treeId: string,
  event: RequiredPick,
  excludedEventId?: string,
) {
  const person = await prisma.person.findFirst({
    where: { id: event.personId, treeId },
    select: { id: true },
  });

  if (!person) throw createAppError("INVALID_EVENT_PERSON");

  const isCoupleEvent = isCoupleRelationshipType(event.type);

  if (!isCoupleEvent && event.relationshipId) {
    throw createAppError("INVALID_EVENT_RELATIONSHIP");
  }

  if (!isCoupleEvent) {
    if (event.type === "BIRTH" || event.type === "DEATH") {
      await validateLifeEvent(prisma, treeId, event, excludedEventId);
    }
    return;
  }
  if (!event.relationshipId) throw createAppError("EVENT_RELATIONSHIP_REQUIRED");

  const relationship = await prisma.relationship.findFirst({
    where: {
      id: event.relationshipId,
      treeId,
      type: { in: ["FREE_UNION", "MARRIAGE", "DIVORCE"] },
      OR: [
        { sourcePersonId: event.personId },
        { targetPersonId: event.personId },
      ],
    },
    select: { id: true },
  });

  if (!relationship) throw createAppError("INVALID_EVENT_RELATIONSHIP");

  await validateCoupleEvent(prisma, treeId, event, excludedEventId);
}

async function validateLifeEvent(
  prisma: PrismaClient,
  treeId: string,
  event: RequiredPick,
  excludedEventId?: string,
) {
  const existingEvents = await prisma.event.findMany({
    where: {
      treeId,
      personId: event.personId,
      relationshipId: null,
      type: { in: ["BIRTH", "DEATH"] },
      ...(excludedEventId && { id: { not: excludedEventId } }),
    },
    select: { type: true, date: true },
  });

  if (existingEvents.some(({ type }) => type === event.type)) {
    throw createAppError("DUPLICATE_EVENT");
  }

  const date = mapEventDate(event.date);
  const birthDate =
    event.type === "BIRTH"
      ? date
      : existingEvents.find(({ type }) => type === "BIRTH")?.date;
  const deathDate =
    event.type === "DEATH"
      ? date
      : existingEvents.find(({ type }) => type === "DEATH")?.date;
  const today = new Date();
  today.setUTCHours(23, 59, 59, 999);

  if (birthDate && birthDate > today) {
    throw createAppError("BIRTH_DATE_IN_FUTURE");
  }

  if (birthDate && deathDate && deathDate < birthDate) {
    throw createAppError("DEATH_BEFORE_BIRTH");
  }
}

async function validateCoupleEvent(
  prisma: PrismaClient,
  treeId: string,
  event: RequiredPick,
  excludedEventId?: string,
) {
  const existingEvents = await prisma.event.findMany({
    where: {
      treeId,
      relationshipId: event.relationshipId!,
      type: { in: ["FREE_UNION", "MARRIAGE", "DIVORCE"] },
      ...(excludedEventId && { id: { not: excludedEventId } }),
    },
    select: { type: true, date: true },
  });

  if (existingEvents.some(({ type }) => type === event.type)) {
    throw createAppError("DUPLICATE_EVENT");
  }

  const dates = new Map(existingEvents.map(({ type, date }) => [type, date]));
  dates.set(event.type, mapEventDate(event.date));
  const milestones = (["FREE_UNION", "MARRIAGE", "DIVORCE"] as const)
    .map((type) => dates.get(type))
    .filter((date): date is Date => Boolean(date));

  for (let index = 1; index < milestones.length; index += 1) {
    if (milestones[index] < milestones[index - 1]) {
      throw createAppError("INVALID_RELATIONSHIP_DATE_ORDER");
    }
  }
}

async function promoteRelationshipType(
  prisma: Pick<PrismaClient, "relationship">,
  relationshipId: string | null | undefined,
  eventType: EventType,
) {
  if (!relationshipId || !isCoupleRelationshipType(eventType)) return;

  const rank = { FREE_UNION: 1, MARRIAGE: 2, DIVORCE: 3 } as const;
  const relationship = await prisma.relationship.findUnique({
    where: { id: relationshipId },
    select: { type: true },
  });

  if (
    relationship &&
    isCoupleRelationshipType(relationship.type) &&
    rank[eventType] > rank[relationship.type]
  ) {
    await prisma.relationship.update({
      where: { id: relationshipId },
      data: { type: eventType },
    });
  }
}
