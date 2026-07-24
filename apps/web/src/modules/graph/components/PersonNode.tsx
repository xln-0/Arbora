import type { NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";

import { Avatar } from "@/components/ui";

import { useUiStore } from "@/stores/uiStore";

import { formatPersonLifespan } from "@/utils/dateUtils";

import type { PersonNode as PersonNodeType } from "../types";
import { PERSON_NODE_WIDTH, PERSON_NODE_HEIGHT } from "../constants";

const genderStyles = {
  MALE: {
    border: "border-blue-200",
    selected: "border-blue-500",
    avatar: "bg-blue-100 text-blue-700",
  },

  FEMALE: {
    border: "border-pink-200",
    selected: "border-pink-500",
    avatar: "bg-pink-100 text-pink-700",
  },

  UNKNOWN: {
    border: "border-border",
    selected: "border-primary",
    avatar: "bg-surface-muted text-muted",
  },
};

export default function PersonNode({ id, data }: NodeProps<PersonNodeType>) {
  const { person } = data;

  const selectedPersonId = useUiStore((state) => state.selectedPersonId);

  const isSelected = selectedPersonId === id;

  const style = genderStyles[person.gender];

  return (
    <>
      <Handle id="child" type="target" position={Position.Top} />
      <Handle id="parent" type="source" position={Position.Bottom} />
      <Handle id="partner-left" type="source" position={Position.Left} />
      <Handle id="partner-right" type="source" position={Position.Right} />
      <div
        style={{
          width: PERSON_NODE_WIDTH,
          height: PERSON_NODE_HEIGHT,
        }}
        className={`
        bg-surface

        border

        ${isSelected ? style.selected : style.border}

        rounded-xl

        shadow-sm

        p-4

        flex
        items-center
        gap-4

        select-none
      `}
      >
        <Avatar name={person.firstName} className={style.avatar} />

        <div>
          <h3
            className="
            font-semibold
          "
          >
            {person.firstName} {person.lastName}
          </h3>

          {person.birthDate && (
            <p
              className="
                text-sm
                text-muted
              "
            >
              {formatPersonLifespan(person.birthDate, person.deathDate)}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
