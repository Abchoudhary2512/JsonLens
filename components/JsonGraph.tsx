"use client";

import { useCallback, useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import "reactflow/dist/style.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, Download } from "lucide-react";
import NodeDetails from "./NodeDetails";
import JsonNode from "./JsonNode";
import { JsonNodeData, GraphNode, GraphEdge, JsonValueType } from "@/types/json.types";

// Dynamically import ReactFlow to avoid SSR issues
const ReactFlow = dynamic(
  () => import('reactflow').then((mod) => mod.default),
  { ssr: false }
);

const Background = dynamic(
  () => import('reactflow').then((mod) => mod.Background),
  { ssr: false }
);

const Controls = dynamic(
  () => import('reactflow').then((mod) => mod.Controls),
  { ssr: false }
);

const MiniMap = dynamic(
  () => import('reactflow').then((mod) => mod.MiniMap),
  { ssr: false }
);

const Panel = dynamic(
  () => import('reactflow').then((mod) => mod.Panel),
  { ssr: false }
);

import {
  useNodesState,
  useEdgesState,
  NodeTypes,
} from "reactflow";

interface JsonGraphProps {
  data: any;
}

const nodeTypes: NodeTypes = {
  jsonNode: JsonNode,
};

const getJsonType = (value: any): JsonValueType => {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  if (typeof value === "object") return "object";
  if (typeof value === "string") return "string";
  if (typeof value === "number") return "number";
  if (typeof value === "boolean") return "boolean";
  if (typeof value === "undefined") return "undefined";
  return "string"; // default fallback
};

export default function JsonGraph({ data }: JsonGraphProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNode, setSelectedNode] = useState<JsonNodeData | null>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const convertToGraph = useCallback((jsonData: any) => {
    const newNodes: GraphNode[] = [];
    const newEdges: GraphEdge[] = [];
    
    const createNode = (
      id: string,
      label: string,
      value: any,
      type: JsonValueType,
      depth: number,
      path: string
    ): GraphNode => {
      return {
        id,
        type: "jsonNode",
        position: { x: depth * 300, y: newNodes.length * 80 },
        data: {
          label,
          value,
          type,
          path,
          isExpandable: type === "object" || type === "array",
          isExpanded: depth < 2,
        },
      };
    };

    const traverse = (obj: any, currentPath: string, parentId?: string, depth = 0) => {
      // Create a valid ID by removing special characters
      const nodeId = currentPath
        .replace(/\./g, '-')
        .replace(/\[/g, '-')
        .replace(/\]/g, '')
        .replace(/^root$/, 'root-node');
      
      const nodeType = getJsonType(obj);

      const node = createNode(
        nodeId,
        currentPath.split(".").pop() || currentPath,
        obj,
        nodeType,
        depth,
        currentPath
      );
      
      newNodes.push(node);

      if (parentId) {
        newEdges.push({
          id: `${parentId}-${nodeId}`,
          source: parentId,
          target: nodeId,
          animated: false,
        });
      }

      if (typeof obj === "object" && obj !== null && depth < 2) {
        if (Array.isArray(obj)) {
          obj.forEach((item, index) => {
            const childPath = `${currentPath}[${index}]`;
            traverse(item, childPath, nodeId, depth + 1);
          });
        } else {
          Object.entries(obj).forEach(([key, value]) => {
            const childPath = `${currentPath}.${key}`;
            traverse(value, childPath, nodeId, depth + 1);
          });
        }
      }
    };

    traverse(jsonData, "root");
    return { nodes: newNodes, edges: newEdges };
  }, []);

  useEffect(() => {
    if (data) {
      const { nodes: newNodes, edges: newEdges } = convertToGraph(data);
      setNodes(newNodes);
      setEdges(newEdges);

      // Fit view after nodes are loaded
      setTimeout(() => {
        if (reactFlowInstance) {
          reactFlowInstance.fitView();
        }
      }, 100);
    }
  }, [data, convertToGraph, setNodes, setEdges, reactFlowInstance]);

  const handleSearch = useCallback(() => {
    if (!searchTerm) return;
    
    const matchingNodes = nodes.filter((node) =>
      node.data.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (matchingNodes.length > 0 && reactFlowInstance) {
      const firstMatch = matchingNodes[0];
      setSelectedNode(firstMatch.data);
      
      // Center on the first match
      reactFlowInstance.setCenter(
        firstMatch.position.x,
        firstMatch.position.y,
        { duration: 800 }
      );
      
      // Highlight matching nodes
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          style: {
            ...node.style,
            border: matchingNodes.includes(node)
              ? "2px solid #ff6b6b"
              : node.style?.border,
          },
        }))
      );
    }
  }, [searchTerm, nodes, setNodes, reactFlowInstance]);

  const onNodeClick = useCallback((event: any, node: any) => {
    setSelectedNode(node.data);
  }, []);

  const exportGraph = useCallback(() => {
    const graphData = {
      nodes: nodes.map(({ id, data, position }) => ({ id, data, position })),
      edges,
    };
    
    const blob = new Blob([JSON.stringify(graphData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "json-graph.json";
    a.click();
  }, [nodes, edges]);

  if (!data) return null;

  return (
    <div className="h-full w-full relative" style={{ minHeight: '500px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        onInit={setReactFlowInstance}
        fitView
        attributionPosition="bottom-right"
      >
        <Background />
        <Controls />
        <MiniMap />
        
        <Panel position="top-right" className="flex gap-2">
          <div className="flex gap-2 bg-background p-2 rounded-lg shadow-lg">
            <Input
              placeholder="Search keys..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-48"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button size="icon" onClick={handleSearch}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" size="icon" onClick={exportGraph}>
            <Download className="h-4 w-4" />
          </Button>
        </Panel>
      </ReactFlow>

      {selectedNode && (
        <Card className="absolute bottom-4 left-4 p-4 w-80 shadow-lg z-10">
          <NodeDetails
            node={selectedNode}
          />
        </Card>
      )}
    </div>
  );
}