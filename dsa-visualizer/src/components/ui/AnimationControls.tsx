import React from 'react';
import { Play, Pause, RotateCcw, FastForward, Rewind } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface Props {
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepForward?: () => void;
  onStepBackward?: () => void;
}

export const AnimationControls: React.FC<Props> = ({
  onPlay, onPause, onReset, onStepForward, onStepBackward
}) => {
  const { isPaused, setIsPaused, animationSpeed, setAnimationSpeed } = useAppStore();

  const handlePlayPause = () => {
    if (isPaused) {
      setIsPaused(false);
      onPlay();
    } else {
      setIsPaused(true);
      onPause();
    }
  };

  return (
    <div className="flex items-center gap-4 bg-gray-100 p-4 rounded-lg shadow-sm">
      <button onClick={onStepBackward} className="p-2 hover:bg-gray-200 rounded disabled:opacity-50" title="Step Backward">
        <Rewind size={20} />
      </button>
      <button onClick={handlePlayPause} className="p-3 bg-blue-500 text-white hover:bg-blue-600 rounded-full shadow-md" title={isPaused ? "Play" : "Pause"}>
        {isPaused ? <Play size={24} /> : <Pause size={24} />}
      </button>
      <button onClick={onStepForward} className="p-2 hover:bg-gray-200 rounded disabled:opacity-50" title="Step Forward">
        <FastForward size={20} />
      </button>
      <button onClick={onReset} className="p-2 hover:bg-gray-200 rounded" title="Reset">
        <RotateCcw size={20} />
      </button>

      <div className="flex items-center gap-2 ml-auto">
        <label className="text-sm font-medium text-gray-700">Speed:</label>
        <input 
          type="range" 
          min="100" 
          max="2000" 
          step="100"
          value={2100 - animationSpeed} 
          onChange={(e) => setAnimationSpeed(2100 - Number(e.target.value))}
          className="w-24"
        />
      </div>
    </div>
  );
};
