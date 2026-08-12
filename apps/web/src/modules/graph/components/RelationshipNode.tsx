import type { NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import { Heart, HeartCrack, HeartHandshake } from "lucide-react";
import type { RelationshipType } from "@arbora/shared";

import { t } from "@/i18n";

import { RELATIONSHIP_NODE_SIZE } from "../constants";
import type { RelationshipNode as RelationshipNodeType } from "../types";

export default function RelationshipNode({
  data,
}: NodeProps<RelationshipNodeType>) {
  const { relationship } = data;
  const style = getRelationshipStyle(relationship.type);
  const Icon = style.icon;
  const title = relationship.date
    ? `${t(`relationship.types.${relationship.type}`)} · ${relationship.date}`
    : t(`relationship.types.${relationship.type}`);

  return (
    <div
      title={title}
      style={{
        width: RELATIONSHIP_NODE_SIZE,
        height: RELATIONSHIP_NODE_SIZE,
      }}
      className={`group relative flex items-center justify-center rounded-full border bg-surface shadow-[0_5px_14px_rgba(17,24,39,0.12)] ring-4 transition-shadow hover:shadow-[0_8px_18px_rgba(17,24,39,0.16)] ${style.container}`}
    >
      <Handle
        id="partner-left"
        type="target"
        position={Position.Left}
        className={`!h-2 !w-2 !border-2 !border-surface shadow-sm ${style.handle}`}
      />
      <Handle
        id="partner-right"
        type="target"
        position={Position.Right}
        className={`!h-2 !w-2 !border-2 !border-surface shadow-sm ${style.handle}`}
      />
      <Handle
        id="children"
        type="source"
        position={Position.Bottom}
        className="!h-2 !w-2 !border-2 !border-surface !bg-slate-500 shadow-sm"
      />

      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full text-white shadow-sm transition-transform group-hover:scale-105 ${style.iconBackground}`}
      >
        <Icon
          size={11}
          fill={relationship.type === "MARRIAGE" ? "currentColor" : "none"}
          strokeWidth={2.2}
        />
      </span>
    </div>
  );
}

function getRelationshipStyle(type: RelationshipType) {
  if (type === "FREE_UNION") {
    return {
      icon: HeartHandshake,
      container: "border-cyan-200 ring-cyan-50",
      handle: "!bg-cyan-500",
      iconBackground: "bg-gradient-to-br from-cyan-400 to-teal-500",
    };
  }

  if (type === "DIVORCE") {
    return {
      icon: HeartCrack,
      container: "border-amber-200 ring-amber-50",
      handle: "!bg-amber-500",
      iconBackground: "bg-gradient-to-br from-amber-400 to-orange-500",
    };
  }

  return {
    icon: Heart,
    container: "border-pink-200 ring-pink-50",
    handle: "!bg-pink-400",
    iconBackground: "bg-gradient-to-br from-pink-400 to-rose-500",
  };
}
