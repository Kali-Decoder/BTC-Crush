import React, { useState, useEffect } from 'react';
import { Sparkles, Gift, Gamepad2, X } from 'lucide-react';

const rewards = [
  { icon: '🍬', label: 'Candy', color: '#ff6b6b' },
  { icon: '🍭', label: 'Lollipop', color: '#4ecdc4' },
  { icon: '🍫', label: 'Chocolate', color: '#45b7d1' },
  { icon: '⭐', label: 'Star', color: '#ffd93d' },
  { icon: '💎', label: 'Gem', color: '#6bcf7f' },
  { icon: '🍪', label: 'Cookie', color: '#ff9ff3' },
];

// Compact Spinner for Popover
export const CompactSpinner = () => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [resultIdx, setResultIdx] = useState<number | null>(null);
  const [alreadySpun, setAlreadySpun] = useState(false);

  useEffect(() => {
    const lastSpin = localStorage.getItem('spinnerLastDate');
    const today = new Date().toISOString().slice(0, 10);
    if (lastSpin === today) {
      setAlreadySpun(true);
    }
  }, []);

  const spin = () => {
    if (spinning || alreadySpun) return;

    setSpinning(true);
    setResultIdx(null);
    
    const selectedIdx = Math.floor(Math.random() * rewards.length);
    const spins = 3 + Math.random() * 2; // 3-5 rotations for faster spin
    const sectorAngle = 360 / rewards.length;
    const targetAngle = sectorAngle * selectedIdx;
    const finalRotation = 360 * spins + targetAngle;

    setRotation(prev => prev + finalRotation);

    setTimeout(() => {
      setResultIdx(selectedIdx);
      setSpinning(false);
      const today = new Date().toISOString().slice(0, 10);
      localStorage.setItem('spinnerLastDate', today);
      setAlreadySpun(true);
    }, 2000); // Shorter duration
  };

  return (
    <div className="flex flex-col items-center p-3 w-64">
      <div className="text-sm font-bold text-gray-700 mb-3 text-center">🎯 Lucky Spinner</div>
      
      {/* Compact Wheel */}
      <div className="relative w-32 h-32 mb-4">
        {/* Wheel Background */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg border-2 border-gray-200"></div>
        
        {/* Spinning Sectors */}
        <div
          className="absolute inset-1 rounded-full transition-transform duration-[2000ms] ease-out"
          style={{ 
            transform: `rotate(${rotation}deg)`,
            transformOrigin: 'center center'
          }}
        >
          {rewards.map((reward, i) => {
            const angle = (360 / rewards.length) * i;
            
            return (
              <div key={i} className="absolute inset-0">
                {/* Sector Background */}
                <div
                  className="absolute w-full h-full rounded-full opacity-80"
                  style={{
                    background: `conic-gradient(from ${angle}deg, ${reward.color} 0deg, ${reward.color} ${360/rewards.length}deg, transparent ${360/rewards.length}deg)`,
                  }}
                />
                
                {/* Reward Icon */}
                <div
                  className="absolute w-6 h-6 flex items-center justify-center text-sm"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `rotate(${angle + 30}deg) translateY(-40px) rotate(-${angle + 30}deg)`,
                    marginLeft: '-12px',
                    marginTop: '-12px',
                  }}
                >
                  <div className="bg-white rounded-full w-5 h-5 flex items-center justify-center shadow-sm text-xs">
                    {reward.icon}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Center Circle */}
        <div className="absolute top-1/2 left-1/2 w-4 h-4 -mt-2 -ml-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-md border border-white z-10"></div>

        {/* Pointer */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 z-20">
          <div className="w-0 h-0 border-l-2 border-r-2 border-b-4 border-l-transparent border-r-transparent border-b-red-500"></div>
        </div>
      </div>

      {/* Spin Button or Already Spun Message */}
      {alreadySpun ? (
        <div className="px-4 py-2 rounded-full text-sm font-bold text-gray-500 bg-gray-200 cursor-not-allowed mt-2">Already spun today</div>
      ) : (
        <button
          onClick={spin}
          disabled={spinning}
          className={`px-4 py-2 rounded-full text-sm font-bold text-white shadow-md transition-all duration-200 ${
            spinning 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 hover:scale-105'
          }`}
        >
          {spinning ? 'Spinning...' : '🎲 Spin!'}
        </button>
      )}

      {/* Result */}
      {resultIdx !== null && !spinning && (
        <div className="mt-3 text-center">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-2 rounded-lg shadow-md">
            <div className="text-lg">{rewards[resultIdx].icon}</div>
            <div className="text-xs font-bold">You won {rewards[resultIdx].label}!</div>
          </div>
        </div>
      )}
    </div>
  );
};

// Compact Loot Box
type Reward = { icon: string; label: string; color: string };

export const CompactLootBox = () => {
  const [opened, setOpened] = useState(false);
  const [reward, setReward] = useState<Reward | null>(null);
  const [alreadyOpened, setAlreadyOpened] = useState(false);

  useEffect(() => {
    const lastOpen = localStorage.getItem('lootboxLastDate');
    const today = new Date().toISOString().slice(0, 10);
    if (lastOpen === today) {
      setAlreadyOpened(true);
      setOpened(true);
    }
  }, []);

  const openBox = () => {
    if (opened || alreadyOpened) return;
    const randomReward = rewards[Math.floor(Math.random() * rewards.length)];
    setReward(randomReward);
    setOpened(true);
    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem('lootboxLastDate', today);
    setAlreadyOpened(true);
  };

  const reset = () => {
    setOpened(false);
    setReward(null);
    setAlreadyOpened(false);
    localStorage.removeItem('lootboxLastDate');
  };

  return (
    <div className="flex flex-col items-center p-4 w-48">
      <div className="text-sm font-bold text-gray-700 mb-3 text-center">�� Mystery Box</div>
      
      <div className="mb-4">
        {!opened ? (
          <div className="text-6xl animate-pulse cursor-pointer hover:scale-110 transition-transform" onClick={openBox}>
            📦
          </div>
        ) : (
          <div className="flex flex-col items-center animate-bounce">
            <div className="text-4xl mb-2">✨</div>
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg border-2 border-white"
              style={{ backgroundColor: reward?.color }}
            >
              {reward?.icon}
            </div>
          </div>
        )}
      </div>

      {!opened ? (
        alreadyOpened ? (
          <div className="px-4 py-2 rounded-full text-sm font-bold text-gray-500 bg-gray-200 cursor-not-allowed mt-2">Box already opened today</div>
        ) : (
          <button
            onClick={openBox}
            className="px-4 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-md transition-all duration-200 hover:scale-105"
          >
            🔓 Open Box!
          </button>
        )
      ) : (
        <div className="text-center">
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-3 py-2 rounded-lg shadow-md mb-2">
            <div className="text-xs font-bold">You found {reward?.label}!</div>
          </div>
        </div>
      )}
    </div>
  );
};

// Simple Mini Game
export const CompactMiniGame = () => {
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [position, setPosition] = useState({ x: 50, y: 50 });

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setTimeLeft(10);
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameActive(false);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Move target every 1.5 seconds
    const mover = setInterval(() => {
      if (!gameActive) {
        clearInterval(mover);
        return;
      }
      setPosition({
        x: 20 + Math.random() * 60,
        y: 20 + Math.random() * 60
      });
    }, 1500);
  };

  const hitTarget = () => {
    if (gameActive) {
      setScore(prev => prev + 1);
      setPosition({
        x: 20 + Math.random() * 60,
        y: 20 + Math.random() * 60
      });
    }
  };

  return (
    <div className="flex flex-col items-center p-4 w-56">
      <div className="text-sm font-bold text-gray-700 mb-2 text-center">🎮 Quick Click</div>
      
      <div className="mb-3 text-center">
        <div className="text-xs text-gray-600">Score: {score} | Time: {timeLeft}s</div>
      </div>

      <div className="relative w-32 h-32 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg border-2 border-gray-200 mb-3 overflow-hidden">
        {gameActive && (
          <div
            className="absolute w-6 h-6 bg-red-500 rounded-full cursor-pointer hover:bg-red-600 transition-colors shadow-lg animate-pulse"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={hitTarget}
          >
            <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
              🎯
            </div>
          </div>
        )}
        
        {!gameActive && timeLeft === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-center">
            <div>
              <div className="text-lg font-bold">Game Over!</div>
              <div className="text-sm">Final Score: {score}</div>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={startGame}
        disabled={gameActive}
        className={`px-4 py-2 rounded-full text-sm font-bold text-white shadow-md transition-all duration-200 ${
          gameActive 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-blue-500 to-green-600 hover:from-blue-600 hover:to-green-700 hover:scale-105'
        }`}
      >
        {gameActive ? 'Playing...' : '🚀 Start Game!'}
      </button>
    </div>
  );
};

// Enhanced MapInterlude Component
export const MapInterlude = ({ type }: { type: 'spinner' | 'lootbox' | 'minigame' }) => {
  const [isOpen, setIsOpen] = useState(false);

  let icon, popoverContent, bgGradient;
  
  switch (type) {
    case 'spinner':
      icon = <Sparkles className="text-yellow-500" size={16} />;
      popoverContent = <CompactSpinner />;
      bgGradient = 'from-yellow-200 via-orange-100 to-pink-200';
      break;
    case 'lootbox':
      icon = <Gift className="text-purple-500" size={16} />;
      popoverContent = <CompactLootBox />;
      bgGradient = 'from-purple-200 via-pink-100 to-blue-200';
      break;
    case 'minigame':
      icon = <Gamepad2 className="text-blue-500" size={16} />;
      popoverContent = <CompactMiniGame />;
      bgGradient = 'from-blue-200 via-green-100 to-teal-200';
      break;
    default:
      icon = null;
      popoverContent = null;
      bgGradient = 'from-gray-200 to-gray-300';
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-10 h-10 rounded-full bg-gradient-to-br ${bgGradient} shadow-lg border-3 border-white flex items-center justify-center hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-300 hover:animate-none`}
        aria-label={type}

      >
        {icon}
     
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0  z-[1000]"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Popover */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-[1100]">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 relative">
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors "
              >
                <X size={12} className="text-gray-600" />
              </button>
              
              {/* Arrow */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></div>
              
              {popoverContent}
            </div>
          </div>
        </>
      )}
    </div>
  );
};