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
      {/* Parent connection */}
      <Handle id="child" type="target" position={Position.Top} />

      {/* Children connection */}
      <Handle id="parent" type="source" position={Position.Bottom} />

      {/* Partner connections */}
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

          p-3

          flex
          flex-col
          items-center
          justify-center

          text-center

          select-none
        `}
      >
        <Avatar
          name={person.firstName}
          className={`
            w-12
            h-12
            ${style.avatar}
          `}
        />

        <div className="mt-2">
          <h3
            className="
              font-semibold
              leading-tight
            "
          >
            {person.firstName}
          </h3>

          <p
            className="
              text-sm
              text-muted
            "
          >
            {person.lastName}
          </p>

          {person.birthDate && (
            <p
              className="
                mt-1
                text-xs
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
