import React, { useState, useEffect } from 'react';
import { Play, Square } from 'lucide-react';
import { CodeEditor } from '../components/editor/CodeEditor';
import { VCRControls } from '../components/player/VCRControls';
import { MemoryPanel } from '../components/memory/MemoryPanel';
import { useTraceStore } from '../store/traceStore';
import { runPythonCode } from '../lib/pyodideRunner';

const DEFAULT_CODE = `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                # Swap
                temp = arr[j]
                arr[j] = arr[j+1]
                arr[j+1] = temp

my_list = [64, 34, 25, 12, 22]
bubble_sort(my_list)
print("Sorted array is:", my_list)
`;

export const Trace: React.FC = () => {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [isCompiling, setIsCompiling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { events, setEvents, currentIndex } = useTraceStore();

  const handleRun = async () => {
    setIsCompiling(true);
    setError(null);
    try {
      const traceEvents = await runPythonCode(code);
      setEvents(traceEvents);
    } catch (err: any) {
      setError(err.message || 'An error occurred during execution.');
    } finally {
      setIsCompiling(false);
    }
  };

  const currentEvent = events[currentIndex];

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-100">
      
      {/* Top Toolbar */}
      <div className="flex justify-between items-center px-4 py-2 bg-white border-b shadow-sm z-10">
        <div className="flex items-center gap-4">
          <span className="font-bold text-gray-700">Code Trace Mode</span>
          <select className="border p-1 rounded text-sm bg-gray-50"><option>Python 3 (Pyodide)</option></select>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleRun} 
            disabled={isCompiling}
            className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded shadow-sm text-sm disabled:opacity-50"
          >
            <Play size={16} /> {isCompiling ? 'Running...' : 'Run'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Column: Code Editor */}
        <div className="w-1/3 flex flex-col border-r border-gray-300 p-2">
          <div className="flex-1 min-h-0">
             <CodeEditor 
                code={code} 
                onChange={(val) => setCode(val || '')} 
                activeLine={currentEvent?.line}
             />
          </div>
          
          {/* Explanation Panel */}
          <div className="h-24 mt-2 bg-blue-50 border border-blue-200 rounded p-2 overflow-y-auto">
            <h4 className="text-xs font-bold text-blue-800 uppercase mb-1">What's Happening</h4>
            <p className="text-sm text-gray-700 font-mono">
              {currentEvent ? currentEvent.explanation : 'Write Python code and click Run to trace execution.'}
            </p>
          </div>
        </div>

        {/* Right Column: Visualization & Memory */}
        <div className="w-2/3 flex flex-col p-2 gap-2">
          
          {/* Data Structure Canvas Placeholder */}
          <div className="h-1/3 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center p-4 relative overflow-hidden">
             {events.length === 0 ? (
               <span className="text-gray-400">Data Structure Canvas (Run code to see visualizations)</span>
             ) : (
               <div className="flex flex-col items-center text-center">
                 <span className="text-blue-500 mb-2 font-bold uppercase tracking-wider text-xs">Runtime Values Detected</span>
                 <div className="flex gap-2 flex-wrap justify-center">
                   {/* Fallback variables rendering */}
                   {currentEvent?.stack.length > 0 && Object.entries(currentEvent.stack[0].locals).map(([k, v]) => (
                     <div key={k} className="px-3 py-1 bg-blue-100 border border-blue-300 rounded shadow-sm font-mono text-sm">
                       {k} = {typeof v === 'object' && v?.__id ? 'Ref' : String(v)}
                     </div>
                   ))}
                 </div>
               </div>
             )}
          </div>

          {/* Memory Panel */}
          <div className="flex-1 min-h-0">
             <MemoryPanel />
          </div>

          {/* Output Console */}
          <div className="h-24 bg-gray-900 border-t-4 border-gray-700 rounded-lg p-2 overflow-y-auto text-green-400 font-mono text-xs shadow-inner">
            <div className="text-gray-500 mb-1">STDOUT:</div>
            <pre>{currentEvent?.stdout || ''}</pre>
          </div>

        </div>
      </div>

      {/* VCR Controls */}
      <div className="h-24">
         <VCRControls />
      </div>

    </div>
  );
};
