import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StackFrame {
  id: string;
  funcName: string;
  vars: Record<string, any>;
  returnAddress: string;
}

interface HeapBlock {
  id: string;
  address: string;
  size: number;
  isFree: boolean;
  data: string;
  hasPointer: boolean;
}

export const MemoryVisualizer: React.FC = () => {
  const [callStack, setCallStack] = useState<StackFrame[]>([]);
  const [heap, setHeap] = useState<HeapBlock[]>([
    { id: '1', address: '0x1000', size: 32, isFree: true, data: '', hasPointer: false },
    { id: '2', address: '0x1020', size: 64, isFree: true, data: '', hasPointer: false },
    { id: '3', address: '0x1060', size: 16, isFree: true, data: '', hasPointer: false },
  ]);
  const [logs, setLogs] = useState<string[]>([]);
  
  const addLog = (msg: string) => setLogs(prev => [...prev, msg].slice(-12));

  // Call Stack Simulation
  const simulateCall = () => {
    if (callStack.length > 5) {
      addLog("ERROR: Stack Overflow!");
      return;
    }
    const depth = callStack.length;
    const newFrame: StackFrame = {
      id: Math.random().toString(),
      funcName: `factorial(${5 - depth})`,
      vars: { n: 5 - depth, res: '?' },
      returnAddress: depth === 0 ? 'main()' : `factorial(${6 - depth})`
    };
    setCallStack(prev => [...prev, newFrame]);
    addLog(`Called ${newFrame.funcName}`);
  };

  const simulateReturn = () => {
    if (callStack.length === 0) {
      addLog("Call Stack is empty");
      return;
    }
    const frame = callStack[callStack.length - 1];
    setCallStack(prev => prev.slice(0, -1));
    addLog(`Returned from ${frame.funcName}`);
  };

  // Heap Simulation
  const allocateHeap = () => {
    const freeBlockIndex = heap.findIndex(b => b.isFree);
    if (freeBlockIndex === -1) {
      addLog("ERROR: Heap Out of Memory!");
      return;
    }
    const newHeap = [...heap];
    newHeap[freeBlockIndex] = {
      ...newHeap[freeBlockIndex],
      isFree: false,
      data: 'Obj_' + Math.floor(Math.random() * 1000),
      hasPointer: true // Simulating a reference from stack
    };
    setHeap(newHeap);
    addLog(`Allocated at ${newHeap[freeBlockIndex].address}`);
  };

  const freeHeap = (index: number) => {
    const newHeap = [...heap];
    const block = newHeap[index];
    if (block.isFree) return;
    
    newHeap[index] = { ...block, isFree: true, data: '', hasPointer: false };
    setHeap(newHeap);
    addLog(`Freed memory at ${block.address}`);
  };

  const triggerGC = () => {
    addLog("Garbage Collector running...");
    const newHeap = heap.map(block => {
      // Simulate GC: if not free but has no pointer (simulated by random chance for demo, or we can just sweep specific ones)
      if (!block.isFree && !block.hasPointer) {
        addLog(`GC: Swept unreachable block at ${block.address}`);
        return { ...block, isFree: true, data: '' };
      }
      return block;
    });
    setHeap(newHeap);
  };

  const createMemoryLeak = () => {
    // Allocate a block and remove its pointer immediately
    const freeBlockIndex = heap.findIndex(b => b.isFree);
    if (freeBlockIndex === -1) {
      addLog("Heap is full. Cannot create leak.");
      return;
    }
    const newHeap = [...heap];
    newHeap[freeBlockIndex] = {
      ...newHeap[freeBlockIndex],
      isFree: false,
      data: 'Leaked_Data',
      hasPointer: false // No references! Memory leak.
    };
    setHeap(newHeap);
    addLog(`Memory Leak created at ${newHeap[freeBlockIndex].address}! No pointers reference it.`);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6">
      
      {/* Call Stack Panel */}
      <div className="flex-1 bg-white p-4 rounded-lg shadow border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-purple-700">Call Stack</h2>
          <div className="space-x-2">
            <button onClick={simulateCall} className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700">Call fn()</button>
            <button onClick={simulateReturn} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">Return</button>
          </div>
        </div>
        
        <div className="flex flex-col-reverse justify-start border-x-2 border-b-2 border-gray-400 w-full bg-gray-50 p-2 min-h-[300px]">
          <AnimatePresence>
            {callStack.map((frame, idx) => (
              <motion.div
                key={frame.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="w-full bg-purple-100 border border-purple-300 p-2 mb-2 rounded text-sm"
              >
                <div className="font-bold text-purple-800">{frame.funcName}</div>
                <div className="text-gray-600 text-xs">Return: {frame.returnAddress}</div>
                <div className="mt-1 pt-1 border-t border-purple-200">
                  {Object.entries(frame.vars).map(([k, v]) => (
                    <span key={k} className="mr-3 font-mono text-xs">{k}: {v}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {callStack.length === 0 && <div className="text-center text-gray-400 mt-auto mb-auto">Stack is empty</div>}
        </div>
      </div>

      {/* Heap Memory Panel */}
      <div className="flex-1 bg-white p-4 rounded-lg shadow border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-green-700">Heap Memory</h2>
          <div className="space-x-2">
            <button onClick={allocateHeap} className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">new / malloc()</button>
            <button onClick={createMemoryLeak} className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600">Create Leak</button>
            <button onClick={triggerGC} className="bg-teal-600 text-white px-3 py-1 rounded text-sm hover:bg-teal-700">Run GC</button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {heap.map((block, idx) => (
            <div 
              key={block.id} 
              className={`p-3 border-2 rounded flex justify-between items-center transition-colors ${block.isFree ? 'border-dashed border-gray-400 bg-gray-50' : (block.hasPointer ? 'border-green-500 bg-green-50' : 'border-orange-500 bg-orange-50')}`}
            >
              <div>
                <div className="font-mono text-sm font-bold text-gray-700">{block.address}</div>
                <div className="text-xs text-gray-500">Size: {block.size} bytes</div>
              </div>
              
              <div className="text-center flex-1 font-mono text-sm">
                {block.isFree ? <span className="text-gray-400">Free Block</span> : 
                  (block.hasPointer ? <span className="text-green-700 font-bold">{block.data}</span> : 
                  <span className="text-orange-600 font-bold" title="Unreachable! Memory Leak!">{block.data} (Leaked)</span>)
                }
              </div>

              <div>
                {!block.isFree && (
                  <button onClick={() => freeHeap(idx)} className="text-xs bg-red-100 text-red-600 hover:bg-red-200 px-2 py-1 rounded border border-red-300">
                    delete / free()
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logs Panel */}
      <div className="w-full lg:w-64 bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs shadow overflow-y-auto max-h-[400px]">
        <h3 className="text-white font-bold mb-2 border-b border-gray-700 pb-1">System Logs</h3>
        <ul className="space-y-1">
          {logs.map((log, i) => (
            <li key={i} className={log.includes('ERROR') ? 'text-red-400' : (log.includes('Leak') ? 'text-orange-400' : '')}>
              &gt; {log}
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};
