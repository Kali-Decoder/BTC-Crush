'use client';

import { Popcorn, Camera, Play } from 'lucide-react';

export function CinemaBuildings() {
  return (
    <>
      {/* Cinema Buildings - Top Section */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-0">
        {/* Main Cinema Building */}
        <div className="relative">
          <div className="w-32 h-20 bg-gradient-to-b from-red-400 to-red-600 rounded-t-3xl shadow-lg border-4 border-red-700">
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-20 h-3 bg-yellow-300 rounded-full"></div>
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-white font-bold text-xs">CINEMA</div>
          </div>
          <div className="w-40 h-12 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-b-2xl -mt-2 shadow-lg border-4 border-orange-600"></div>
        </div>
      </div>

      {/* Popcorn Stands */}
      <div className="absolute top-20 left-20 z-0">
        <div className="w-16 h-16 bg-gradient-to-b from-blue-400 to-blue-600 rounded-lg shadow-lg border-2 border-blue-700">
          <Popcorn className="w-8 h-8 text-white mx-auto mt-2" />
        </div>
      </div>

      <div className="absolute top-25 right-24 z-0">
        <div className="w-20 h-16 bg-gradient-to-b from-purple-400 to-purple-600 rounded-lg shadow-lg border-2 border-purple-700">
          <Camera className="w-8 h-8 text-white mx-auto mt-2" />
        </div>
      </div>

      {/* Cookie Cinema Title */}
      <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-0">
        <div className="bg-gradient-to-r from-red-500 to-pink-500 px-8 py-3 rounded-full shadow-lg border-2 border-red-600">
          <h2 className="text-white font-bold text-xl drop-shadow-md">Cookie Cinema</h2>
        </div>
      </div>

      {/* Character - Bottom Left */}
      <div className="absolute bottom-20 left-16 z-0">
        <div className="w-20 h-24 bg-gradient-to-b from-pink-400 to-pink-600 rounded-full shadow-lg border-4 border-pink-700 flex items-center justify-center">
          <Play className="w-10 h-10 text-white" />
        </div>
      </div>
    </>
  );
}