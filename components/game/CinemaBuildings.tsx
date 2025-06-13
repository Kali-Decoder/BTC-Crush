'use client';

import { Popcorn, Camera, Play } from 'lucide-react';

export function CinemaBuildings() {
  return (
    <>
     

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


      {/* Character - Bottom Left */}
      <div className="absolute bottom-20 left-16 z-0">
        <div className="w-20 h-24 bg-gradient-to-b from-pink-400 to-pink-600 rounded-full shadow-lg border-4 border-pink-700 flex items-center justify-center">
          <Play className="w-10 h-10 text-white" />
        </div>
      </div>
    </>
  );
}