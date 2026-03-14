"use client";

import * as React from "react";
import { GripVertical } from "lucide-react";

interface SplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
  defaultLeftSize?: number; // percentage
}

export function SplitPane({ left, right, defaultLeftSize = 40 }: SplitPaneProps) {
  const [leftSize, setLeftSize] = React.useState(defaultLeftSize);
  const [isDragging, setIsDragging] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newLeftSize = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    
    // Clamp between 20% and 80%
    const clampedSize = Math.min(Math.max(newLeftSize, 20), 80);
    setLeftSize(clampedSize);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div 
      ref={containerRef}
      className="flex h-full w-full relative"
      style={{ userSelect: isDragging ? 'none' : 'auto' }}
    >
      {/* Left Panel */}
      <div 
        className="h-full overflow-auto"
        style={{ width: `${leftSize}%` }}
      >
        {left}
      </div>

      {/* Resize Handle */}
      <div
        className="w-1 hover:w-2 bg-border hover:bg-primary/20 cursor-col-resize transition-all relative group flex items-center justify-center"
        onMouseDown={handleMouseDown}
      >
        <div className="absolute h-8 w-4 flex items-center justify-center rounded-sm bg-background border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="h-3 w-3" />
        </div>
      </div>

      {/* Right Panel */}
      <div 
        className="h-full overflow-auto flex-1"
        style={{ width: `${100 - leftSize}%` }}
      >
        {right}
      </div>
    </div>
  );
}