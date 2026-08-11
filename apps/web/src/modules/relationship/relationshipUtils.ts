import type {
  CreateRelationshipInput,
  Person,
  Relationship,
} from "@arbora/shared";
import type { RelationshipFormData } from "./components/RelationshipFormPanel";

export function buildRelationshipInput(
  currentPersonId: string,
  data: RelationshipFormData,
): CreateRelationshipInput {
  const isTargetParent = data.type === "PARENT";
  const isParentChildRelationship =
    data.type === "PARENT" || data.type === "CHILD";

  return {
    sourcePersonId: isTargetParent
      ? data.targetPersonId
      : currentPersonId,
    targetPersonId: isTargetParent
      ? currentPersonId
      : data.targetPersonId,
    type: isParentChildRelationship ? "PARENT" : "PARTNER",
    ...(data.date ? { date: data.date } : {}),
  };
}

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
