import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTraceStore } from '../../store/traceStore';

export const GenericStructureView: React.FC = () => {
  const { events, currentIndex } = useTraceStore();
  const event = events[currentIndex];

  const { lists, dicts, primitives } = useMemo(() => {
    if (!event) return { lists: [], dicts: [], primitives: [] };
    const heap = Object.values(event.heap);
    
    // Attempt to categorize heap objects for rendering
    const lists = heap.filter(h => h.type === 'list');
    const dicts = heap.filter(h => h.type === 'dict');
    
    // Primitives from locals in current stack frame
    const locals = event.stack.length > 0 ? event.stack[0].locals : {};
    const primitives = Object.entries(locals).filter(([k, v]) => typeof v !== 'object' || v === null);
    
    return { lists, dicts, primitives };
  }, [event]);

  if (!event) {
    return <span className="text-gray-400">Run code to see visualizations</span>;
  }

  return (
    <div className="flex flex-col items-center justify-start text-center w-full h-full p-4 overflow-y-auto gap-8">
      
      {/* Arrays / Lists */}
      {lists.length > 0 && (
        <div className="w-full">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Arrays (Lists)</h3>
          <div className="flex flex-col gap-6 items-center">
            {lists.map(listObj => {
               // Extract values from python list serialization.
               // In tracer.py, lists are serialized differently depending on depth.
               // If it's a shallow serialization, it might just be the string, otherwise it's a dict reference.
               // For demo purposes, we parse the pointers.
               const elements = listObj.pointers || [];
               
               return (
                 <div key={listObj.id} className="flex flex-col items-center">
                   <div className="text-[10px] text-gray-400 mb-1">id: {listObj.id}</div>
                   <motion.div layout className="flex gap-2 flex-wrap justify-center border-2 border-blue-100 p-2 rounded-lg bg-blue-50/50">
                     <AnimatePresence>
                       {elements.map((ptr, idx) => {
                         const targetObj = event.heap[ptr.to_id];
                         const displayValue = targetObj ? JSON.stringify(targetObj.value) : 'ref';
                         return (
                           <motion.div 
                             key={`${listObj.id}-${ptr.to_id}-${idx}`}
                             layout
                             initial={{ opacity: 0, y: -20, scale: 0.8 }}
                             animate={{ opacity: 1, y: 0, scale: 1 }}
                             exit={{ opacity: 0, scale: 0, y: 20 }}
                             transition={{ type: "spring", stiffness: 300, damping: 25 }}
                             className="w-12 h-12 bg-white border-2 border-blue-400 rounded-md shadow-sm flex flex-col items-center justify-center relative"
                           >
                             <span className="font-bold text-blue-600 text-sm">{displayValue}</span>
                             <span className="absolute -bottom-5 text-[9px] text-gray-400 font-mono">{idx}</span>
                           </motion.div>
                         );
                       })}
                       {elements.length === 0 && <div className="text-gray-400 text-sm italic px-4 py-2">Empty List</div>}
                     </AnimatePresence>
                   </motion.div>
                 </div>
               );
            })}
          </div>
        </div>
      )}

      {/* Objects / Dicts (Nodes / Graphs) */}
      {dicts.length > 0 && (
        <div className="w-full mt-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Objects (Dicts / Nodes)</h3>
          <div className="flex flex-wrap gap-4 justify-center">
            {dicts.map(dictObj => (
              <motion.div 
                key={dictObj.id} 
                layout
                className="bg-white border-2 border-green-200 rounded-lg p-3 shadow-sm min-w-[120px] text-left"
              >
                <div className="text-[10px] text-green-600 font-bold border-b border-green-100 pb-1 mb-1">
                  Dict: {dictObj.id}
                </div>
                {dictObj.pointers.length > 0 ? (
                  <div className="flex flex-col gap-1 mt-2">
                    {dictObj.pointers.map(ptr => (
                      <div key={ptr.label} className="text-xs font-mono flex justify-between gap-4">
                        <span className="text-gray-600">{ptr.label}:</span>
                        <span className="text-orange-500 font-bold">ref({ptr.to_id})</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-gray-400 italic">Empty or primitive dict</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Variables */}
      <div className="w-full mt-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Active Variables</h3>
        <div className="flex flex-wrap gap-2 justify-center">
          {primitives.map(([k, v]) => (
            <motion.div 
              key={k}
              layout
              className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded shadow-sm font-mono text-sm flex gap-2 items-center"
            >
              <span className="text-purple-700 font-bold">{k}</span>
              <span className="text-gray-400">=</span>
              <span className="text-gray-900">{String(v)}</span>
            </motion.div>
          ))}
          {primitives.length === 0 && <div className="text-gray-400 text-sm">No local primitives</div>}
        </div>
      </div>

    </div>
  );
};
