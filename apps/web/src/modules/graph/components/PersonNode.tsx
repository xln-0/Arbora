import type { NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import { CalendarDays, Check } from "lucide-react";

import { Avatar } from "@/components/ui";
import { useUiStore } from "@/stores/uiStore";
import { formatPersonLifespan } from "@/utils/dateUtils";

import { PERSON_NODE_HEIGHT, PERSON_NODE_WIDTH } from "../constants";
import type { PersonNode as PersonNodeType } from "../types";

const genderStyles = {
  MALE: {
    border: "border-border/80",
    selected: "border-blue-500 ring-blue-500/15",
    avatar: "bg-blue-100 text-blue-700",
    cover: "from-blue-100 via-blue-50 to-surface",
    date: "bg-blue-50 text-blue-700",
  },
  FEMALE: {
    border: "border-border/80",
    selected: "border-pink-500 ring-pink-500/15",
    avatar: "bg-pink-100 text-pink-700",
    cover: "from-pink-100 via-pink-50 to-surface",
    date: "bg-pink-50 text-pink-700",
  },
  UNKNOWN: {
    border: "border-border/80",
    selected: "border-primary ring-primary/15",
    avatar: "bg-primary-soft text-primary",
    cover: "from-primary-soft via-primary-soft/45 to-surface",
    date: "bg-primary/5 text-primary",
  },
};

const handleClassName =
  "!h-2.5 !w-2.5 !border-2 !border-surface !bg-slate-400 shadow-sm";

export default function PersonNode({ id, data }: NodeProps<PersonNodeType>) {
  const { person } = data;
  const selectedPersonId = useUiStore((state) => state.selectedPersonId);
  const isSelected = selectedPersonId === id;
  const style = genderStyles[person.gender];
  const name = [person.firstName, person.lastName].filter(Boolean).join(" ");
  const lifespan = formatPersonLifespan(
    person.birthDate ?? undefined,
    person.deathDate ?? undefined,
  );

  return (
    <>
      <Handle
        id="child"
        type="target"
        position={Position.Top}
        className={handleClassName}
      />
      <Handle
        id="parent"
        type="source"
        position={Position.Bottom}
        className={handleClassName}
      />
      <Handle
        id="partner-left"
        type="source"
        position={Position.Left}
        className={handleClassName}
      />
      <Handle
        id="partner-right"
        type="source"
        position={Position.Right}
        className={handleClassName}
      />

      <article
        title={name}
        style={{ width: PERSON_NODE_WIDTH, height: PERSON_NODE_HEIGHT }}
        className={`
          relative flex select-none flex-col items-center overflow-hidden
          rounded-[1.15rem] border bg-surface px-2.5 pb-2.5 pt-3 text-center
          transition-all duration-200
          ${
            isSelected
              ? `${style.selected} ring-2 shadow-[0_14px_30px_rgba(17,24,39,0.14)]`
              : `${style.border} shadow-[0_6px_18px_rgba(17,24,39,0.08)] hover:border-slate-300 hover:shadow-[0_12px_28px_rgba(17,24,39,0.13)]`
          }
        `}
      >
        <span className={`absolute inset-x-0 top-0 h-11 bg-gradient-to-br ${style.cover}`} />
        <span className="absolute inset-x-3 top-0 h-px bg-white/80" />

        {isSelected && (
          <span className="absolute right-2 top-2 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-foreground text-white shadow-sm">
            <Check size={10} strokeWidth={3} />
          </span>
        )}

        <Avatar
          name={name}
          className={`relative h-11 w-11 shrink-0 border-[3px] border-surface text-sm shadow-md ${style.avatar}`}
        />

        <div className="mt-2 min-w-0 w-full">
          <h3 className="truncate text-sm font-semibold leading-tight tracking-tight">
            {person.firstName}
          </h3>
          {person.lastName && (
            <p className="mt-0.5 truncate text-xs font-medium text-muted">
              {person.lastName}
            </p>
          )}
        </div>

        {lifespan && (
          <span
            className={`mt-auto inline-flex max-w-full items-center gap-1 rounded-full px-2 py-0.5 text-[0.6rem] font-medium ${style.date}`}
          >
            <CalendarDays size={10} className="shrink-0" />
            <span className="truncate">{lifespan}</span>
          </span>
        )}
      </article>
    </>
  );
}
