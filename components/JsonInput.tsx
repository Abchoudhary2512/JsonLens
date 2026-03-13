"use client";

import { useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, FileJson } from "lucide-react";

interface JsonInputProps {
  value: string;
  onChange: (value: string) => void;
  error: string | null;
}

export default function JsonInput({ value, onChange, error }: JsonInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onChange(content);
      };
      reader.readAsText(file);
    }
  };

  const handleExampleLoad = () => {
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
        source: "example"
      }
    };
    onChange(JSON.stringify(example, null, 2));
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex gap-2 mb-4">
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          type="button"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload JSON
        </Button>
        <Button variant="outline" onClick={handleExampleLoad} type="button">
          <FileJson className="w-4 h-4 mr-2" />
          Load Example
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".json"
          className="hidden"
        />
      </div>
      
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your JSON here..."
        className={`flex-1 font-mono text-sm min-h-[200px] ${error ? "border-red-500" : ""}`}
      />
      
      {error && (
        <p className="text-sm text-red-500 mt-2">{error}</p>
      )}
    </div>
  );
}