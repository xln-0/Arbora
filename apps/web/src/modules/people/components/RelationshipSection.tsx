import { Trash2 } from "lucide-react";

import { getRelatedPerson } from "@/modules/relationship/relationshipUtils";
import type { Person, Relationship } from "@arbora/shared";

export function RelationshipSection({
  title,
  relationships,
  persons,
  currentPersonId,
  onDelete,
}: {
  title: string;
  relationships: Relationship[];
  persons: Person[];
  currentPersonId: string;

  onDelete: (relationship: Relationship) => void;
}) {
  if (relationships.length === 0) {
    return null;
  }

  return (
    <div className="mt-5">
      <h3
        className="
          text-sm
          font-semibold
          mb-3
        "
      >
        {title}
      </h3>

      <div className="space-y-2">
        {relationships.map((relationship) => {
          const otherPerson = getRelatedPerson(
            relationship,
            currentPersonId,
            persons,
          );

          if (!otherPerson) {
            return null;
          }

          return (
            <div
              key={relationship.id}
              className="
                flex
                items-center
                justify-between

                rounded-xl
                border
                border-border

                px-4
                py-3
              "
            >
              <p className="font-medium">
                {otherPerson.firstName} {otherPerson.lastName}
              </p>

              <button
                type="button"
                onClick={() => onDelete(relationship)}
                className="
                  text-muted-foreground
                  hover:text-destructive
                  transition
                  hover:text-red-500
                  
                "
              >
                <Trash2 size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
