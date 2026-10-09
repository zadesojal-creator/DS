import { create } from 'zustand';
import type { TraceEvent } from '../lib/traceSchema';

interface TraceState {
  events: TraceEvent[];
  currentIndex: number;
  memoryMode: 'Logical' | 'Address' | 'GC' | 'Diff';
  setEvents: (events: TraceEvent[]) => void;
  setCurrentIndex: (index: number) => void;
  setMemoryMode: (mode: 'Logical' | 'Address' | 'GC' | 'Diff') => void;
  stepForward: () => void;
  stepBackward: () => void;
  reset: () => void;
}

export const useTraceStore = create<TraceState>((set, get) => ({
  events: [],
  currentIndex: 0,
  memoryMode: 'Logical',
  
  setEvents: (events) => set({ events, currentIndex: 0 }),
  setCurrentIndex: (index) => set({ currentIndex: index }),
  setMemoryMode: (mode) => set({ memoryMode: mode }),
  
  stepForward: () => {
    const { currentIndex, events } = get();
    if (currentIndex < events.length - 1) {
      set({ currentIndex: currentIndex + 1 });
    }
  },
  
  stepBackward: () => {
    const { currentIndex } = get();
    if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1 });
    }
  },
  
  reset: () => set({ currentIndex: 0 })
}));
