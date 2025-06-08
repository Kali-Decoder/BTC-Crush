'use client';

import { useState } from 'react';
import { Level } from '@/types/level';

export function useGameState() {
  const [lives, setLives] = useState(5);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  const handleLevelClick = (level: Level) => {
    if (!level.locked && lives > 0) {
      setSelectedLevel(level.id);
      setTimeout(() => setSelectedLevel(null), 1000);
    }
  };

  return {
    lives,
    selectedLevel,
    setLives,
    setSelectedLevel,
    handleLevelClick
  };
}