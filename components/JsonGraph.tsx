"use client";

import { useCallback, useState, useEffect, useRef, memo } from "react";
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
  isLive?: boolean; // Add flag for live demo mode
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
  return "string";
};

// Memoize the conversion function outside component
const convertToGraph = (jsonData: any) => {
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
};

function JsonGraph({ data, isLive = false }: JsonGraphProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNode, setSelectedNode] = useState<JsonNodeData | null>(null);
  const reactFlowInstanceRef = useRef<any>(null);
  const dataRef = useRef<any>(null);
  const isInitializedRef = useRef(false);

  // Effect to update graph when data changes
  useEffect(() => {
    if (data) {
      // Check if data has actually changed
      if (JSON.stringify(dataRef.current) !== JSON.stringify(data)) {
        const { nodes: newNodes, edges: newEdges } = convertToGraph(data);
        setNodes(newNodes);
        setEdges(newEdges);
        dataRef.current = data;

        // Fit view after nodes are loaded (but not on every live update)
        if (!isLive && reactFlowInstanceRef.current) {
          setTimeout(() => {
            reactFlowInstanceRef.current.fitView();
          }, 100);
        }
      }
    } else {
      setNodes([]);
      setEdges([]);
      dataRef.current = null;
    }
  }, [data, setNodes, setEdges, isLive]);

  // Separate effect for fitting view in live mode (only on first load)
  useEffect(() => {
    if (isLive && reactFlowInstanceRef.current && !isInitializedRef.current) {
      setTimeout(() => {
        reactFlowInstanceRef.current.fitView();
        isInitializedRef.current = true;
      }, 200);
    }
  }, [isLive]);

  const handleSearch = useCallback(() => {
    if (!searchTerm) return;
    
    const matchingNodes = nodes.filter((node) =>
      node.data.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (matchingNodes.length > 0 && reactFlowInstanceRef.current) {
      const firstMatch = matchingNodes[0];
      setSelectedNode(firstMatch.data);
      
      reactFlowInstanceRef.current.setCenter(
        firstMatch.position.x,
        firstMatch.position.y,
        { duration: 800 }
      );
      
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
  }, [searchTerm, nodes, setNodes]);

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
        onInit={(instance) => {
          reactFlowInstanceRef.current = instance;
          if (!isLive) {
            setTimeout(() => {
              instance.fitView();
            }, 100);
          }
        }}
        fitView={false} // Disable auto-fit to prevent re-renders
        attributionPosition="bottom-right"
      >
        <Background />
        <Controls />
        {!isLive && <MiniMap />} {/* Hide minimap in live demo to reduce complexity */}
        
        {!isLive && (
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
        )}
      </ReactFlow>

      {selectedNode && !isLive && (
        <Card className="absolute bottom-4 left-4 p-4 w-80 shadow-lg z-10">
          <NodeDetails
            node={selectedNode}
          />
        </Card>
      )}
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(JsonGraph);