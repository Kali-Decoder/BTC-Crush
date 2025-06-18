'use client';

import { useState } from 'react';
import { Level } from '@/types/level';

export interface LockedLevel {
  amount: number;
  lockStart: number; // timestamp
  unlockAt: number; // timestamp
}

function getLockedLevels(): Record<number, LockedLevel> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem('lockedLevels') || '{}');
  } catch {
    return {};
  }
}

function setLockedLevels(data: Record<number, LockedLevel>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('lockedLevels', JSON.stringify(data));
}

export function useLockedLevels() {
  const [lockedLevels, setLockedLevelsState] = useState<Record<number, LockedLevel>>(getLockedLevels());

  const lockLevel = (levelId: number, amount: number, lockPeriodDays: number) => {
    const now = Date.now();
    const unlockAt = now + lockPeriodDays * 24 * 60 * 60 * 1000;
    const updated = { ...lockedLevels, [levelId]: { amount, lockStart: now, unlockAt } };
    setLockedLevels(updated);
    setLockedLevelsState(updated);
  };

  const redeemLevel = (levelId: number) => {
    const updated = { ...lockedLevels };
    delete updated[levelId];
    setLockedLevels(updated);
    setLockedLevelsState(updated);
  };

  return { lockedLevels, lockLevel, redeemLevel };
}

export function useGameState() {
  const [lives, setLives] = useState(5);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);

  const handleLevelClick = (level: Level) => {
    if (!level.locked && lives > 0) {
      setSelectedLevel(level);
      // Remove auto-close for now so modal stays open until user closes it
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