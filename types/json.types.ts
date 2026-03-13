export type JsonValueType = 
  | "object" 
  | "array" 
  | "string" 
  | "number" 
  | "boolean" 
  | "null"
  | "undefined";

export interface JsonNodeData {
  label: string;
  value: any;
  type: JsonValueType;
  path: string;
  isExpandable?: boolean;
  isExpanded?: boolean;
}

export interface GraphNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: JsonNodeData;
  style?: any;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
}