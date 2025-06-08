'use client';

import { Heart, Settings, Mail, Gift, Zap, Star, Film } from 'lucide-react';

interface SidebarProps {
  side: 'left' | 'right';
  lives?: number;
}

export function Sidebar({ side, lives }: SidebarProps) {
  if (side === 'left') {
    return (
      <div className="fixed left-4 top-4 bottom-4 w-20 bg-pink-400/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-pink-300/50 flex flex-col items-center py-6 z-10">
        {/* Lives Counter */}
        <div className="bg-white/90 rounded-2xl p-3 mb-4 shadow-lg">
          <div className="flex items-center justify-center mb-2">
            <Heart className="w-6 h-6 text-red-500 fill-red-500" />
            <span className="ml-1 font-bold text-pink-600">{lives}</span>
          </div>
          <div className="text-xs text-pink-600 font-semibold">Full</div>
        </div>

        {/* Timer */}
        <div className="bg-white/90 rounded-2xl p-3 mb-4 shadow-lg">
          <div className="text-xs text-purple-600 font-bold">50:50:04</div>
        </div>

        {/* Booster Item */}
        <div className="bg-white/90 rounded-2xl p-3 mb-4 shadow-lg cursor-pointer hover:scale-105 transition-transform relative">
          <Gift className="w-8 h-8 text-yellow-500" />
          <div className="bg-yellow-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold absolute -mt-2 -mr-2">
            3
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white/90 rounded-2xl p-3 mb-4 shadow-lg cursor-pointer hover:scale-105 transition-transform">
          <Settings className="w-8 h-8 text-gray-600" />
        </div>

        {/* Mail */}
        <div className="bg-white/90 rounded-2xl p-3 shadow-lg cursor-pointer hover:scale-105 transition-transform">
          <Mail className="w-8 h-8 text-blue-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed right-4 top-4 bottom-4 w-20 bg-pink-400/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-pink-300/50 flex flex-col items-center py-6 z-10">
      {/* Episode Progress */}
      <div className="bg-white/90 rounded-2xl p-3 mb-4 shadow-lg">
        <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-2">
          <Film className="w-6 h-6 text-white" />
        </div>
        <div className="text-xs text-center font-bold text-purple-600">Episode</div>
      </div>

      {/* Booster 1 */}
      <div className="bg-white/90 rounded-2xl p-3 mb-4 shadow-lg cursor-pointer hover:scale-105 transition-transform relative">
        <Zap className="w-8 h-8 text-purple-500" />
        <div className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold absolute -top-1 -right-1">
          1
        </div>
      </div>

      {/* Booster 2 */}
      <div className="bg-white/90 rounded-2xl p-3 shadow-lg cursor-pointer hover:scale-105 transition-transform">
        <Star className="w-8 h-8 text-yellow-500" />
      </div>
    </div>
  );
}