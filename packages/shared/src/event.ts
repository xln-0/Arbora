export const EVENT_TYPES = [
  "BIRTH",
  "BAPTISM",
  "EDUCATION",
  "OCCUPATION",
  "RESIDENCE",
  "FREE_UNION",
  "MARRIAGE",
  "DIVORCE",
  "DEATH",
  "BURIAL",
  "OTHER",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export interface CreateEventInput {
  type: EventType;
  personId: string;
  relationshipId?: string | null;
  title?: string | null;
  date: string;
  place?: string | null;
  description?: string | null;
}

export type UpdateEventInput = Partial<CreateEventInput>;

export interface Event {
  id: string;
  treeId: string;
  personId: string;
  relationshipId?: string | null;
  type: EventType;
  title?: string | null;
  date: string;
  place?: string | null;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}
