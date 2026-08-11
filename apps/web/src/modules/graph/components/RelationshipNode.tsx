import type { NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import { Heart } from "lucide-react";

import { t } from "@/i18n";

import { RELATIONSHIP_NODE_SIZE } from "../constants";
import type { RelationshipNode as RelationshipNodeType } from "../types";

const partnerHandleClassName =
  "!h-2 !w-2 !border-2 !border-surface !bg-pink-400 shadow-sm";

export default function RelationshipNode({
  data,
}: NodeProps<RelationshipNodeType>) {
  const { relationship } = data;
  const title = relationship.date
    ? `${t("relationship.types.PARTNER")} · ${relationship.date}`
    : t("relationship.types.PARTNER");

  return (
    <div
      title={title}
      style={{
        width: RELATIONSHIP_NODE_SIZE,
        height: RELATIONSHIP_NODE_SIZE,
      }}
      className="group relative flex items-center justify-center rounded-full border border-pink-200 bg-surface shadow-[0_5px_14px_rgba(17,24,39,0.12)] ring-4 ring-pink-50 transition-shadow hover:shadow-[0_8px_18px_rgba(17,24,39,0.16)]"
    >
      <Handle
        id="partner-left"
        type="target"
        position={Position.Left}
        className={partnerHandleClassName}
      />
      <Handle
        id="partner-right"
        type="target"
        position={Position.Right}
        className={partnerHandleClassName}
      />
      <Handle
        id="children"
        type="source"
        position={Position.Bottom}
        className="!h-2 !w-2 !border-2 !border-surface !bg-slate-500 shadow-sm"
      />

      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-rose-500 text-white shadow-sm transition-transform group-hover:scale-105">
        <Heart size={11} fill="currentColor" strokeWidth={2} />
      </span>
    </div>
  );
}
