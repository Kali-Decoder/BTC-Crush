'use client';

interface LevelModalProps {
  selectedLevel: number | null;
}

export function LevelModal({ selectedLevel }: LevelModalProps) {
  if (!selectedLevel) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 shadow-2xl animate-pulse">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white font-bold text-2xl">{selectedLevel}</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Level...</h2>
          <p className="text-gray-600">Lights, Camera, Action!</p>
        </div>
      </div>
    </div>
  );
}