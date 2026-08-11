import { useState } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui";
import {
  RELATIONSHIP_TYPES,
  type Person,
  type RelationshipType,
} from "@arbora/shared";
import { t } from "@/i18n";

interface RelationshipFormData {
  targetPersonId: string;
  type: RelationshipType;
}

interface RelationshipFormPanelProps {
  persons: Person[];
  onSave: (data: RelationshipFormData) => void;
  onClose: () => void;
}

export default function RelationshipFormPanel({
  persons,
  onSave,
  onClose,
}: RelationshipFormPanelProps) {
  const [targetPersonId, setTargetPersonId] = useState("");
  const [type, setType] = useState<RelationshipType>("PARENT");

  function handleSubmit() {
    if (!targetPersonId) {
      return;
    }

    onSave({
      targetPersonId,
      type,
    });
  }

  return (
    <div
      className="
        fixed
        top-20
        right-84
        w-72
        bg-surface
        border
        border-border
        rounded-2xl
        shadow-xl
        p-6
        z-50
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
          mb-6
        "
      >
        <h2
          className="
            text-xl
            font-semibold
          "
        >
          {t(`relationship.add`)}
        </h2>

        <button onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className="space-y-4">
        <select
          className="
                    w-full
                    border
                    border-border
                    rounded-lg
                    px-3
                    py-2
                  "
          value={targetPersonId}
          onChange={(e) => setTargetPersonId(e.target.value)}
        >
          <option value="">{t(`relationship.selectPerson`)}</option>

          {persons.map((person) => (
            <option key={person.id} value={person.id}>
              {person.firstName} {person.lastName}
            </option>
          ))}
        </select>

        <select
          className="
                    w-full
                    border
                    border-border
                    rounded-lg
                    px-3
                    py-2
                  "
          value={type}
          onChange={(e) => setType(e.target.value as RelationshipType)}
        >
          {RELATIONSHIP_TYPES.map((type) => (
            <option key={type} value={type}>
              {t(`relationship.types.${type}`)}
            </option>
          ))}
        </select>
      </div>

      <div
        className="
          flex
          justify-end
          gap-3

          mt-8
        "
      >
        <Button variant="ghost" onClick={onClose}>
          Fermer
        </Button>

        <Button onClick={handleSubmit}>Ajouter</Button>
      </div>
    </div>
  );
}
