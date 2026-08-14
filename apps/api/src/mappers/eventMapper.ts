import type { Prisma } from "@prisma/client";

import type { EventType } from "@arbora/shared";
import { createAppError } from "../errors/createAppError.js";

type EventEntity = Prisma.EventGetPayload<{}>;

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export function mapEvent(event: EventEntity) {
  return {
    id: event.id,
    treeId: event.treeId,
    personId: event.personId,
    relationshipId: event.relationshipId,
    type: event.type,
    title: event.title,
    date: event.date.toISOString().slice(0, 10),
    place: event.place,
    description: event.description,
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString(),
  };
}

export function mapEventDate(value: unknown) {
  if (typeof value !== "string" || !ISO_DATE_REGEX.test(value)) {
    throw createAppError("INVALID_EVENT_DATE");
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    throw createAppError("INVALID_EVENT_DATE");
  }

  return date;
}

export function mapEventInput(data: {
  type?: EventType;
  personId?: string;
  relationshipId?: string | null;
  title?: string | null;
  date?: string;
  place?: string | null;
  description?: string | null;
}) {
  return {
    ...(data.type !== undefined && { type: data.type }),
    ...(data.personId !== undefined && { personId: data.personId }),
    ...(data.relationshipId !== undefined && {
      relationshipId: data.relationshipId,
    }),
    ...(data.title !== undefined && { title: data.title }),
    ...(data.date !== undefined && { date: mapEventDate(data.date) }),
    ...(data.place !== undefined && { place: data.place }),
    ...(data.description !== undefined && {
      description: data.description,
    }),
  };
}
