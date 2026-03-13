"use client";

import { useState } from "react";
import JsonInput from "@/components/JsonInput";
import JsonGraph from "@/components/JsonGraph";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

export default function Home() {
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

  return (
    <main className="container mx-auto p-4 h-screen flex flex-col">
      <h1 className="text-3xl font-bold mb-4">JsonLens - JSON Graph Visualizer</h1>
      
      <Tabs defaultValue="visualize" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="visualize">Visualize</TabsTrigger>
          <TabsTrigger value="input">Input JSON</TabsTrigger>
        </TabsList>
        
        <TabsContent value="input" className="flex-1 data-[state=active]:flex">
          <JsonInput 
            value={jsonString} 
            onChange={handleJsonChange} 
            error={error} 
          />
        </TabsContent>
        
        <TabsContent value="visualize" className="flex-1 data-[state=active]:flex">
          <Card className="p-4 w-full h-full">
            {jsonData ? (
              <JsonGraph data={jsonData} />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                {error ? error : "Enter JSON to visualize"}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}