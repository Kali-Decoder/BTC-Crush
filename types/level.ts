export interface Level {
  id: number;
  completed: boolean;
  stars: number;
  locked: boolean;
  x: number;
  y: number;
  type?: 'normal' | 'special' | 'boss';
}

export interface GameState {
  lives: number;
  selectedLevel: number | null;
}