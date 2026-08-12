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
    type: isParentChildRelationship ? "PARENT" : data.type,
    ...(data.unionDate ? { unionDate: data.unionDate } : {}),
    ...(data.marriageDate ? { marriageDate: data.marriageDate } : {}),
    ...(data.divorceDate ? { divorceDate: data.divorceDate } : {}),
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

export function getRelationshipCurrentDate(relationship: Relationship) {
  if (relationship.type === "DIVORCE") {
    return (
      relationship.divorceDate ??
      relationship.marriageDate ??
      relationship.unionDate ??
      null
    );
  }

  if (relationship.type === "MARRIAGE") {
    return relationship.marriageDate ?? relationship.unionDate ?? null;
  }

  return relationship.type === "FREE_UNION"
    ? (relationship.unionDate ?? null)
    : null;
}
