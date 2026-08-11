import { useEffect, useState } from "react";

import { X, Trash2 } from "lucide-react";

import { Button } from "@/components/ui";

import {
  type Person,
  GENDERS,
  type Gender,
  type Relationship,
} from "@arbora/shared";
import { formatDate, toInputDate } from "@/utils/dateUtils";
import { RelationshipSection } from "@/modules/people/components/RelationshipSection";
import { t } from "@/i18n";

interface PersonFormData {
  firstName: string;
  lastName?: string;
  gender: Gender;
  birthDate?: string;
  deathDate?: string;
}

interface PersonFormPanelProps {
  person?: Person;
  persons: Person[];
  relationships: Relationship[];
  mode: "create" | "view" | "edit";
  onSave: (data: PersonFormData) => void;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onAddRelationship?: (data: any) => void;
  onDeleteRelationship: (relationship: Relationship) => void;
  canEdit: boolean;
}

export default function PersonFormPanel({
  person,
  persons,
  relationships,
  mode,
  onSave,
  onClose,
  onEdit,
  onDelete,
  onAddRelationship,
  onDeleteRelationship,
  canEdit,
}: PersonFormPanelProps) {
  const [firstName, setFirstName] = useState(person?.firstName ?? "");
  const [lastName, setLastName] = useState(person?.lastName ?? "");
  const [gender, setGender] = useState<Gender>(person?.gender || "UNKNOWN");
  const [birthDate, setBirthDate] = useState(person?.birthDate ?? "");
  const [deathDate, setDeathDate] = useState(person?.deathDate ?? "");

  const isReadonly = mode === "view";

  const parents = relationships.filter(
    (relationship) =>
      relationship.type === "PARENT" &&
      relationship.targetPersonId === person?.id,
  );

  const partner = relationships.filter(
    (relationship) =>
      relationship.type === "PARTNER" &&
      (relationship.sourcePersonId === person?.id ||
        relationship.targetPersonId === person?.id),
  );

  const children = relationships.filter(
    (relationship) =>
      relationship.type === "PARENT" &&
      relationship.sourcePersonId === person?.id,
  );

  function handleSubmit() {
    onSave({
      firstName,
      lastName,
      gender,
      birthDate,
      deathDate,
    });
  }

  useEffect(() => {
    if (mode === "create") {
      setFirstName("");
      setLastName("");
      setGender("UNKNOWN");
      setBirthDate("");
      setDeathDate("");

      return;
    }

    if (person) {
      setFirstName(person.firstName);
      setLastName(person.lastName ?? "");
      setGender(person.gender);
      setBirthDate(toInputDate(person.birthDate));
      setDeathDate(toInputDate(person.deathDate));
    }
  }, [person, mode]);

  return (
    <div
      className="
        fixed
        top-20
        right-6

        w-80

        max-h-[calc(100vh-6rem)]

        bg-surface
        border
        border-border
        rounded-2xl
        shadow-xl

        p-6
        z-50

        flex
        flex-col
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
          mb-4
          shrink-0
        "
      >
        <h2
          className="
            text-xl
            font-semibold
          "
        >
          {mode === "create" && t(`person.add`)}
          {mode === "view" && (
            <>
              {person?.firstName} {person?.lastName}
            </>
          )}
          {mode === "edit" && t(`person.edit`)}
        </h2>

        <button onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div
        className="
          space-y-4
          overflow-y-auto
          flex-1
          pb-4
        "
      >
        {isReadonly ? (
          <>
            <div>
              <p className="text-sm text-muted">{t(`person.fields.gender`)}</p>

              <p className="font-medium">
                {person ? t(`gender.${person.gender}`) : "-"}
              </p>

              <p className="text-sm text-muted">
                {t(`person.fields.birthDate`)}
              </p>

              <p className="font-medium">
                {formatDate(person?.birthDate) || "-"}
              </p>

              <p className="text-sm text-muted">
                {t(`person.fields.deathDate`)}
              </p>

              <p className="font-medium">
                {formatDate(person?.deathDate) || "-"}
              </p>
            </div>
            {mode === "view" && (
              <div className="mt-6">
                <RelationshipSection
                  title={t(`person.relationships.parents`)}
                  relationships={parents}
                  persons={persons}
                  currentPersonId={person!.id}
                  onDelete={onDeleteRelationship}
                  canEdit={canEdit}
                />

                <RelationshipSection
                  title={t(`person.relationships.partners`)}
                  relationships={partner}
                  persons={persons}
                  currentPersonId={person!.id}
                  onDelete={onDeleteRelationship}
                  canEdit={canEdit}
                />

                <RelationshipSection
                  title={t(`person.relationships.children`)}
                  relationships={children}
                  persons={persons}
                  currentPersonId={person!.id}
                  onDelete={onDeleteRelationship}
                  canEdit={canEdit}
                />
              </div>
            )}
            {canEdit && (
              <Button variant="secondary" onClick={onAddRelationship}>
                {t(`relationship.add`)}
              </Button>
            )}
          </>
        ) : (
          <>
            <input
              className="
            w-full
            border
            border-border
            rounded-lg
            px-3
            py-2
          "
              placeholder={t(`person.fields.firstName`)}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />

            <input
              className="
            w-full
            border
            border-border
            rounded-lg
            px-3
            py-2
          "
              placeholder={t(`person.fields.lastName`)}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />

            <select
              className="
                w-full
                border
                border-border
                rounded-lg
                px-3
                py-2
              "
              value={gender}
              onChange={(e) => setGender(e.target.value as Gender)}
            >
              {GENDERS.map((gender) => (
                <option key={gender} value={gender}>
                  {t(`gender.${gender}`)}
                </option>
              ))}
            </select>

            <input
              type="date"
              className="
                w-full
                border
                border-border
                rounded-lg
                px-3
                py-2
              "
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />

            <input
              type="date"
              className="
                w-full
                border
                border-border
                rounded-lg
                px-3
                py-2
              "
              value={deathDate}
              onChange={(e) => setDeathDate(e.target.value)}
            />
          </>
        )}
      </div>

      <div
        className="
          flex
          justify-end
          gap-3

          mt-4
        "
      >
        <Button variant="ghost" onClick={onClose}>
          {t(`actions.close`)}
        </Button>

        {mode === "view" && canEdit && (
          <>
            <Button variant="secondary" onClick={onEdit}>
              {t(`actions.edit`)}
            </Button>
            <Button
              variant="danger"
              onClick={onDelete}
              className="px-3"
              title="Supprimer"
            >
              <Trash2 size={18} />
            </Button>
          </>
        )}

        {mode !== "view" && (
          <Button onClick={handleSubmit}>{t(`actions.save`)}</Button>
        )}
      </div>
    </div>
  );
}
