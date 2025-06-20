'use client';

import { Star, Crown } from 'lucide-react';
import { Level } from '@/types/level';
import { useState, useEffect } from 'react';

interface LevelNodeProps {
  level: Level;
  isSelected: boolean;
  onLevelClick: (level: Level) => void;
}

export function LevelNode({ level, isSelected, onLevelClick }: LevelNodeProps) {
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState('');

  // Calculate progress for time lock vault
  useEffect(() => {
    if (level.id === 1) {
      const startDate = new Date('2025-06-20T17:30:00Z'); // 11 PM IST = 5:30 PM UTC
      const now = new Date();
      const lockPeriodMs = level.lockPeriod * 24 * 60 * 60 * 1000; // Convert days to milliseconds
      const endDate = new Date(startDate.getTime() + lockPeriodMs);
      
      if (now < startDate) {
        // Vault hasn't started yet
        setProgress(0);
        const timeUntilStart = startDate.getTime() - now.getTime();
        const days = Math.floor(timeUntilStart / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeUntilStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        setTimeLeft(`Starts in ${days}d ${hours}h`);
      } else if (now >= endDate) {
        // Vault has completed
        setProgress(100);
        setTimeLeft('Completed');
      } else {
        // Vault is in progress
        const elapsed = now.getTime() - startDate.getTime();
        const progressPercent = Math.min((elapsed / lockPeriodMs) * 100, 100);
        setProgress(progressPercent);
        
        const remaining = endDate.getTime() - now.getTime();
        const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        setTimeLeft(`${days}d ${hours}h left`);
      }
    } else {
      setProgress(0);
      setTimeLeft('Locked');
    }
  }, [level]);

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
        zIndex: 1
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

      {/* Progress bar below level circle */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-20">
        <div className="bg-gray-200 rounded-full h-2 w-full">
          <div 
            className="bg-gradient-to-r from-pink-400 to-yellow-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-600 text-center mt-1 font-mono">
          {timeLeft}
        </div>
      </div>
    </div>
  );
}