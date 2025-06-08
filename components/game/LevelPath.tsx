'use client';

import { Level } from '@/types/level';

interface LevelPathProps {
  levels: Level[];
}

export function LevelPath({ levels }: LevelPathProps) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
      <defs>
        <pattern id="candyStripe" patternUnits="userSpaceOnUse" width="10" height="10">
          <rect width="10" height="10" fill="#ff6b9d"/>
          <rect width="5" height="10" fill="#ffffff"/>
        </pattern>
      </defs>
      {/* Custom path connections for cinema layout */}
      {levels.slice(0, -1).map((level, index) => {
        const nextLevel = levels[index + 1];
        if (!nextLevel) return null;
        
        return (
          <line
            key={index}
            x1={`${level.x}%`}
            y1={`${level.y}%`}
            x2={`${nextLevel.x}%`}
            y2={`${nextLevel.y}%`}
            stroke="url(#candyStripe)"
            strokeWidth="8"
            strokeLinecap="round"
            className="drop-shadow-sm"
          />
        );
      })}
    </svg>
  );
}