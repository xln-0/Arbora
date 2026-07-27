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

export default function FamilyGraph() {
  const openViewPerson = useUiStore((state) => state.openViewPerson);

  const { nodes, edges, onNodesChange, onEdgesChange, handleNodeDragStop } =
    useFamilyGraph();

  return (
    <div className="relative h-full w-full">
      <GraphToolbar />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStop={handleNodeDragStop}
        onNodeClick={(_, node) => {
          if (node.type === "person") {
            openViewPerson(node.id);
          }
        }}
        fitView
        snapToGrid
        snapGrid={[SNAP_DISTANCE, SNAP_DISTANCE]}
      >
        <Background gap={24} size={1} />

        <Controls />
      </ReactFlow>
    </div>
  );
}
