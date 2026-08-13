import { useCallback, useEffect, useMemo } from "react";

import type { Edge, Node, NodeChange, OnNodeDrag } from "@xyflow/react";
import {
  applyNodeChanges,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { isCoupleRelationshipType } from "@arbora/shared";

import { getTreeGraph } from "@/api/treesApi";
import { updatePersonPosition } from "@/api/personsApi";

import { useTreeStore } from "@/stores/treeStore";
import { useGraphStore } from "@/stores/graphStore";

import type { GraphNode } from "../types";
import { buildGraph } from "../graphMapper";
import {
  applyFamilyLayout,
  updatePartnerEdgeHandles,
  updateRelationshipNodes,
} from "../layout/treeLayout";

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

  const [nodes, setNodes] = useNodesState<GraphNode>([]);

  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    if (!selectedTreeId) {
      setNodes([]);
      setEdges([]);

      return;
    }

    const treeId = selectedTreeId;

    let cancelled = false;

    async function loadGraph() {
      try {
        const graph = await getTreeGraph(treeId);

        if (cancelled) return;

        setGraph(graph.persons, graph.relationships);

        const result = buildGraph(graph.persons, graph.relationships);
        const layoutedNodes = updateRelationshipNodes(
          applyFamilyLayout(result.nodes, buildFamilyLayoutEdges(result.edges)),
        );

        setNodes(layoutedNodes);
        setEdges(result.edges);
      } catch (error) {
        console.error("Failed to load tree graph", error);
      }
    }

    void loadGraph();

    return () => {
      cancelled = true;
    };
  }, [revision, selectedTreeId, setEdges, setGraph, setNodes]);

  const onNodesChange = useCallback(
    (changes: NodeChange<GraphNode>[]) => {
      setNodes((currentNodes) =>
        updateRelationshipNodes(applyNodeChanges(changes, currentNodes)),
      );
    },
    [setNodes],
  );

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

  const layoutedEdges = useMemo(
    () => updatePartnerEdgeHandles(edges, nodes),
    [edges, nodes],
  );

  return {
    nodes,
    edges: layoutedEdges,

    setNodes,

    onNodesChange,
    onEdgesChange,

    handleNodeDragStop,
    canEdit,
  };
}

function buildFamilyLayoutEdges(edges: Edge[]) {
  const partnersByRelationshipNode = new Map<string, string[]>();

  for (const edge of edges) {
    if (
      edge.data?.relationshipType !== undefined &&
      isCoupleRelationshipType(edge.data.relationshipType) &&
      edge.target.startsWith("relationship-")
    ) {
      const partners = partnersByRelationshipNode.get(edge.target) ?? [];
      partners.push(edge.source);
      partnersByRelationshipNode.set(edge.target, partners);
    }
  }

  const layoutEdges: Array<{ source: string; target: string }> = [];

  for (const edge of edges) {
    if (edge.data?.relationshipType !== "PARENT") continue;

    const partners = partnersByRelationshipNode.get(edge.source);

    if (!partners) {
      layoutEdges.push({ source: edge.source, target: edge.target });
      continue;
    }

    for (const partnerId of partners) {
      layoutEdges.push({ source: partnerId, target: edge.target });
    }
  }

  return layoutEdges;
}
