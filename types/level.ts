export interface Level {
  id: number;
  completed: boolean;
  stars: number;
  locked: boolean;
  x: number;
  y: number;
  type?: 'normal' | 'special' | 'boss';
  interestRate: number; // Annual interest rate in %
  lockPeriod: number; // Lock period in days
}

export interface GameState {
  lives: number;
  selectedLevel: number | null;
}