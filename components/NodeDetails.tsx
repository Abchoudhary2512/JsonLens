"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { JsonNodeData } from "@/types/json.types";

interface NodeDetailsProps {
  node: JsonNodeData;
}

export default function NodeDetails({ node }: NodeDetailsProps) {
  const [copied, setCopied] = useState(false);

  const copyPath = () => {
    navigator.clipboard.writeText(node.path);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatValue = () => {
    if (typeof node.value === "object" && node.value !== null) {
      return JSON.stringify(node.value, null, 2);
    }
    return String(node.value);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Node Details</h3>
        <Button variant="ghost" size="sm" onClick={copyPath}>
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      <div className="space-y-2 text-sm">
        <div>
          <span className="text-muted-foreground">Key: </span>
          <span className="font-mono">{node.label}</span>
        </div>
        
        <div>
          <span className="text-muted-foreground">Type: </span>
          <span className="font-mono">{node.type}</span>
        </div>
        
        <div>
          <span className="text-muted-foreground">Path: </span>
          <span className="font-mono text-xs break-all">{node.path}</span>
        </div>
        
        <div>
          <span className="text-muted-foreground">Value: </span>
          <pre className="font-mono text-xs bg-muted p-2 rounded mt-1 overflow-auto max-h-32">
            {formatValue()}
          </pre>
        </div>
      </div>
    </div>
  );
}