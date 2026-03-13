"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { ChevronRight, ChevronDown, Braces, Brackets, Hash, Text, CheckCircle, XCircle } from "lucide-react";
import { JsonNodeData } from "@/types/json.types";

function JsonNode({ data }: NodeProps<JsonNodeData>) {
  const getIcon = () => {
    switch (data.type) {
      case "object":
        return <Braces className="w-4 h-4 text-blue-500" />;
      case "array":
        return <Brackets className="w-4 h-4 text-green-500" />;
      case "number":
        return <Hash className="w-4 h-4 text-orange-500" />;
      case "boolean":
        return data.value ? 
          <CheckCircle className="w-4 h-4 text-green-500" /> : 
          <XCircle className="w-4 h-4 text-red-500" />;
      case "null":
        return <XCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <Text className="w-4 h-4 text-gray-500" />;
    }
  };

  const getValuePreview = () => {
    if (data.type === "object") return `{${Object.keys(data.value || {}).length}}`;
    if (data.type === "array") return `[${(data.value || []).length}]`;
    if (data.type === "string") return `"${data.value.substring(0, 20)}${data.value.length > 20 ? "..." : ""}"`;
    if (data.type === "null") return "null";
    return String(data.value);
  };

  return (
    <div className="px-4 py-2 rounded-lg shadow-md bg-card border border-border min-w-[200px] hover:shadow-lg transition-shadow">
      <Handle type="target" position={Position.Top} />
      
      <div className="flex items-center gap-2">
        {data.isExpandable && (
          <button 
            className="hover:bg-muted rounded p-1"
            onClick={(e) => e.stopPropagation()}
          >
            {data.isExpanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </button>
        )}
        {getIcon()}
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-sm font-medium truncate">{data.label}</span>
          <span className="text-xs text-muted-foreground truncate">{getValuePreview()}</span>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default memo(JsonNode);