'use client';

import { Star, Crown } from 'lucide-react';
import { Level } from '@/types/level';

interface LevelNodeProps {
  level: Level;
  isSelected: boolean;
  onLevelClick: (level: Level) => void;
}

export function LevelNode({ level, isSelected, onLevelClick }: LevelNodeProps) {
  const getLevelStyles = () => {
    if (level.locked) {
      return 'bg-gray-400 border-gray-500 cursor-not-allowed';
    }
    
    if (level.completed) {
      return level.type === 'special'
        ? 'bg-gradient-to-br from-purple-400 to-pink-500 border-purple-300 hover:scale-110'
        : 'bg-gradient-to-br from-green-400 to-emerald-500 border-green-300 hover:scale-110';
    }
    
    if (level.id === 3183) {
      return 'bg-gradient-to-br from-yellow-400 to-orange-500 border-yellow-300 hover:scale-110 animate-pulse';
    }
    
    return 'bg-gradient-to-br from-blue-400 to-purple-500 border-blue-300 hover:scale-110';
  };

  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
      style={{ 
        left: `${level.x}%`, 
        top: `${level.y}%`,
        zIndex: 2
      }}
      onClick={() => onLevelClick(level)}
    >
      <div className={`
        relative w-16 h-16 rounded-full shadow-xl border-4 transition-all duration-300
        ${getLevelStyles()}
        ${isSelected ? 'scale-125 animate-ping' : ''}
      `}>
        {/* Level Number */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-bold text-sm drop-shadow-md">
            {level.id}
          </span>
        </div>

        {/* Stars for completed levels */}
        {level.completed && (
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < level.stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        )}

        {/* Special level indicator */}
        {level.type === 'special' && (
          <Crown className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 text-yellow-400 fill-yellow-400 animate-bounce" />
        )}

        {/* Lock icon for locked levels */}
        {level.locked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 bg-gray-600 rounded border-2 border-gray-700"></div>
          </div>
        )}

        {/* Small decorative elements around levels */}
        {level.completed && (
          <>
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </>
        )}
      </div>
    </div>
  );
}