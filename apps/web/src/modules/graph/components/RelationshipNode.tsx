import type { NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";

import type { RelationshipNode as RelationshipNodeType } from "../types";
import { RELATIONSHIP_NODE_SIZE } from "@/modules/graph/constants";

export default function RelationshipNode(
  _props: NodeProps<RelationshipNodeType>,
) {
  return (
    <div
      style={{
        width: RELATIONSHIP_NODE_SIZE,
        height: RELATIONSHIP_NODE_SIZE,
      }}
      className="
        rounded-full

        bg-surface

        border
        border-border

        shadow-sm

        flex
        items-center
        justify-center
      "
    >
      <Handle id="partner-left" type="target" position={Position.Left} />

      <Handle id="partner-right" type="target" position={Position.Right} />

      <Handle id="children" type="source" position={Position.Bottom} />

      <span
        className="
          text-xs
        text-red-500
        "
      >
        ♥
      </span>
    </div>
  );
}
