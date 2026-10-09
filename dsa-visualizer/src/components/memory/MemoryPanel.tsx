import React, { useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTraceStore } from '../../store/traceStore';
import { MemoryArrows } from './MemoryArrows';

export const MemoryPanel: React.FC = () => {
  const { events, currentIndex, memoryMode, setMemoryMode } = useTraceStore();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const currentEvent = events[currentIndex];
  
  const pointers = useMemo(() => {
    if (!currentEvent) return [];
    const pts: { fromId: string; toId: string; label?: string }[] = [];
    
    // Pointers from stack to heap
    currentEvent.stack.forEach(frame => {
      Object.entries(frame.locals).forEach(([k, v]) => {
        if (typeof v === 'object' && v !== null && v.__id) {
          pts.push({ fromId: `${frame.frame_id}-${k}`, toId: v.__id, label: k });
        }
      });
    });
    
    // Pointers from heap to heap
    Object.values(currentEvent.heap).forEach(obj => {
      obj.pointers?.forEach(ptr => {
        pts.push({ fromId: obj.id, toId: ptr.to_id, label: ptr.label });
      });
    });
    
    return pts;
  }, [currentEvent]);

  if (events.length === 0 || !currentEvent) return <div className="p-4 text-gray-500 italic">No trace data available. Run code to see memory.</div>;
  
  return (
    <div className="flex flex-col h-full bg-white border border-gray-200 rounded-lg shadow-sm relative overflow-hidden">
      <div className="flex justify-between items-center p-2 border-b bg-gray-50 z-20 relative">
        <h3 className="font-bold text-gray-700 text-sm">Memory (Stack & Heap)</h3>
        <select 
          className="text-xs p-1 border rounded bg-white shadow-sm"
          value={memoryMode}
          onChange={(e) => setMemoryMode(e.target.value as any)}
        >
          <option value="Logical">Logical Mode</option>
          <option value="Address">Hex Address</option>
          <option value="GC">GC Ref Counts</option>
        </select>
      </div>
      
      <div ref={containerRef} className="flex flex-1 overflow-hidden relative">
        
        <MemoryArrows pointers={pointers} containerRef={containerRef} />

        {/* Call Stack */}
        <div className="w-1/3 border-r p-2 overflow-y-auto bg-gray-50 z-10">
          <h4 className="text-xs font-bold text-blue-600 mb-2 tracking-widest">CALL STACK</h4>
          <div className="flex flex-col-reverse gap-2">
            <AnimatePresence>
              {currentEvent.stack.map((frame, i) => (
                <motion.div
                  key={frame.frame_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`p-2 border rounded shadow-sm text-xs ${frame.is_current ? 'bg-blue-100 border-blue-400' : 'bg-white border-gray-300'}`}
                >
                  <div className="font-bold text-gray-800">{frame.func_name}</div>
                  <div className="text-gray-500 mb-1">Line: {frame.line}</div>
                  <div className="border-t pt-1">
                    {Object.entries(frame.locals).map(([k, v]) => {
                      const isRef = typeof v === 'object' && v !== null && v.__id;
                      return (
                        <div key={k} className="flex justify-between font-mono items-center mt-1">
                          <span className="text-purple-700 font-bold">{k}:</span>
                          <span 
                            id={`ptr-${frame.frame_id}-${k}`}
                            className={`text-green-700 truncate ml-2 px-1 rounded ${isRef ? 'bg-green-100 text-xs font-bold border border-green-300' : 'max-w-[100px]'}`} 
                            title={String(v)}
                          >
                            {isRef ? `ref` : String(v)}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Heap */}
        <div className="w-2/3 p-4 overflow-y-auto relative bg-[#fcfcfc] z-10">
          <h4 className="text-xs font-bold text-green-600 mb-4 tracking-widest">HEAP OBJECTS</h4>
          <div className="grid grid-cols-2 gap-4">
            <AnimatePresence>
              {Object.values(currentEvent.heap).map((obj) => (
                <motion.div
                  key={obj.id}
                  id={`heap-${obj.id}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="p-3 bg-green-50/80 border-2 border-green-300 rounded shadow-sm text-xs font-mono relative"
                >
                  <div className="flex justify-between items-center mb-2 border-b border-green-200 pb-1">
                    <span className="font-bold text-gray-700 uppercase tracking-widest text-[10px]">{obj.type}</span>
                    {memoryMode !== 'Logical' && <span className="text-gray-400 text-[9px] font-bold">0x{obj.id.slice(-6)}</span>}
                  </div>
                  <div className="text-gray-800 mt-1 max-h-24 overflow-y-auto break-all">
                    {JSON.stringify(obj.value)}
                  </div>
                  {memoryMode === 'GC' && (
                    <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow">
                      Refs: {obj.ref_count}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
