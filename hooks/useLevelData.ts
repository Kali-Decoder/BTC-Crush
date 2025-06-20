'use client';

import { useState } from 'react';
import { Level } from '@/types/level';

export function useLevelData() {
  const generateLevels = (): Level[] => {
    // Define the specific level positions to match the cinema theme
    const levelPositions = [
      // Bottom row - starting area
      { id: 1, x: 15, y: 85, completed: true, stars: 3, interestRate: 10, lockPeriod: 1 },
      
      // Second row
      { id: 2, x: 25, y: 75, completed: false, stars: 0, locked: true, interestRate: 3.5, lockPeriod: 10 },
      { id: 3, x: 40, y: 70, completed: false, stars: 0, locked: true, interestRate: 4, lockPeriod: 14 },
      { id: 4, x: 55, y: 75, completed: false, stars: 0, locked: true, interestRate: 4.5, lockPeriod: 21 },
      
      // Third row
      { id: 5, x: 70, y: 65, completed: false, stars: 0, locked: true, interestRate: 5, lockPeriod: 30 },
      { id: 6, x: 75, y: 50, completed: false, stars: 0, locked: true, interestRate: 5.5, lockPeriod: 45 },
      { id: 7, x: 60, y: 45, completed: false, stars: 0, locked: true, interestRate: 6, lockPeriod: 60 },
      { id: 8, x: 45, y: 50, completed: false, stars: 0, locked: true, interestRate: 6.5, lockPeriod: 75 },
      
      // Fourth row - middle section
      { id: 9, x: 30, y: 55, completed: false, stars: 0, locked: true, interestRate: 7, lockPeriod: 90 },
      { id: 10, x: 20, y: 45, completed: false, stars: 0, locked: true, interestRate: 7.5, lockPeriod: 120 },
      { id: 11, x: 35, y: 35, completed: false, stars: 0, locked: true, interestRate: 8, lockPeriod: 150 },
      
      // Top section - cinema area
      { id: 12, x: 50, y: 30, completed: false, stars: 0, locked: true, interestRate: 8.5, lockPeriod: 180 },
      { id: 13, x: 65, y: 25, completed: false, stars: 0, locked: true, type: 'special' as const, interestRate: 9, lockPeriod: 210 },
      { id: 14, x: 55, y: 15, completed: false, stars: 0, locked: true, interestRate: 9.5, lockPeriod: 240 },
      { id: 15, x: 40, y: 20, completed: false, stars: 0, locked: true, interestRate: 10, lockPeriod: 270 },
      { id: 16, x: 25, y: 25, completed: false, stars: 0, locked: true, interestRate: 10.5, lockPeriod: 300 },
      // Dummy levels for endless/cloudy effect
      { id: 10001, x: 30, y: 15, completed: false, stars: 0, locked: true, dummy: true, interestRate: 0, lockPeriod: 0 },
      { id: 10002, x: 40, y: 8, completed: false, stars: 0, locked: true, dummy: true, interestRate: 0, lockPeriod: 0 },
      { id: 10003, x: 50, y: 3, completed: false, stars: 0, locked: true, dummy: true, interestRate: 0, lockPeriod: 0 },
      { id: 10004, x: 60, y: 0, completed: false, stars: 0, locked: true, dummy: true, interestRate: 0, lockPeriod: 0 },
    ];

    return levelPositions.map(pos => ({
      ...pos,
      locked: pos.locked || (!pos.completed && pos.id > 3183)
    }));
  };

  const [levels] = useState(generateLevels());
  
  return { levels };
}