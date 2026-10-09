import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const HeapVisualizer: React.FC = () => {
  const [heap, setHeap] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => setLogs(prev => [...prev, msg].slice(-8));

  const insert = () => {
    if (!inputValue) return;
    const val = parseInt(inputValue);
    setInputValue('');
    
    const newHeap = [...heap, val];
    let curr = newHeap.length - 1;

    // Heapify Up (Min Heap)
    while (curr > 0) {
      let parent = Math.floor((curr - 1) / 2);
      if (newHeap[curr] < newHeap[parent]) {
        [newHeap[curr], newHeap[parent]] = [newHeap[parent], newHeap[curr]];
        curr = parent;
      } else {
        break;
      }
    }
    
    setHeap(newHeap);
    addLog(`Inserted ${val}`);
  };

  const extractMin = () => {
    if (heap.length === 0) {
      addLog("Heap is empty!");
      return;
    }
    if (heap.length === 1) {
      addLog(`Extracted Min: ${heap[0]}`);
      setHeap([]);
      return;
    }

    const min = heap[0];
    const newHeap = [...heap];
    newHeap[0] = newHeap.pop()!;
    
    // Heapify Down
    let curr = 0;
    while (true) {
      let left = 2 * curr + 1;
      let right = 2 * curr + 2;
      let smallest = curr;

      if (left < newHeap.length && newHeap[left] < newHeap[smallest]) {
        smallest = left;
      }
      if (right < newHeap.length && newHeap[right] < newHeap[smallest]) {
        smallest = right;
      }
      
      if (smallest !== curr) {
        [newHeap[curr], newHeap[smallest]] = [newHeap[smallest], newHeap[curr]];
        curr = smallest;
      } else {
        break;
      }
    }
    
    setHeap(newHeap);
    addLog(`Extracted Min: ${min}`);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-4">Min-Heap Visualizer</h2>
        
        <div className="flex gap-2 mb-6">
          <input 
            type="number" 
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)} 
            className="border p-2 rounded w-24"
            placeholder="Val"
          />
          <button onClick={insert} className="bg-orange-600 text-white px-4 py-2 rounded">Insert</button>
          <button onClick={extractMin} className="bg-red-600 text-white px-4 py-2 rounded">Extract Min</button>
          <button onClick={() => {setHeap([]); addLog("Heap Cleared");}} className="bg-gray-600 text-white px-4 py-2 rounded">Clear</button>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm mb-4">
          <h3 className="font-bold text-gray-700 mb-2">Array Representation</h3>
          <div className="flex gap-1 overflow-x-auto p-2">
            <AnimatePresence>
              {heap.map((val, idx) => (
                <motion.div 
                  key={idx + '-' + val}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="w-12 h-12 flex items-center justify-center bg-orange-100 border-2 border-orange-400 rounded-md font-bold text-orange-800"
                >
                  {val}
                </motion.div>
              ))}
              {heap.length === 0 && <span className="text-gray-400 italic">Empty</span>}
            </AnimatePresence>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm min-h-[300px] flex items-center justify-center relative overflow-hidden">
           {/* Tree representation (Simplified conceptual render) */}
           <div className="text-center text-gray-400">
             {heap.length > 0 ? (
               <div className="font-mono text-sm text-gray-600 whitespace-pre-wrap leading-loose">
                 {/* Extremely basic tree render via array indices for simplicity in react bounds */}
                 Level 0: {heap[0]} <br/>
                 Level 1: {heap[1] ?? '-'} | {heap[2] ?? '-'} <br/>
                 Level 2: {heap[3] ?? '-'} {heap[4] ?? '-'} | {heap[5] ?? '-'} {heap[6] ?? '-'} <br/>
                 Level 3: ...
               </div>
             ) : 'Tree visualization will appear here.'}
           </div>
        </div>
      </div>

      <div className="w-80">
        <div className="bg-gray-100 p-4 rounded-lg h-64 overflow-y-auto">
          <h3 className="font-bold mb-2">Operation Log</h3>
          <ul className="text-sm space-y-1">
            {logs.map((log, i) => <li key={i} className="border-b pb-1">{log}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
};
