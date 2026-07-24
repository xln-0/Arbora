// graph/snapUtils.ts

import type { Node } from "@xyflow/react";

import {
  PERSON_NODE_WIDTH,
  PERSON_NODE_HEIGHT,
  RELATIONSHIP_NODE_SIZE,
  SNAP_DISTANCE,
} from "@/modules/graph/constants";

function getNodeSize(node: Node) {
  if (node.type === "relationship") {
    return {
      width: RELATIONSHIP_NODE_SIZE,
      height: RELATIONSHIP_NODE_SIZE,
    };
  }

  return {
    width: PERSON_NODE_WIDTH,
    height: PERSON_NODE_HEIGHT,
  };
}

export function getSnapPosition(node: Node, nodes: Node[]) {
  let x = node.position.x;
  let y = node.position.y;

  const nodeSize = getNodeSize(node);

  const nodeCenterX = node.position.x + nodeSize.width / 2;

  const nodeCenterY = node.position.y + nodeSize.height / 2;

  for (const other of nodes) {
    if (other.id === node.id) {
      continue;
    }

    const otherSize = getNodeSize(other);

    const otherCenterX = other.position.x + otherSize.width / 2;

    const otherCenterY = other.position.y + otherSize.height / 2;

    if (Math.abs(nodeCenterX - otherCenterX) <= SNAP_DISTANCE) {
      x = other.position.x;
    }

    if (Math.abs(nodeCenterY - otherCenterY) <= SNAP_DISTANCE) {
      y = other.position.y;
    }
  }

  return {
    x,
    y,
  };
}
