'use client';

import { Popcorn, Film } from 'lucide-react';

export function DecorativeElements() {
  return (
    <>
      {/* Additional Decorative Elements */}
      <div className="absolute top-40 right-32 animate-bounce" style={{ animationDelay: '0.5s' }}>
        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-lg flex items-center justify-center">
          <Popcorn className="w-6 h-6 text-white" />
        </div>
      </div>

      <div className="absolute bottom-40 right-20 animate-bounce" style={{ animationDelay: '1s' }}>
        <div className="w-14 h-14 bg-gradient-to-br from-red-400 to-pink-500 rounded-full shadow-lg flex items-center justify-center">
          <Film className="w-8 h-8 text-white" />
        </div>
      </div>
    </>
  );
}