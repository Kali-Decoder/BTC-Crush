'use client';

export function BackgroundElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating Popcorn */}
      {[...Array(12)].map((_, i) => (
        <div
          key={`popcorn-${i}`}
          className="absolute w-3 h-3 bg-yellow-200 rounded-full animate-bounce opacity-60"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.3}s`,
            animationDuration: `${2 + Math.random()}s`
          }}
        />
      ))}
      
      {/* Candy Scattered */}
      {[...Array(15)].map((_, i) => (
        <div
          key={`candy-${i}`}
          className="absolute w-2 h-2 rounded-full animate-pulse"
          style={{
            background: ['#ff6b9d', '#c44cff', '#4ecdc4', '#45b7d1', '#f9ca24', '#ff4757'][i % 6],
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
            animationDelay: `${i * 0.2}s`,
            animationDuration: `${3 + Math.random()}s`
          }}
        />
      ))}
    </div>
  );
}