"use client";

import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RefreshCw } from "lucide-react";

// Dynamically import the graph to avoid SSR issues
const JsonGraph = dynamic(
  () => import('@/components/JsonGraph'),
  { ssr: false }
);

// Define a type for the JSON data
type JsonData = Record<string, any>;

const exampleData: JsonData = {
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
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      address: {
        city: "New York",
        country: "USA",
        coordinates: {
          lat: 40.7128,
          lng: -74.0060
        }
      },
      hobbies: ["photography", "cooking"]
    }
  ],
  metadata: {
    total: 2,
    source: "live-demo"
  }
};

export default function LiveDemo() {
  const [data, setData] = useState<JsonData>(exampleData);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentExample, setCurrentExample] = useState(0);

  const examples: JsonData[] = [
    exampleData,
    {
      product: {
        id: "p1001",
        name: "Wireless Headphones",
        price: 99.99,
        inStock: true,
        specs: {
          brand: "SoundMax",
          color: "Black",
          battery: "20 hours"
        },
        reviews: [
          { user: "Alice", rating: 5, comment: "Great sound!" },
          { user: "Bob", rating: 4 }
        ]
      }
    },
    {
      apiResponse: {
        status: "success",
        code: 200,
        data: {
          posts: [
            { id: 1, title: "Hello World", likes: 42 },
            { id: 2, title: "Getting Started", likes: 37 }
          ],
          total: 2,
          page: 1
        }
      }
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentExample((prev) => (prev + 1) % examples.length);
      }, 3000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, examples.length]);

  useEffect(() => {
    setData(examples[currentExample]);
  }, [currentExample, examples]);

  const handleRefresh = () => {
    setCurrentExample((prev) => (prev + 1) % examples.length);
  };

  return (
    <Card className="p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Live Demo</h3>
          <p className="text-sm text-muted-foreground">
            Watch JsonLens visualize different JSON structures
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative">
        {/* Graph container */}
        <div className="h-[400px] md:h-[500px] rounded-lg overflow-hidden border bg-muted/30">
          <JsonGraph data={data} />
        </div>

        {/* Floating example indicator */}
        <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs font-medium border shadow-sm">
          Example {currentExample + 1} of {examples.length}
        </div>

        {/* JSON Preview */}
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80">
          <Card className="p-3 bg-background/95 backdrop-blur-sm border shadow-lg">
            <p className="text-xs font-medium mb-2 text-muted-foreground">Current JSON Structure:</p>
            <pre className="text-xs overflow-auto max-h-32 p-2 bg-muted rounded">
              {JSON.stringify(data, null, 2).slice(0, 200)}
              {JSON.stringify(data, null, 2).length > 200 ? '...' : ''}
            </pre>
          </Card>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <span>Live updates every 3s</span>
        </div>
        <div className="w-1 h-1 bg-muted-foreground rounded-full" />
        <div className="flex items-center gap-1">
          <span>Interactive graph</span>
        </div>
      </div>
    </Card>
  );
}