"use client";

import { useState, useEffect } from "react";
import JsonInput from "@/components/JsonInput";
import JsonGraph from "@/components/JsonGraph";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ToolPage() {
  const [jsonData, setJsonData] = useState<any>(null);
  const [jsonString, setJsonString] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleJsonChange = (value: string) => {
    setJsonString(value);
    try {
      if (value.trim()) {
        const parsed = JSON.parse(value);
        setJsonData(parsed);
        setError(null);
      } else {
        setJsonData(null);
      }
    } catch (err) {
      setError("Invalid JSON format");
      setJsonData(null);
    }
  };

  // Load example data on first visit
  useEffect(() => {
    const example = {
      users: [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          address: {
            city: "London",
            country: "UK",
            coordinates: {
              lat: 51.5074,
              lng: -0.1278
            }
          },
          hobbies: ["reading", "gaming", "hiking"]
        }
      ]
    };
    handleJsonChange(JSON.stringify(example, null, 2));
  }, []);

  const countNodes = (obj: any): number => {
    if (!obj) return 0;
    let count = 1;
    if (typeof obj === 'object') {
      if (Array.isArray(obj)) {
        count += obj.length;
      } else {
        count += Object.keys(obj).length;
      }
    }
    return count;
  };

  return (
    <main className="container mx-auto p-4 h-screen flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">JsonLens</h1>
            <p className="text-sm text-muted-foreground">
              JSON Graph Visualizer
            </p>
          </div>
        </div>
        <ThemeToggle />
      </div>
      
      <Card className="flex-1 p-4 overflow-hidden">
        <div className="flex h-full gap-4">
          {/* Left Panel */}
          <div className="w-[40%] h-full flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-muted-foreground">JSON INPUT</h2>
              {jsonData && (
                <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded">
                  ✓ Valid JSON
                </span>
              )}
            </div>
            <div className="flex-1">
              <JsonInput 
                value={jsonString} 
                onChange={handleJsonChange} 
                error={error} 
              />
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-full bg-border" />

          {/* Right Panel */}
          <div className="flex-1 h-full flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-muted-foreground">GRAPH VISUALIZATION</h2>
              {jsonData && (
                <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded">
                  {countNodes(jsonData)} nodes
                </span>
              )}
            </div>
            <div className="flex-1 bg-muted/30 rounded-lg overflow-hidden">
              {jsonData ? (
                <JsonGraph data={jsonData} />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <p className="mb-2">Enter JSON in the left panel to visualize</p>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </main>
  );
}