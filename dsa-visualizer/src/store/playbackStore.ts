import { create } from 'zustand';

interface PlaybackState {
  isPlaying: boolean;
  speed: number;
  togglePlayback: () => void;
  setSpeed: (speed: number) => void;
  stop: () => void;
}

export const usePlaybackStore = create<PlaybackState>((set) => ({
  isPlaying: false,
  speed: 1,
  togglePlayback: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setSpeed: (speed) => set({ speed }),
  stop: () => set({ isPlaying: false })
}));
