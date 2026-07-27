import { BaseEdge, getSmoothStepPath, type EdgeProps } from "@xyflow/react";

export default function FamilyEdge(props: EdgeProps) {
  const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition } =
    props;

  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,

    stepPosition: 1,

    borderRadius: 0,
  });

  return <BaseEdge path={edgePath} />;
}
