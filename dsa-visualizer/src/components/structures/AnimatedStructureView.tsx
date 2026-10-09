import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTraceStore } from '../../store/traceStore';

export const AnimatedStructureView: React.FC<{ ds: string }> = ({ ds }) => {
  const { events, currentIndex } = useTraceStore();
  const event = events[currentIndex];

  if (!event || Object.keys(event.heap).length === 0) {
    return <span className="text-gray-400 italic">Structure empty or waiting for execution...</span>;
  }

  // Find the primary list/array in the heap to visualize
  const heapObjects = Object.values(event.heap);
  const primaryList = heapObjects.find(h => h.type === 'list');
  
  if (!primaryList) {
    return <span className="text-gray-400">No array/list detected in memory.</span>;
  }

  const elements = primaryList.pointers || [];

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4">
      
      {ds === 'stack' && (
        <div className="flex flex-col-reverse justify-start border-x-4 border-b-4 border-gray-400 w-48 h-64 bg-gray-50/50 p-2 overflow-hidden relative shadow-inner rounded-b-lg">
          <AnimatePresence mode="popLayout">
            {elements.map((ptr, idx) => {
              const targetObj = event.heap[ptr.to_id];
              const val = targetObj ? JSON.stringify(targetObj.value) : '?';
              return (
                <motion.div
                  key={`stack-item-${idx}`}
                  layout
                  initial={{ opacity: 0, y: -50, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 50, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="w-full bg-blue-500 text-white text-center py-3 mb-1 rounded-md font-extrabold shadow-md border-2 border-blue-600"
                >
                  {val}
                </motion.div>
              );
            })}
          </AnimatePresence>
          {elements.length === 0 && <div className="text-gray-400 m-auto">Empty Stack</div>}
        </div>
      )}

      {ds === 'queue' && (
        <div className="flex items-center justify-start border-y-4 border-gray-400 h-32 min-w-[300px] w-full max-w-2xl bg-gray-50/50 p-2 overflow-x-auto relative shadow-inner">
          <div className="flex gap-2 min-w-max px-4">
            <AnimatePresence mode="popLayout">
              {elements.map((ptr, idx) => {
                const targetObj = event.heap[ptr.to_id];
                const val = targetObj ? JSON.stringify(targetObj.value) : '?';
                return (
                  <motion.div
                    key={`queue-item-${idx}`}
                    layout
                    initial={{ opacity: 0, x: 50, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -50, scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="w-20 h-20 bg-green-500 text-white flex flex-col items-center justify-center rounded-md font-extrabold shadow-md border-2 border-green-600 relative shrink-0"
                  >
                    <span className="text-xl">{val}</span>
                    <span className="absolute -bottom-6 text-[10px] text-gray-500 font-mono font-bold">Idx: {idx}</span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {elements.length === 0 && <div className="text-gray-400 m-auto italic">Empty Queue</div>}
          </div>
        </div>
      )}

      {ds !== 'stack' && ds !== 'queue' && (
        <div className="flex flex-wrap gap-2 justify-center border-2 border-dashed border-gray-300 p-8 rounded-xl bg-white w-full max-w-3xl">
          <AnimatePresence mode="popLayout">
            {elements.map((ptr, idx) => {
              const targetObj = event.heap[ptr.to_id];
              const val = targetObj ? JSON.stringify(targetObj.value) : '?';
              return (
                <motion.div
                  key={`generic-item-${idx}`}
                  layout
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="w-16 h-16 bg-purple-100 text-purple-800 flex items-center justify-center rounded-lg font-bold shadow border border-purple-300"
                >
                  {val}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

    </div>
  );
};
