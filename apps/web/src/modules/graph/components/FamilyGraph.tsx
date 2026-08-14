import { useEffect, useState } from "react";
import { Background, Controls, ReactFlow } from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import { useUiStore } from "@/stores/uiStore";

import GraphToolbar from "./GraphToolbar";
import PersonNode from "./PersonNode";
import RelationshipNode from "./RelationshipNode";
import FamilyEdge from "./FamilyEdge";

import { SNAP_DISTANCE } from "../constants";
import { useFamilyGraph } from "../hooks/useFamilyGraph";

const nodeTypes = {
  person: PersonNode,
  relationship: RelationshipNode,
};

const edgeTypes = {
  family: FamilyEdge,
};

interface FamilyGraphProps {
  onPaneClick?: () => void;
}

export default function FamilyGraph({ onPaneClick }: FamilyGraphProps) {
  const openViewPerson = useUiStore((state) => state.openViewPerson);
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia("(max-width: 767px)").matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleChange = (event: MediaQueryListEvent) =>
      setIsMobile(event.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    handleNodeDragStop,
    canEdit,
  } = useFamilyGraph();

  return (
    <div className="relative h-full min-h-[calc(100dvh-4rem)] w-full md:min-h-0">
      {canEdit && <GraphToolbar />}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStop={handleNodeDragStop}
        onPaneClick={onPaneClick}
        nodesDraggable={canEdit && !isMobile}
        onNodeClick={(_, node) => {
          if (node.type === "person") {
            openViewPerson(node.id);
          }
        }}
        fitView
        fitViewOptions={{ padding: isMobile ? 0.25 : 0.15 }}
        minZoom={0.2}
        snapToGrid
        snapGrid={[SNAP_DISTANCE, SNAP_DISTANCE]}
      >
        <Background gap={24} size={1} />

        <Controls className="mb-3 ml-1 sm:mb-0 sm:ml-0" />
      </ReactFlow>
    </div>
  );
}
