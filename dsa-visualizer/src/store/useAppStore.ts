import { create } from 'zustand'

interface AppState {
  animationSpeed: number;
  setAnimationSpeed: (speed: number) => void;
  isPaused: boolean;
  setIsPaused: (paused: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  animationSpeed: 500,
  setAnimationSpeed: (speed) => set({ animationSpeed: speed }),
  isPaused: false,
  setIsPaused: (paused) => set({ isPaused: paused }),
}));
