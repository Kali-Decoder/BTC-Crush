'use client';

import { Sidebar } from '@/components/game/Sidebar';
import { BackgroundElements } from '@/components/game/BackgroundElements';
import { CinemaBuildings } from '@/components/game/CinemaBuildings';
import { LevelPath } from '@/components/game/LevelPath';
import { LevelNode } from '@/components/game/LevelNode';
import { DecorativeElements } from '@/components/game/DecorativeElements';
import { LevelModal } from '@/components/game/LevelModal';
import { useLevelData } from '@/hooks/useLevelData';
import { useGameState } from '@/hooks/useGameState';
import { MapInterlude } from '@/components/game/MapInterlude';
import React from 'react';

export default function Home() {
  const { levels } = useLevelData();
  const { lives, selectedLevel, handleLevelClick, setSelectedLevel } = useGameState();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-300 via-yellow-200 to-green-400 overflow-hidden relative">
      {/* Animated Background Elements */}
      <BackgroundElements />

      {/* Sidebars */}
      <Sidebar side="left" lives={lives} />
      <Sidebar side="right" />

      {/* Main Game Area */}
      <div className="flex-1 pt-4 pb-4 px-28">
        <div className="relative h-screen">
          {/* Cinema Buildings */}
          <CinemaBuildings />

          {/* Level Path */}
          <LevelPath levels={levels} />

          {/* Levels and Interludes inline on path */}
          {levels.filter((level) => !(level as any).dummy).map((level, idx, arr) => {
            // Render LevelNode at its position
            const node = (
              <LevelNode
                key={level.id}
                level={level}
                isSelected={selectedLevel?.id === level.id}
                onLevelClick={handleLevelClick}
              />
            );
            // If not last node, render MapInterlude at midpoint
            if (idx < arr.length - 1) {
              const next = arr[idx + 1];
              // Midpoint calculation
              const midX = (level.x + next.x) / 2;
              const midY = (level.y + next.y) / 2;
              return (
                <React.Fragment key={level.id}>
                  {node}
                  <div
                    style={{
                      position: 'absolute',
                      left: `${midX}%`,
                      top: `${midY}%`,
                      transform: 'translate(-50%, -50%)',
                      zIndex: 2,
                    }}
                  >
                    <MapInterlude type={['spinner', 'lootbox', 'minigame'][idx % 3] as any} />
                  </div>
                </React.Fragment>
              );
            }
            return node;
          })}

          {/* Decorative Elements */}
          <DecorativeElements />
        </div>
      </div>

      {/* Level Selection Modal */}
      <LevelModal selectedLevel={selectedLevel} onClose={() => setSelectedLevel(null)} />
    </div>
  );
}