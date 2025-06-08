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

export default function Home() {
  const { levels } = useLevelData();
  const { lives, selectedLevel, handleLevelClick } = useGameState();

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

          {/* Levels */}
          {levels.map((level) => (
            <LevelNode
              key={level.id}
              level={level}
              isSelected={selectedLevel === level.id}
              onLevelClick={handleLevelClick}
            />
          ))}

          {/* Decorative Elements */}
          <DecorativeElements />
        </div>
      </div>

      {/* Level Selection Modal */}
      <LevelModal selectedLevel={selectedLevel} />
    </div>
  );
}