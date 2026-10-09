import React, { useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, StepBack, StepForward } from 'lucide-react';
import { useTraceStore } from '../../store/traceStore';
import { usePlaybackStore } from '../../store/playbackStore';

export const VCRControls: React.FC = () => {
  const { currentIndex, events, stepForward, stepBackward, reset, setCurrentIndex } = useTraceStore();
  const { isPlaying, togglePlayback, speed, setSpeed } = usePlaybackStore();
  const totalSteps = events.length;

  useEffect(() => {
    let interval: any;
    if (isPlaying && currentIndex < totalSteps - 1) {
      interval = setInterval(() => {
        stepForward();
      }, 1000 / speed);
    } else if (currentIndex >= totalSteps - 1) {
      if (isPlaying) togglePlayback();
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentIndex, totalSteps, speed, stepForward, togglePlayback]);

  return (
    <div className="flex flex-col gap-2 p-4 bg-gray-50 border-t border-gray-200">
      <div className="flex items-center gap-4 justify-center">
        <button onClick={reset} disabled={currentIndex === 0} className="p-2 hover:bg-gray-200 rounded disabled:opacity-50">
          <SkipBack size={20} />
        </button>
        <button onClick={stepBackward} disabled={currentIndex === 0} className="p-2 hover:bg-gray-200 rounded disabled:opacity-50">
          <StepBack size={20} />
        </button>
        <button onClick={togglePlayback} disabled={totalSteps === 0 || currentIndex === totalSteps - 1} className="p-3 bg-blue-600 text-white hover:bg-blue-700 rounded-full shadow">
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button onClick={stepForward} disabled={currentIndex >= totalSteps - 1} className="p-2 hover:bg-gray-200 rounded disabled:opacity-50">
          <StepForward size={20} />
        </button>
        <button onClick={() => setCurrentIndex(totalSteps - 1)} disabled={currentIndex >= totalSteps - 1} className="p-2 hover:bg-gray-200 rounded disabled:opacity-50">
          <SkipForward size={20} />
        </button>
        
        <select 
          className="ml-4 p-1 border rounded bg-white"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
        >
          <option value={0.5}>0.5x</option>
          <option value={1}>1.0x</option>
          <option value={2}>2.0x</option>
          <option value={4}>4.0x</option>
        </select>
      </div>
      <div className="flex items-center gap-4 px-4">
        <span className="text-xs text-gray-500 font-mono w-16">{currentIndex + 1} / {totalSteps}</span>
        <input 
          type="range" 
          min={0} 
          max={totalSteps > 0 ? totalSteps - 1 : 0} 
          value={currentIndex}
          onChange={(e) => setCurrentIndex(Number(e.target.value))}
          className="flex-1"
        />
      </div>
    </div>
  );
};
