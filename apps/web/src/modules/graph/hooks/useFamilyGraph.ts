import { useEffect } from "react";

import type { Edge, Node, OnNodeDrag } from "@xyflow/react";
import { useEdgesState, useNodesState } from "@xyflow/react";

import { getTreeGraph } from "@/api/treesApi";
import { updatePersonPosition } from "@/api/personsApi";

import { useTreeStore } from "@/stores/treeStore";
import { useGraphStore } from "@/stores/graphStore";

import type { GraphNode } from "../types";
import { buildGraph } from "../graphMapper";
import { applyTreeLayout, updateRelationshipNodes } from "../layout/treeLayout";

export function useFamilyGraph() {
  const selectedTreeId = useTreeStore((state) => state.selectedTreeId);
  const canEdit = useTreeStore((state) => {
    const role = state.trees.find(
      (tree) => tree.id === state.selectedTreeId,
    )?.role;

    return role === "OWNER" || role === "EDITOR";
  });

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
    if (!selectedTreeId || !canEdit || node.type !== "person") {
      return;
    }

    try {
      await updatePersonPosition(
        selectedTreeId,
        node.id,
        node.position.x,
        node.position.y,
      );
    } catch (error) {
      console.error("Failed to save person position", error);
    }
  }

  function buildDagreGraph() {
    const dagreNodes = nodes.filter((node) => node.type === "person");

    const dagreEdges: {
      source: string;
      target: string;
    }[] = [];

    for (const edge of edges) {
      if (edge.data?.relationshipType !== "PARENT") {
        continue;
      }

      /**
       * Cas simple :
       * parent -> enfant
       */
      if (!edge.source.startsWith("relationship-")) {
        dagreEdges.push({
          source: edge.source,
          target: edge.target,
        });

        continue;
      }

      /**
       * Cas couple :
       * relationship-node -> enfant
       *
       * On récupère les deux parents
       */
      const relationshipNodeId = edge.source;

      const partnerEdges = edges.filter(
        (partnerEdge) =>
          partnerEdge.target === relationshipNodeId &&
          partnerEdge.data?.relationshipType === "PARTNER",
      );

      for (const partnerEdge of partnerEdges) {
        dagreEdges.push({
          source: partnerEdge.source,
          target: edge.target,
        });
      }
    }

    return {
      nodes: dagreNodes,
      edges: dagreEdges,
    };
  }

  const dagreGraph = buildDagreGraph();

  const layoutedPersonNodes = applyTreeLayout(
    dagreGraph.nodes,
    dagreGraph.edges,
  );

  const layoutedNodes = updateRelationshipNodes([
    ...layoutedPersonNodes,
    ...nodes.filter((node) => node.type === "relationship"),
  ]);

  return {
    nodes: layoutedNodes,
    edges,

    setNodes,

    onNodesChange,
    onEdgesChange,

    handleNodeDragStop,
    canEdit,
  };
}
