import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, RotateCcw, HelpCircle, Moon, Play, Plus, Minus, Code } from 'lucide-react';
import { VCRControls } from '../components/player/VCRControls';
import { MemoryPanel } from '../components/memory/MemoryPanel';
import { useTraceStore } from '../store/traceStore';
import { runPythonCode } from '../lib/pyodideRunner';
import { generatePythonScript, type Operation } from '../lib/scriptGenerator';
import { AnimatedStructureView } from '../components/structures/AnimatedStructureView';

export const LearnDS: React.FC = () => {
  const { ds } = useParams<{ ds: string }>();
  const { events, setEvents, currentIndex, reset, setCurrentIndex } = useTraceStore();
  
  const [isRunning, setIsRunning] = useState(false);
  const [operations, setOperations] = useState<Operation[]>([]);
  const [inputValue, setInputValue] = useState('');
  
  const currentEvent = events[currentIndex];
  const formatTitle = (str: string) => str.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // Automatically trace when operations change
  useEffect(() => {
    if (operations.length === 0) return;
    
    const runTrace = async () => {
      setIsRunning(true);
      try {
        const pyCode = generatePythonScript(ds || 'array', operations);
        const traceEvents = await runPythonCode(pyCode);
        setEvents(traceEvents);
        // Jump to the end to see the result of the action immediately
        setCurrentIndex(traceEvents.length > 0 ? traceEvents.length - 1 : 0);
      } catch (err: any) {
        console.error(err);
      } finally {
        setIsRunning(false);
      }
    };
    runTrace();
  }, [operations, ds, setEvents, setCurrentIndex]);

  const handlePush = () => {
    if (!inputValue) return;
    setOperations([...operations, { op: ds === 'queue' ? 'enqueue' : 'push', val: inputValue }]);
    setInputValue('');
  };

  const handlePop = () => {
    setOperations([...operations, { op: ds === 'queue' ? 'dequeue' : 'pop' }]);
  };

  const handleClear = () => {
    setOperations([]);
    setEvents([]);
    reset();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50 overflow-hidden">
      
      {/* 1. Top Bar */}
      <div className="flex justify-between items-center px-4 py-2 bg-white border-b border-gray-200 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Link to="/learn" className="text-gray-500 hover:text-blue-600 transition flex items-center gap-1 text-sm font-medium">
            <ArrowLeft size={16} /> Back to Learn
          </Link>
          <div className="h-6 w-px bg-gray-300"></div>
          <h1 className="font-extrabold text-gray-800 text-lg">{formatTitle(ds || 'Interactive Lab')} Visualizer</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleClear} className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition font-medium">
            <RotateCcw size={14} /> Clear
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* 2. Left Column: Operations & Pseudocode */}
        <div className="w-72 flex flex-col border-r border-gray-200 bg-white">
          <div className="p-4 border-b border-gray-100 bg-blue-50/30">
            <h3 className="font-bold text-xs uppercase text-gray-500 mb-3 tracking-wider">Dynamic Operations</h3>
            <div className="flex flex-col gap-2">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter value..." 
                className="border border-gray-300 rounded px-3 py-2 text-sm w-full outline-none focus:border-blue-500" 
                onKeyDown={(e) => e.key === 'Enter' && handlePush()}
              />
              <div className="flex gap-2">
                <button 
                  onClick={handlePush}
                  disabled={isRunning}
                  className="flex-1 bg-blue-600 text-white text-sm px-2 py-2 rounded shadow-sm hover:bg-blue-700 font-bold flex justify-center items-center gap-1 disabled:opacity-50"
                >
                  <Plus size={16} /> {ds === 'queue' ? 'Enqueue' : 'Push'}
                </button>
                <button 
                  onClick={handlePop}
                  disabled={isRunning || operations.length === 0}
                  className="flex-1 bg-red-100 text-red-700 border border-red-200 text-sm px-2 py-2 rounded shadow-sm hover:bg-red-200 font-bold flex justify-center items-center gap-1 disabled:opacity-50"
                >
                  <Minus size={16} /> {ds === 'queue' ? 'Dequeue' : 'Pop'}
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 bg-gray-900 text-gray-300 font-mono text-xs shadow-inner">
            <h3 className="text-gray-500 mb-2 uppercase font-bold tracking-widest text-[10px] flex items-center gap-1"><Code size={14}/> Generated Backend Code</h3>
            <pre className="whitespace-pre-wrap leading-relaxed text-green-400">
              {generatePythonScript(ds || 'array', operations)}
            </pre>
          </div>
        </div>

        {/* Middle & Right Columns */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* 3. Right Column / Top: Structure Canvas */}
          <div className="flex-1 relative bg-white overflow-hidden flex items-center justify-center p-4 border-b border-gray-200">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
            
            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
               {isRunning ? (
                 <div className="flex flex-col items-center text-blue-500 animate-pulse">
                   <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                   <p className="font-bold">Tracing Execution...</p>
                 </div>
               ) : (
                 <AnimatedStructureView ds={ds || 'array'} />
               )}
            </div>
          </div>

          {/* 4 & 5. Bottom Section: Memory & Panels */}
          <div className="h-64 flex border-b border-gray-200 bg-white">
            <div className="w-2/3 flex flex-col relative z-20 bg-white border-r border-gray-200">
              <MemoryPanel />
            </div>
            
            <div className="w-1/3 flex flex-col bg-white">
              <div className="h-1/2 p-3 border-b border-gray-100 overflow-y-auto">
                <h4 className="text-[10px] font-bold text-purple-600 uppercase mb-2">Complexity</h4>
                <div className="flex flex-col gap-2">
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1"><span>Time (Current Op)</span><span>O(1)</span></div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-green-400 w-1/4"></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1"><span>Space</span><span>O(N)</span></div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-blue-400 w-1/2"></div></div>
                  </div>
                </div>
              </div>
              <div className="h-1/2 p-3 bg-blue-50 overflow-y-auto">
                <h4 className="text-[10px] font-bold text-blue-800 uppercase mb-1">What's Happening</h4>
                <p className="text-sm text-gray-700 font-medium leading-relaxed">
                  {currentEvent?.explanation || `Awaiting interactive operations... Type a value on the left and click Push/Enqueue.`}
                </p>
              </div>
            </div>
          </div>

          {/* 6. VCR Playback Controls */}
          <div className="h-16 bg-white flex items-center px-4 shadow-[0_-4px_10px_rgba(0,0,0,0.02)] relative z-10">
             <div className="w-full">
               <VCRControls />
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};
