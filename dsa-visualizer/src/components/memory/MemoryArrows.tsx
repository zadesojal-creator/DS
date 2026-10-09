import React, { useEffect, useState, useRef } from 'react';

interface ArrowProps {
  pointers: { fromId: string; toId: string; label?: string }[];
  containerRef: React.RefObject<HTMLDivElement>;
}

export const MemoryArrows: React.FC<ArrowProps> = ({ pointers, containerRef }) => {
  const [paths, setPaths] = useState<{ id: string; d: string; x: number; y: number; label?: string }[]>([]);

  useEffect(() => {
    const updateArrows = () => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      
      const newPaths = pointers.map(ptr => {
        const fromEl = document.getElementById(`ptr-${ptr.fromId}`);
        const toEl = document.getElementById(`heap-${ptr.toId}`);
        
        if (!fromEl || !toEl) return null;
        
        const fromRect = fromEl.getBoundingClientRect();
        const toRect = toEl.getBoundingClientRect();
        
        // Calculate relative positions
        const startX = fromRect.right - containerRect.left;
        const startY = fromRect.top + (fromRect.height / 2) - containerRect.top;
        
        const endX = toRect.left - containerRect.left;
        const endY = toRect.top + (toRect.height / 2) - containerRect.top;
        
        // Control points for bezier curve
        const cp1X = startX + (endX - startX) / 2;
        const cp1Y = startY;
        const cp2X = startX + (endX - startX) / 2;
        const cp2Y = endY;
        
        const d = \`M \${startX} \${startY} C \${cp1X} \${cp1Y}, \${cp2X} \${cp2Y}, \${endX} \${endY}\`;
        
        return {
          id: \`\${ptr.fromId}-\${ptr.toId}\`,
          d,
          x: cp1X,
          y: (startY + endY) / 2,
          label: ptr.label
        };
      }).filter(Boolean) as any[];
      
      setPaths(newPaths);
    };

    updateArrows();
    // Re-calculate on resize or short delay to allow DOM to settle
    window.addEventListener('resize', updateArrows);
    const timeout = setTimeout(updateArrows, 50);
    return () => {
      window.removeEventListener('resize', updateArrows);
      clearTimeout(timeout);
    };
  }, [pointers, containerRef]);

  if (paths.length === 0) return null;

  return (
    <svg className="absolute inset-0 pointer-events-none w-full h-full z-50">
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#f97316" />
        </marker>
      </defs>
      {paths.map(path => (
        <g key={path.id}>
          <path
            d={path.d}
            fill="none"
            stroke="#f97316"
            strokeWidth="2"
            strokeDasharray="4"
            markerEnd="url(#arrowhead)"
            className="animate-pulse"
          />
          {path.label && (
            <text x={path.x} y={path.y - 10} fill="#ea580c" fontSize="10" textAnchor="middle" className="font-mono font-bold bg-white px-1">
              {path.label}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
};
