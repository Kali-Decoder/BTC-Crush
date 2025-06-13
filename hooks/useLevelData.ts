'use client';

import { useState } from 'react';
import { Level } from '@/types/level';

export function useLevelData() {
  const generateLevels = (): Level[] => {
    // Define the specific level positions to match the cinema theme
    const levelPositions = [
      // Bottom row - starting area
      { id: 1, x: 15, y: 85, completed: true, stars: 3 },
      
      // Second row
      { id: 2, x: 25, y: 75, completed: true, stars: 2 },
      { id: 3, x: 40, y: 70, completed: true, stars: 3 },
      { id: 4, x: 55, y: 75, completed: true, stars: 1 },
      
      // Third row
      { id: 5, x: 70, y: 65, completed: true, stars: 3 },
      { id: 6, x: 75, y: 50, completed: true, stars: 2 },
      { id: 7, x: 60, y: 45, completed: true, stars: 3 },
      { id: 8, x: 45, y: 50, completed: true, stars: 2 },
      
      // Fourth row - middle section
      { id: 9, x: 30, y: 55, completed: true, stars: 3 },
      { id: 10, x: 20, y: 45, completed: true, stars: 1 },
      { id: 11, x: 35, y: 35, completed: true, stars: 2 },
      
      // Top section - cinema area
      { id: 12, x: 50, y: 30, completed: true, stars: 3 },
      { id: 12, x: 65, y: 25, completed: false, stars: 0, type: 'special' as const },
      { id: 14, x: 55, y: 15, completed: false, stars: 0 },
      { id: 15, x: 40, y: 20, completed: false, stars: 0, locked: true },
      { id: 16, x: 25, y: 25, completed: false, stars: 0, locked: true },
    ];

    return levelPositions.map(pos => ({
      ...pos,
      locked: pos.locked || (!pos.completed && pos.id > 3183)
    }));
  };

  const [levels] = useState(generateLevels());
  
  return { levels };
}