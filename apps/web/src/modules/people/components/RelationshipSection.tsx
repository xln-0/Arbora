import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";

import {
  isCoupleRelationshipType,
  type CoupleRelationshipType,
  type Person,
  type Relationship,
} from "@arbora/shared";

import { Avatar } from "@/components/ui";
import {
  getRelatedPerson,
  getRelationshipCurrentDate,
} from "@/modules/relationship/relationshipUtils";
import { t } from "@/i18n";
import { formatDate } from "@/utils/dateUtils";

export function RelationshipSection({
  title,
  relationships,
  persons,
  currentPersonId,
  onDelete,
  canEdit,
}: {
  title: string;
  relationships: Relationship[];
  persons: Person[];
  currentPersonId: string;
  onDelete: (relationship: Relationship) => void;
  canEdit: boolean;
}) {
  if (relationships.length === 0) {
    return null;
  }

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted">
          {title}
        </h4>
        <span className="rounded-full bg-surface-muted px-2 py-0.5 text-xs font-medium text-muted">
          {relationships.length}
        </span>
      </div>

      <div className="space-y-2">
        {relationships.map((relationship) => {
          const currentDate = getRelationshipCurrentDate(relationship);
          const otherPerson = getRelatedPerson(
            relationship,
            currentPersonId,
            persons,
          );

          if (!otherPerson) {
            return null;
          }

          const name = [otherPerson.firstName, otherPerson.lastName]
            .filter(Boolean)
            .join(" ");

          return (
            <div
              key={relationship.id}
              className="flex items-center gap-2 rounded-xl border border-border p-2 transition hover:bg-surface-muted/60"
            >
              <Link
                to={`/people/${otherPerson.id}`}
                className="flex min-w-0 flex-1 items-center gap-3"
              >
                <Avatar
                  name={name}
                  className="h-9 w-9 shrink-0 bg-primary-soft text-sm text-primary"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">
                    {name}
                  </span>
                  {isCoupleRelationshipType(relationship.type) && (
                    <span
                      title={t(`relationship.types.${relationship.type}`)}
                      className={`mt-0.5 block w-fit max-w-full truncate rounded-full px-2 py-0.5 text-[0.65rem] font-medium ${getCoupleBadgeClassName(relationship.type)}`}
                    >
                      {t(`relationship.types.${relationship.type}`)}
                      {currentDate
                        ? ` · ${formatDate(currentDate)}`
                        : ""}
                    </span>
                  )}
                </span>
              </Link>

              {canEdit && (
                <button
                  type="button"
                  onClick={() => onDelete(relationship)}
                  aria-label={t("actions.delete")}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted transition hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function getCoupleBadgeClassName(type: CoupleRelationshipType) {
  if (type === "FREE_UNION") {
    return "bg-cyan-50 text-cyan-700";
  }

  if (type === "DIVORCE") {
    return "bg-amber-50 text-amber-700";
  }

  return "bg-rose-50 text-rose-700";
}
