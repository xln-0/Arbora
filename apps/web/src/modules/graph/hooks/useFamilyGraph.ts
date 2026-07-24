import { useEffect } from "react";

import type { Edge, Node, OnNodeDrag } from "@xyflow/react";
import { useEdgesState, useNodesState } from "@xyflow/react";

import { getTreeGraph } from "@/api/treesApi";
import { updatePersonPosition } from "@/api/personsApi";

import { useTreeStore } from "@/stores/treeStore";
import { useGraphStore } from "@/stores/graphStore";

import type { GraphNode } from "../types";
import { buildGraph } from "../graphMapper";

export function useFamilyGraph() {
  const selectedTreeId = useTreeStore((state) => state.selectedTreeId);

  const setGraph = useGraphStore((state) => state.setGraph);

  const revision = useGraphStore((state) => state.revision);

  const [nodes, setNodes, onNodesChange] = useNodesState<GraphNode>([]);

  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    if (!selectedTreeId) {
      setNodes([]);
      setEdges([]);

      return;
    }

    const treeId = selectedTreeId;

    async function loadGraph() {
      try {
        const graph = await getTreeGraph(treeId);

        setGraph(graph.persons, graph.relationships);

        const result = buildGraph(graph.persons, graph.relationships);

        setNodes(result.nodes);
        setEdges(result.edges);
      } catch (error) {
        console.error("Failed to load tree graph", error);
      }
    }

    loadGraph();
  }, [selectedTreeId, revision]);

  async function handleNodeDragStop(
    _event: Parameters<OnNodeDrag>[0],
    node: Node<GraphNode["data"]>,
  ) {
    if (node.type !== "person") {
      return;
    }

    try {
      await updatePersonPosition(node.id, node.position.x, node.position.y);
    } catch (error) {
      console.error("Failed to save person position", error);
    }
  }

  return {
    nodes,
    edges,

    setNodes,

    onNodesChange,
    onEdgesChange,

    handleNodeDragStop,
  };
}
