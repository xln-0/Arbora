import type { CreateEventInput, Event, UpdateEventInput } from "@arbora/shared";

import { apiClient } from "./client";
import { invalidateTreeGraph } from "./treesApi";

export function getEvents(treeId: string) {
  return apiClient<Event[]>(`/trees/${treeId}/events`);
}

export function getEvent(treeId: string, eventId: string) {
  return apiClient<Event>(`/trees/${treeId}/events/${eventId}`);
}

export async function createEvent(treeId: string, data: CreateEventInput) {
  const event = await apiClient<Event>(`/trees/${treeId}/events`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  invalidateTreeGraph(treeId);
  return event;
}

export async function editEvent(
  treeId: string,
  eventId: string,
  data: UpdateEventInput,
) {
  const event = await apiClient<Event>(`/trees/${treeId}/events/${eventId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  invalidateTreeGraph(treeId);
  return event;
}

export async function deleteEvent(treeId: string, eventId: string) {
  const result = await apiClient(`/trees/${treeId}/events/${eventId}`, {
    method: "DELETE",
  });

  invalidateTreeGraph(treeId);
  return result;
}
