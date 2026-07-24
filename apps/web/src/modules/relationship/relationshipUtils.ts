import type { Person, Relationship } from "@arbora/shared";

export function getRelatedPerson(
  relationship: Relationship,
  currentPersonId: string,
  persons: Person[],
) {
  const relatedPersonId =
    relationship.sourcePersonId === currentPersonId
      ? relationship.targetPersonId
      : relationship.sourcePersonId;

  return persons.find((person) => person.id === relatedPersonId);
}

export function getRelatedPersonName(
  relationship: Relationship,
  currentPersonId: string,
  persons: Person[],
): string {
  const person = getRelatedPerson(relationship, currentPersonId, persons);

  if (!person) {
    return "";
  }

  return `${person.firstName} ${person.lastName}`;
}
